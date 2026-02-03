export default class NotFoundPage {
  async render() {
    return `
      <section class="container not-found-page">
        <h1 tabindex="0">404 - Not Found</h1>

        <p>
          Halaman yang kamu tuju tidak ditemukan.
        </p>

        <a href="#/" class="btn-primary">
          Kembali ke Beranda
        </a>
      </section>
    `;
  }

  async afterRender() {
    // Fokus otomatis untuk aksesibilitas
    const heading = document.querySelector('.not-found-page h1');
    if (heading) heading.focus();
  }
}
