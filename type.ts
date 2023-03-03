// RecruitmentBoard

export interface CoordinateType {
  lat: number;
  lng: number;
}

export interface ParticipationType {
  userId?: string;
  userPhoto?: string;
}

export interface RecruitPostType {
  title?: string;
  content?: string;
  id: string;
  userId?: string;
  nickName?: string;
  userPhoto?: string;
  region?: string;
  gymName?: string;
  startTime?: string;
  endTime?: string;
  coordinate?: CoordinateType;
  selectedDays?: string[];
  participation?: ParticipationType[];
  createdAt?: number;
}

export interface UserProfileType {
  area?: string;
  displayName?: string;
  email?: string;
  follower?: string[];
  following?: string[];
  instagram?: string;
  introduction?: string;
  lv?: number;
  lvName?: string;
  photoURL?: string;
  loginState?: boolean;
  userParticipation?: RecruitPostType[];
  uid?: string;
}

export interface EditRecruitPostParameterType {
  recruitPostId: string;
  edittedRecruitPost: object;
}

export interface editUserParticipationParameterType {
  userId: string;
  edittedProfile: object;
}

export interface EditCommentLikeParameterType {
  commentId: string;
  edittedComment: object;
}

export interface MapModalProps {
  setCoordinate: React.Dispatch<React.SetStateAction<CoordinateType>>;
  coordinate: CoordinateType;
}

export interface SearchMyGymProps {
  setCoordinate: React.Dispatch<React.SetStateAction<CoordinateType>>;
  coordinate: CoordinateType;
  setOpenMap: React.Dispatch<React.SetStateAction<boolean>>;
  setGymName: React.Dispatch<React.SetStateAction<string>>;
  setDetailAddress: React.Dispatch<React.SetStateAction<string>>;
}

export interface WorkOutTimeType {
  start: string;
  end: string;
}

export interface DropDownProps {
  setStart: React.Dispatch<React.SetStateAction<string>>;
  setEnd: React.Dispatch<React.SetStateAction<string>>;
}

export interface MyPositionType {
  center: {
    lat: number;
    lng: number;
  };
  errMsg: string;
  isLoading: boolean;
}

export interface MyLocationProps {
  myPosition: MyPositionType;
  setMyPosition: React.Dispatch<React.SetStateAction<MyPositionType>>;
}

export interface CommentType {
  id: string;
  userId?: string;
  nickName?: string;
  userPhoto?: string;
  comment?: string;
  postId?: string;
  like?: [];
  likeCount?: number;
  createdAt?: number;
}

export interface DayType {
  mon: boolean;
  tus: boolean;
  wed: boolean;
  thurs: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
  every: boolean;
  selectedDays: string[];
  setMon: React.Dispatch<React.SetStateAction<boolean>>;
  setTus: React.Dispatch<React.SetStateAction<boolean>>;
  setWed: React.Dispatch<React.SetStateAction<boolean>>;
  setThurs: React.Dispatch<React.SetStateAction<boolean>>;
  setFri: React.Dispatch<React.SetStateAction<boolean>>;
  setSat: React.Dispatch<React.SetStateAction<boolean>>;
  setSun: React.Dispatch<React.SetStateAction<boolean>>;

  setEvery: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDays: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface BoardCommentType {
  id: string;
  user?: string;
  nickName?: string;
  photo?: string;
  boardComment?: string;
  postId?: string;
  createdAt?: number;
}

export interface GalleryCommentType {
  id: string;
  user?: string;
  nickName?: string;
  photo?: string;
  galleryComment?: string;
  postId?: string;
  createdAt?: number;
}

// export interface InitialSelectedDaysType {
//   monday: boolean;
//   tuesday: boolean;
//   wednesday: boolean;
//   thursday: boolean;
//   friday: boolean;
//   saturday: boolean;
//   sunday: boolean;
//   everyday: boolean;
// }

export interface BoardPostType {
  item?: any;
  id?: string;
  title?: string;
  photo?: string;
  content?: string;
  createdAt?: number;
  category?: string;
  userId?: string;
  nickName?: string;
  like?: string;
  usePhoto?: string;
  userLv?: string;
  userLvName?: string;
}
export interface GalleryBoardPostType {
  title?: string;
  item?: any;
  content?: string;
  id?: string;
  photo?: string;
  createdAt?: number;
  userId?: string;
  nickName?: string;
  like?: string;
  userPhoto?: string;
  userLv?: string;
  userLvName?: string;
}
