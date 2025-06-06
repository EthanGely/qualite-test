describe('Recherche de livres', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/books.html');
  });

  it('Tous les livres sont visibles par défaut', () => {
    cy.get('#book-list li').should('have.length', 3).and('be.visible');
    cy.get('#no-results').should('not.be.visible');
    cy.screenshot('books-tous-visibles');
  });

  it('Lorsque l’utilisateur tape "dune", seul "Dune" est visible', () => {
    cy.get('#search').type('dune');
    cy.get('#book-list li').should('have.length', 3);
    cy.get('#book-list li').each(($li) => {
      if ($li.text().toLowerCase().includes('dune')) {
        cy.wrap($li).should('be.visible');
      } else {
        cy.wrap($li).should('not.be.visible');
      }
    });
    cy.get('#no-results').should('not.be.visible');
    cy.screenshot('books-dune');
  });

  it('Lorsque l’utilisateur tape un terme inexistant, aucun livre n’est visible et le message "Aucun résultat" s’affiche', () => {
    cy.get('#search').type('inexistant');
    cy.get('#book-list li').should('have.length', 3);
    cy.get('#book-list li').each(($li) => {
      cy.wrap($li).should('not.be.visible');
    });
    cy.get('#no-results').should('be.visible').and('contain', 'Aucun résultat');
    cy.screenshot('books-aucun-resultat');
  });

  it('Recherche par auteur ("orwell")', () => {
    cy.get('#search').type('orwell');
    cy.get('#book-list li').should('have.length', 3);
    cy.get('#book-list li').each(($li) => {
      if ($li.text().toLowerCase().includes('1984')) {
        cy.wrap($li).should('be.visible');
      } else {
        cy.wrap($li).should('not.be.visible');
      }
    });
    cy.get('#no-results').should('not.be.visible');
    cy.screenshot('books-orwell');
  });

  it('Réactivité : input vidé = tous les livres réapparaissent', () => {
    cy.get('#search').type('gatsby');
    cy.get('#book-list li').each(($li) => {
      if ($li.text().toLowerCase().includes('gatsby')) {
        cy.wrap($li).should('be.visible');
      } else {
        cy.wrap($li).should('not.be.visible');
      }
    });
    cy.get('#search').clear();
    cy.get('#book-list li').should('have.length', 3).and('be.visible');
    cy.get('#no-results').should('not.be.visible');
    cy.screenshot('books-reapparition');
  });
});