export function renderNavigation() {
  const navList = document.getElementById('nav-list');
  if (!navList) return;

  const token = localStorage.getItem('token');

  if (token) {
    // SUDAH LOGIN
    navList.innerHTML = `
      <li><a href="#/">Beranda</a></li>
      <li><a href="#/add">Tambah Cerita</a></li>
      <li>
        <button id="logoutBtn" class="logout-btn">Logout</button>
      </li>
    `;

    document
      .getElementById('logoutBtn')
      .addEventListener('click', () => {
        localStorage.removeItem('token');
        location.hash = '#/login';
      });
  } else {
    // BELUM LOGIN
    navList.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
  }
}
