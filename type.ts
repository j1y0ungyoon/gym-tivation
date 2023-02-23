// RecruitmentBoard

export interface CoordinateType {
  lat: number;
  lng: number;
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
  createdAt?: number;
}

export interface EditRecruitPostParameterType {
  recruitPostId: string;
  edittedRecruitPost: object;
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
  photo?: any;
  content?: string;
  createdAt?: number;
  category?: string;
}
