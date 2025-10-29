document.addEventListener('input', (e) => {
  const { id, value } = e.target;

  if (id === 'cpf') {
    e.target.value = value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  if (id === 'telefone') {
    e.target.value = value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{4})$/, '$1-$2');
  }

  if (id === 'cep') {
    e.target.value = value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
  }
});
