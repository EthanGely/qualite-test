describe('Shop', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/shop.html');
  });

  it('Tous les produits sont visibles', () => {
    cy.get('#products li').should('have.length', 2).and('be.visible');
  });

  it('Cliquer sur “Ajouter” ajoute bien le produit au panier', () => {
    cy.contains('T-shirt').find('.add-to-cart').click();
    cy.get('#cart li').should('contain', 'T-shirt - 20€');
  });

  it('Le total est mis à jour correctement', () => {
    cy.contains('T-shirt').find('.add-to-cart').click();
    cy.contains('Mug').find('.add-to-cart').click();
    cy.get('#total').should('have.text', '30');
  });

  it('Le formulaire n’apparaît que si un produit a été ajouté', () => {
    cy.get('#checkout-form').should('not.be.visible');
    cy.contains('Mug').find('.add-to-cart').click();
    cy.get('#checkout-form').should('be.visible');
  });

  it('Empêcher la commande si : Nom vide, Email invalide, CGU non cochée', () => {
    cy.contains('T-shirt').find('.add-to-cart').click();
    cy.get('#checkout-form').should('be.visible');
    cy.get('#email').type('notanemail');
    cy.get('#cgu').check();
    cy.get('#submit-order').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.include('Formulaire invalide');
    });
    cy.get('#confirmation').should('not.be.visible');
  });

  it('Empêcher la commande si : CGU non cochée', () => {
    cy.contains('Mug').find('.add-to-cart').click();
    cy.get('#name').type('Alice');
    cy.get('#email').type('alice@example.com');
    cy.get('#cgu').uncheck();
    cy.get('#submit-order').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.include('Formulaire invalide');
    });
    cy.get('#confirmation').should('not.be.visible');
  });

  it('Valider la commande complète et vérifier le message de confirmation', () => {
    cy.contains('T-shirt').find('.add-to-cart').click();
    cy.get('#name').type('Bob');
    cy.get('#email').type('bob@example.com');
    cy.get('#cgu').check();
    cy.get('#submit-order').click();
    cy.get('#confirmation').should('be.visible').and('contain', 'Commande confirmée');
    cy.screenshot('confirmation-panier');
  });

  it('Vérifier que l’ajout de plusieurs produits fonctionne', () => {
    cy.contains('T-shirt').find('.add-to-cart').click();
    cy.contains('Mug').find('.add-to-cart').click();
    cy.get('#cart li').should('have.length', 2);
    cy.get('#total').should('have.text', '30');
  });

  it('Tester plusieurs erreurs combinées (ex : CGU + email vide)', () => {
    cy.contains('Mug').find('.add-to-cart').click();
    cy.get('#name').type('Charlie');
    cy.get('#email').clear();
    cy.get('#cgu').uncheck();
    cy.get('#submit-order').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.include('Formulaire invalide');
    });
    cy.get('#confirmation').should('not.be.visible');
  });

  it('Utilise des utilisateurs depuis fixtures/user.json', function () {
    cy.fixture('user').then((users) => {
      users.forEach((user) => {
        cy.visit('http://localhost:3000/shop.html');
        cy.contains('T-shirt').find('.add-to-cart').click();
        cy.get('#name').type(user.name);
        cy.get('#email').type(user.email);
        if (user.cgu) cy.get('#cgu').check();
        else cy.get('#cgu').uncheck();
        cy.get('#submit-order').click();
        if (user.valid) {
          cy.get('#confirmation').should('be.visible');
        } else {
          cy.get('#confirmation').should('not.be.visible');
        }
      });
    });
  });
});