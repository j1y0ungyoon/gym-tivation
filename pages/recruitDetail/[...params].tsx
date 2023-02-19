import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { editRecruitPost, deleteRecruitPost } from '../api/api';
import { EditRecruitPostParameterType, RecruitPostType } from '../type';
import { doc, onSnapshot } from 'firebase/firestore';
import { dbService } from '@/firebase';

const RecruitDetail = ({ params }: any) => {
  const router = useRouter();
  const [id] = params;

  // 초기값이 제대로 된 녀석이 있으면 옵셔널 처리 안해줘도 됨.
  const [refetchedPost, setRefetchedPost] = useState<RecruitPostType>();

  // 수정한 게시글을 실시간 감지해서 화면에 반영하기 위함.
  const getRefetchedPost = () => {
    const unsubscribe = onSnapshot(
      doc(dbService, 'recruitments', id),
      (doc) => {
        const data = doc.data();

        const newObj: RecruitPostType = {
          id: data?.id,
          title: data?.title,
          content: data?.content,
          createdAt: data?.createdAt,
        };

        setRefetchedPost(newObj);
      },
    );
    return unsubscribe;
  };

  // 해당 게시글 불러오기 useQuery

  const editTitleRef = useRef<HTMLInputElement>(null);
  const editContentRef = useRef<HTMLTextAreaElement>(null);

  const [changeForm, setChangeForm] = useState(false);
  const [editTitle, setEditTitle] = useState(refetchedPost?.content);
  const [editContent, setEditContent] = useState(refetchedPost?.title);

  // 게시글 수정 useMutation
  const { isLoading: isEditting, mutate: reviseRecruitPost } = useMutation(
    ['editRecruitPost', id],
    (body: EditRecruitPostParameterType) => editRecruitPost(body),
    {
      onSuccess: () => {
        console.log('수정 성공');
      },
      onError: (err) => {
        console.log('수정 실패:', err);
      },
    },
  );

  // 게시글 삭제 useMutation
  const { isLoading: isDeleting, mutate: removeRecruitPost } = useMutation(
    ['deleteRecruitPost', id],
    (body: string) => deleteRecruitPost(body),
    {
      onSuccess: () => {
        console.log('삭제성공');
      },
      onError: (err) => {
        console.log('삭제 실패:', err);
      },
    },
  );

  // 게시글 삭제 클릭 이벤트
  const onClickDeletePost = async () => {
    const answer = confirm('정말 삭제하시겠습니까?');

    if (answer) {
      try {
        await removeRecruitPost(id);
        router.push('/mapBoard');
      } catch (error) {
        console.log('에러입니다', error);
      }
    } else {
      return;
    }
  };

  // 게시글 수정을 위한 input open
  const onClickChangeForm = () => {
    setChangeForm(!changeForm);
    setEditContent(refetchedPost?.content);
    setEditTitle(refetchedPost?.title);
  };

  const onChangeEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;

    setEditTitle(value);
  };

  const onChangeEditContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const {
      currentTarget: { value },
    } = event;

    setEditContent(value);
  };

  // 게시글 수정
  const onSubmitEdittedPost = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!editTitle) {
      alert('제목을 작성해주세요!');
      editTitleRef.current?.focus();
      return;
    }

    if (!editContent) {
      alert('내용을 작성해주세요!');
      editContentRef.current?.focus();
      return;
    }

    let edittedRecruitPost = {};

    Object.assign(edittedRecruitPost, {
      title: editTitle,
      content: editContent,
    });

    try {
      await reviseRecruitPost({ recruitPostId: id, edittedRecruitPost });
      setEditTitle('');
      setEditContent('');
      setChangeForm(false);

      // detail에서 변경된 정보를 바로 불러오지 못하기 때문에 mapBoard로 경로 이동 시켜줘야 함.
      // useQuery를 이용하면 경로 이동을 안해도 될 것이므로 사용자가 수정하자마자 수정 내용을 바로 확인할 수 있게 가능할 것 같음.
      // 하지만 통신 비용이 더 들 수 있다.
      // router.push('/mapBoard');
    } catch (error) {
      console.log('에러입니다', error);
    }
  };

  useEffect(() => {
    getRefetchedPost();
  }, []);

  if (!refetchedPost) {
    return <div>데이터를 불러오고 있습니다.</div>;
  }

  // if (isLoading) {
  //   return <div>로딩중입니다....</div>;
  // }

  return (
    <>
      {isEditting ? (
        <div>게시물을 수정중입니다</div>
      ) : isDeleting ? (
        <div>게시물을 삭제중입니다</div>
      ) : (
        <>
          {changeForm ? (
            <div>
              <form onSubmit={onSubmitEdittedPost}>
                <input
                  defaultValue={refetchedPost?.title}
                  onChange={onChangeEditTitle}
                  ref={editTitleRef}
                />{' '}
                <br />
                <textarea
                  defaultValue={refetchedPost?.content}
                  onChange={onChangeEditContent}
                  ref={editContentRef}
                />{' '}
                <br />
                <span>{refetchedPost?.createdAt}</span> <br />
                <button>수정 완료</button>
              </form>
              <button onClick={onClickChangeForm}>취소</button>
            </div>
          ) : (
            <div>
              <h3>{refetchedPost?.title}</h3>
              <h4>{refetchedPost?.content}</h4>
              <span>{refetchedPost?.createdAt}</span> <br />
              <button onClick={onClickChangeForm}>수정</button>
              <button onClick={onClickDeletePost}>삭제</button>
            </div>
          )}
        </>
      )}
    </>
  );
};

// 정말 좋은 녀석...
export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}

export default RecruitDetail;
