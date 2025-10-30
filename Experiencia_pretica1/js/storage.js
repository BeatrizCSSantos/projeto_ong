export function saveToStorage(key, data) {
  try {
    const existingData = JSON.parse(localStorage.getItem(key) || '[]');
    existingData.push(data);
    localStorage.setItem(key, JSON.stringify(existingData));
    return true;
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
    return false;
  }
}

export function getFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    console.error('Erro ao ler do localStorage:', error);
    return [];
  }
}

export function clearStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error);
    return false;
  }
}
