export const validateTitle = (title: string) => {
  const trimTitle = title.trim();

  if (!trimTitle) {
    return 'Это поле не может быть пустым';
  } else if (trimTitle.length < 2) {
    return 'Минимальная длина текста 2 символа';
  }
  if (trimTitle.length > 64) {
    return 'Максимальная длина текста 64 символа';
  }
  return '';
};
