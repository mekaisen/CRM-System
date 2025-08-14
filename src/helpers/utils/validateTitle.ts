export const validateTitle = (value: any) => {
  if (value.length === 0) {
    return 'Это поле не может быть пустым';
  }
  if (value.length < 2 && value.length > 0) {
    return 'Минимальная длина текста 2 символа';
  }
  if (value.length > 64) {
    return 'Вставить можно текст длиной меньше 64 символа';
  }
  return '';
};
