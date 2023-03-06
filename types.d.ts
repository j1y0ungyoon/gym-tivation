declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.gif';

type ProfileItem = {
  id: string;
  area?: string;
  introduction?: string;
  instagram?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  loginState?: boolean;
  following?: string;
  follower?: string;
  uid?: string;
  lv?: number;
  lvName?: string;
};
type Board = {
  id: string;
  photo: string;
  userId: string;
  nickName: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  comment: number;
  like: [];
};
type Gallery = {
  id: string;
  photo: string;
  userId: string;
  nickName: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  comment: number;
  like: [];
};
type Follows = {
  id: string;
  area?: string;
  introduction?: string;
  instagram?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  loginState?: boolean;
  follower?: string;
  following?: string;
  uid?: string;
};

type FollowInformation = {
  item: Follows;
  userUid: string;
  follwoingInformation: string;
};
