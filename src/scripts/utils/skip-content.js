const initSkipToContent = () => {
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.querySelector('#main-content');

  if (!skipLink || !mainContent) return;

  skipLink.addEventListener('click', (event) => {
    event.preventDefault();
    skipLink.blur();

    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
    mainContent.scrollIntoView();
  });
};

export default initSkipToContent;
