export const validateTitle = (value: string) => {
  const title = value.trim()
  if (title.length === 0) {
    return 'Это поле не может быть пустым';
  }
  if (title.length < 2 && title.length > 0) {
    return 'Минимальная длина текста 2 символа';
  }
  if (title.length > 64) {
    return 'Вставить можно текст длиной меньше 64 символа';
  }
  return '';
};
