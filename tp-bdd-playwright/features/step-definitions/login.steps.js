import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { chromium } from 'playwright';
import LoginPage from '../../pages/LoginPage.js';

let browser;
let page;
let loginPage;

Given('je suis sur la page de connexion', async function () {
    browser = await chromium.launch();
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    await loginPage.goto();
});

When('je saisis un email et un mot de passe valides', async function () {
    await loginPage.fillEmail('valid@example.com');
    await loginPage.fillPassword('validPassword');
});

When('je saisis un email et un mot de passe invalides', async function () {
    await loginPage.fillEmail('invalid');
    await loginPage.fillPassword('wrongPassword');
});

When('je clique sur le bouton de connexion', async function () {
    await loginPage.submit();
});

Then('je dois être redirigé vers le tableau de bord', async function () {
    const url = page.url();
    expect(url).to.include('dashboard');
    await browser.close();
});

Then("un message d'erreur doit s'afficher", async function () {
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).to.include('invalide');
    await browser.close();
});