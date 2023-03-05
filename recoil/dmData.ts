import { atom } from 'recoil';

export interface DmData {
  apponentId: string;
}

export const apponentState = atom<string>({
  key: 'apponentState',
  default: '',
});

export const roomState = atom<string | null | undefined>({
  key: 'roomState',
  default: null,
});

export const dmListsState = atom({
  key: 'dmListsState',
  default: [],
});
