import { saveToStorage } from './storage.js';

export function initFormValidator() {
  document.addEventListener('input', handleInputMask);
  document.addEventListener('submit', handleFormSubmit);
}

function handleInputMask(e) {
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

  // Validação em tempo real
  validateField(e.target);
}

function handleFormSubmit(e) {
  if (e.target.matches('form')) {
    e.preventDefault();

    const form = e.target;
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach((input) => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      const formData = getFormData(form);
      saveToStorage('cadastro', formData);
      showMessage('Cadastro realizado com sucesso!', 'success');
      form.reset();
    } else {
      showMessage('Por favor, corrija os erros antes de enviar.', 'error');
    }
  }
}

function validateField(field) {
  clearFieldError(field);

  let isValid = true;
  let errorMessage = '';

  switch (field.id) {
    case 'nome':
      if (field.value.trim().length < 2) {
        errorMessage = 'Nome deve ter pelo menos 2 caracteres';
        isValid = false;
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        errorMessage = 'E-mail inválido';
        isValid = false;
      }
      break;

    case 'cpf':
      const cpf = field.value.replace(/\D/g, '');
      if (cpf.length !== 11 || !validateCPF(cpf)) {
        errorMessage = 'CPF inválido';
        isValid = false;
      }
      break;

    case 'telefone':
      const telefone = field.value.replace(/\D/g, '');
      if (telefone.length < 10) {
        errorMessage = 'Telefone inválido';
        isValid = false;
      }
      break;

    case 'data':
      const data = new Date(field.value);
      const hoje = new Date();
      if (data >= hoje) {
        errorMessage = 'Data de nascimento deve ser anterior a hoje';
        isValid = false;
      }
      break;

    case 'cep':
      const cep = field.value.replace(/\D/g, '');
      if (cep.length !== 8) {
        errorMessage = 'CEP inválido';
        isValid = false;
      }
      break;

    case 'estado':
      if (field.value.length !== 2) {
        errorMessage = 'Estado deve ter 2 caracteres';
        isValid = false;
      }
      break;
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  }

  return isValid;
}

function validateCPF(cpf) {
  if (cpf.length !== 11) return false;

  // Validação básica de CPF
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }

  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
}

function showFieldError(field, message) {
  field.classList.add('error');

  const errorElement = document.createElement('span');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.style.cssText = `
        color: #d32f2f;
        font-size: 0.8em;
        display: block;
        margin-top: 4px;
    `;

  field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
  field.classList.remove('error');
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
}

function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        font-weight: bold;
        background-color: ${type === 'success' ? '#4caf50' : '#d32f2f'};
    `;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

function getFormData(form) {
  const formData = new FormData(form);
  const data = {};

  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  data.timestamp = new Date().toISOString();
  return data;
}
