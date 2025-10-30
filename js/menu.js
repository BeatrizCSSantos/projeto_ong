export function initMenu() {
  const toggleButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleButton && navLinks) {
    toggleButton.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-links a')) {
        navLinks.classList.remove('active');
      }
    });
  }
}
