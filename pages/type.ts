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
