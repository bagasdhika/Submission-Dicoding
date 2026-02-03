import { isLoggedIn, removeToken } from '../utils/auth';

class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const loggedIn = isLoggedIn();

    this.innerHTML = `
      <header>
        <div class="main-header">
          <h1 class="brand-name">Story App</h1>

          <nav>
            <ul class="nav-list">
              ${
                loggedIn
                  ? `
                <li><a href="#/">Home</a></li>
                <li><a href="#/add-story">Add Story</a></li>
                <li>
                  <button id="logoutBtn" class="logout-btn">Logout</button>
                </li>
              `
                  : `
                <li><a href="#/login">Login</a></li>
                <li><a href="#/register">Register</a></li>
              `
              }
            </ul>
          </nav>
        </div>
      </header>
    `;

    if (loggedIn) {
      this.querySelector('#logoutBtn').addEventListener('click', () => {
        removeToken();
        location.hash = '#/login';
      });
    }
  }
}

customElements.define('app-bar', AppBar);
