import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { renderNavigation } from '../utils/navigation';
import NotFoundPage from '../pages/not-found/not-found-page';

export default class App {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    const route = getActiveRoute();

    // ===== ROUTE GUARD (404 SAFE) =====
    const PageClass = routes[route] || NotFoundPage;
    const page = new PageClass();

    const renderContent = async () => {
      this._content.innerHTML = await page.render();
      await page.afterRender();
      renderNavigation();
    };

    /* =====================================
       VIEW TRANSITION + FALLBACK (ADVANCE)
       ===================================== */
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await renderContent();
      });
    } else {
      // Fallback animation (Animation API)
      this._content.animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 250,
          easing: 'ease-out',
        }
      );

      await renderContent();
    }
  }
}
