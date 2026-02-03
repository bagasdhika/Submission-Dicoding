import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import NotFoundPage from '../pages/not-found/not-found-page';

/* =========================
   ROUTE → PAGE CLASS MAP
   ========================= */
const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/add': AddStoryPage,
};

export const getPage = (route) => {
  const PageClass = routes[route] || NotFoundPage;
  return new PageClass();
};

export default routes;
