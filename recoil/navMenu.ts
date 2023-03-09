import { atom } from 'recoil';

export const navMenuState = atom<string>({
  key: 'navMenuState',
  default: '',
});
