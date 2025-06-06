export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = "#email";
    this.passwordInput = "#password";
    this.submitButton = 'button[type="submit"]';
    this.errorMessage = "#error-message";
  }

  async goto() {
    await this.page.goto("http://localhost:3000/login");
  }

  async fillEmail(email) {
    await this.page.fill(this.emailInput, email);
  }

  async fillPassword(password) {
    await this.page.fill(this.passwordInput, password);
  }

  async submit() {
    await this.page.click(this.submitButton);
  }

  async isOnDashboard() {
    await this.page.waitForURL(/dashboard/);
  }

  async getErrorMessage() {
    return await this.page.textContent(this.errorMessage);
  }
}
