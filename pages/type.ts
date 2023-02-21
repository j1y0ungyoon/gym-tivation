// RecruitmentBoard

export interface RecruitPostType {
  title?: string;
  content?: string;
  id: string;
  // userId: string,
  // nickName: string,
  // category: string,
  // date: string,
  createdAt?: number;
}

export interface EditRecruitPostParameterType {
  recruitPostId: string;
  edittedRecruitPost: object;
}

export interface CoordinateType {
  lat: number;
  lng: number;
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

export interface BoardPostType {
  item?: any;
  id?: string;
  title?: string;
  photo?: any;
  content?: string;
  createdAt?: number;
  category?: string;
}
