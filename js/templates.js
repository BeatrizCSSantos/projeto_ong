const templateCache = new Map();

export async function loadTemplate(url) {
  console.log('Carregando template:', url);

  if (templateCache.has(url)) {
    console.log('Usando cache para:', url);
    return templateCache.get(url);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log('Template carregado com sucesso:', url);
    templateCache.set(url, html);
    return html;
  } catch (error) {
    console.error('Erro ao carregar template:', error);
    return `
            <section>
                <h2>Erro ao carregar página</h2>
                <p>Não foi possível carregar: ${url}</p>
                <p>Erro: ${error.message}</p>
                <a href="#home" data-link>Voltar para início</a>
            </section>
        `;
  }
}
