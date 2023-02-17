import styled from 'styled-components';
import { CalendarItem } from './MyPageCalendar';
import { useState } from 'react';
import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { dbService, authService } from '@/firebase';

type CalendarProps = {
  item: CalendarItem;
  setIsLoadCalendar: (p: boolean) => void;
};

const CalendarEdit = ({ item, setIsLoadCalendar }: CalendarProps) => {
  const [textAreaContent, setTextAreaContent] = useState(item.content);

  const onClickEditCalendar = async (id: string) => {
    try {
      let con = window.confirm('수정하시겠습니까?');
      if (con === true) {
        await updateDoc(doc(dbService, 'calendar', id), {
          content: textAreaContent,
        });
        alert('수정 완료');
      } else {
        alert('취소하였습니다.');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const onClickDeleteCalendar = async (id: string) => {
    try {
      let con = window.confirm('삭제하시겠습니까?');
      if (con === true) {
        await deleteDoc(doc(dbService, 'calendar', id));
        setIsLoadCalendar(false);
        alert('삭제 완료');
      } else {
        alert('취소하였습니다.');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <CalendarContentBox key={item.id}>
      <CalendarTextArea
        value={textAreaContent}
        onChange={(e) => {
          setTextAreaContent(e.target.value);
        }}
        placeholder="일정"
      />
      <CalendarButton onClick={() => onClickEditCalendar(item.id)}>
        수정
      </CalendarButton>
      <CalendarButton onClick={() => onClickDeleteCalendar(item.id)}>
        삭제
      </CalendarButton>
    </CalendarContentBox>
  );
};

export default CalendarEdit;

const CalendarContentBox = styled.div``;
const CalendarTextArea = styled.textarea`
  padding-top: 2vh;
  width: 20vw;
  height: 42vh;
  border-radius: 20px;
  border: none;
  background-color: white;
  font-size: 16px;
  overflow: none;
  resize: none;
  :focus {
    outline: none;
  }
`;
const CalendarButton = styled.button`
  margin-top: 1vh;
  margin-left: 1vw;
  width: 4vw;
  height: 3vh;
  color: black;
  background-color: white;
  border: none;
  font-size: 16px;
  border-radius: 30px;
  :hover {
    cursor: pointer;
    background-color: #dee2e6;
  }
`;
