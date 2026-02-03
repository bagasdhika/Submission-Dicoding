import { loginUser } from '../../data/api';

export default class LoginPage {
  async render() {
    return `
      <section class="auth-container">
        <h1>Login</h1>

        <form id="loginForm" class="auth-form">
          <label for="loginEmail">Email</label>
          <input
            type="email"
            id="loginEmail"
            required
            autocomplete="username"
          />

          <label for="loginPassword">Password</label>
          <input
            type="password"
            id="loginPassword"
            required
            minlength="8"
            autocomplete="current-password"
          />

          <button type="submit" class="btn-primary">
            Login
          </button>
        </form>

        <p class="auth-switch">
          Belum punya akun?
          <a href="#/register" class="link-button">Daftar</a>
        </p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        /* ================= LOGIN (SUBMISSION 1 – WAJIB) ================= */
        const result = await loginUser({ email, password });

        if (result.error) {
          alert(result.message);
          return;
        }

        localStorage.setItem('token', result.loginResult.token);
        localStorage.setItem('name', result.loginResult.name);

        /* ================= REDIRECT ================= */
        location.hash = '#/';
      } catch (err) {
        alert('Login gagal');
        console.error(err);
      }
    });
  }
}
