const genderLabels = {
  FEMALE: 'Femenino',
  MALE: 'Masculino',
  OTHER: 'Otro'
};

export const normalizeGender = (value) => {
  if (!value) return '';

  const normalizedValue = String(value).trim().toUpperCase();

  return genderLabels[normalizedValue] ? normalizedValue : '';
};

export const getGenderLabel = (value) => genderLabels[normalizeGender(value)] || '';

export const getStoredGender = () => normalizeGender(localStorage.getItem('gender'));

export const findGender = (...values) => {
  for (const value of values) {
    const gender = normalizeGender(value);

    if (gender) return gender;
  }

  return '';
};
