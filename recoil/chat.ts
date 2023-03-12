import { atom } from 'recoil';

export const chatCategoryState = atom<boolean>({
  key: 'chatCategoryState',
  default: false,
});
