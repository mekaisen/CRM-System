import type { Rule } from 'rc-field-form/lib/interface';

export const rulesTitle: Rule[] = [
  { required: true, message: 'Это поле не может быть пустым' },
  { min: 2, message: 'Минимальная длина текста 2 символа' },
  { max: 64, message: 'Максимальная длина текста 64 символа' }
];
