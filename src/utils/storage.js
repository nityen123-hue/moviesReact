
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
  }
};
