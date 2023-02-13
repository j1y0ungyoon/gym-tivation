import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { editRecruitPost, deleteRecruitPost } from '../api/api';
import { EditRecruitPostParameterType } from '../type';

const RecruitDetail = ({ params }: any) => {
  const router = useRouter();
  const [id, title, content, createdAt] = params;

  const editTitleRef = useRef<HTMLInputElement>(null);
  const editContentRef = useRef<HTMLTextAreaElement>(null);

  const [changeForm, setChangeForm] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

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
      router.push('/mapBoard');
    } catch (error) {
      console.log('에러입니다', error);
    }
  };

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
                  defaultValue={title}
                  onChange={onChangeEditTitle}
                  ref={editTitleRef}
                />{' '}
                <br />
                <textarea
                  defaultValue={content}
                  onChange={onChangeEditContent}
                  ref={editContentRef}
                />{' '}
                <br />
                <span>{createdAt}</span> <br />
                <button>수정 완료</button>
              </form>
              <button onClick={onClickChangeForm}>취소</button>
            </div>
          ) : (
            <div>
              <h3>{title}</h3>
              <h4>{content}</h4>
              <span>{createdAt}</span> <br />
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
