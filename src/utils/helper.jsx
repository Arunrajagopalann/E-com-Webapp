// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateMobile = (mobile) => {
  // Basic mobile validation (10 digits)
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile);
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  
  if (strength < 2) return 'weak';
  if (strength < 4) return 'medium';
  return 'strong';
};

export const formatFormData = (formData) => {
  const formatted = {};
  Object.keys(formData).forEach(key => {
    formatted[key] = formData[key].trim();
  });
  return formatted;
};

export const logToConsole = (action, data) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${action}:`, data);
};