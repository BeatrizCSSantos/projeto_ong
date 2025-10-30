import { loadTemplate } from './templates.js';

const routes = {
  '#home': 'pages/home.html',
  '#projetos': 'pages/projetos.html',
  '#cadastro': 'pages/cadastro.html',
};

export function initRouter() {
  // Navegação inicial
  const initialHash = window.location.hash || '#home';
  navigateTo(initialHash);

  // Manipula clique nos links
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      navigateTo(href);
    }
  });

  // Manipula mudanças de hash
  window.addEventListener('hashchange', () => {
    loadPage(window.location.hash);
  });
}

export function navigateTo(path) {
  const hash = path.startsWith('#') ? path : `#${path.replace('/', '')}`;
  window.location.hash = hash;
  loadPage(hash);
}

async function loadPage(hash) {
  const route = routes[hash] || routes['#home'];

  try {
    const content = await loadTemplate(route);
    const main = document.querySelector('main');

    if (main) {
      main.style.opacity = '0';

      setTimeout(() => {
        main.innerHTML = content;
        main.style.opacity = '1';
        updateActiveLink(hash);

        document.dispatchEvent(
          new CustomEvent('pageLoaded', {
            detail: { hash },
          })
        );
      }, 200);
    }
  } catch (error) {
    console.error('Erro ao carregar página:', error);
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
                <section>
                    <h2>Erro ao carregar página</h2>
                    <p>A página solicitada não pôde ser carregada.</p>
                    <a href="#home" data-link>Voltar para início</a>
                </section>
            `;
    }
  }
}

function updateActiveLink(currentHash) {
  document.querySelectorAll('.nav-links a[data-link]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentHash) {
      link.classList.add('ativo');
    } else {
      link.classList.remove('ativo');
    }
  });
}
