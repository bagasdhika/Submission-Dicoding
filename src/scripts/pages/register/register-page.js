import { registerUser } from '../../data/api';

export default class RegisterPage {
  async render() {
    return `
      <section class="auth-container">
        <h1>Register</h1>

        <form id="registerForm" class="auth-form">
          <label for="regName">Nama</label>
          <input
            type="text"
            id="regName"
            required
          />

          <label for="regEmail">Email</label>
          <input
            type="email"
            id="regEmail"
            required
            autocomplete="username"
          />

          <label for="regPassword">Password</label>
          <input
            type="password"
            id="regPassword"
            required
            minlength="8"
            autocomplete="new-password"
          />

          <button type="submit" class="btn-primary">
            Daftar
          </button>
        </form>

        <p class="auth-switch">
          Sudah punya akun?
          <a href="#/login" class="link-button">Login</a>
        </p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;

      try {
        const result = await registerUser({ name, email, password });

        if (result.error) {
          alert(result.message);
          return;
        }

        alert('Registrasi berhasil, silakan login');
        location.hash = '#/login';
      } catch (err) {
        alert('Registrasi gagal');
        console.error(err);
      }
    });
  }
}
