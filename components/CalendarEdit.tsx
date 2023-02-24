import styled from 'styled-components';
import { CalendarItem } from './MyPageCalendar';
import { useState } from 'react';
import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { dbService, authService } from '@/firebase';

type CalendarProps = {
  item: CalendarItem;

  mark: [];
  setMark: (p: any) => void;
};

const CalendarEdit = ({
  item,

  mark,
  setMark,
}: CalendarProps) => {
  const [textAreaContent, setTextAreaContent] = useState(item.content);

  const onClickEditCalendar = async (e: any, id: string) => {
    if (e.key === 'Enter') {
      if (textAreaContent?.length === 0) {
        let filtered = mark.filter((element) => element !== item.date);
        setMark(filtered);
        try {
          await deleteDoc(doc(dbService, 'calendar', id));
        } catch (error: any) {
          alert(error.message);
        }
      } else {
        try {
          await updateDoc(doc(dbService, 'calendar', id), {
            content: textAreaContent,
          });
        } catch (error: any) {
          alert(error.message);
        }
      }
    }
  };

  return (
    <CalendarContentBox key={item.id}>
      <CalendarTextArea
        value={textAreaContent}
        onChange={(e) => {
          setTextAreaContent(e.target.value);
        }}
        placeholder="입력시 Enter 키를 눌러주세요."
        onKeyPress={(e) => onClickEditCalendar(e, item.id)}
      />
      {/* <CalendarButton onClick={() => onClickEditCalendar(item.id)}>
        수정
      </CalendarButton> */}
      {/* <CalendarButton onClick={() => onClickDeleteCalendar(item.id)}>
        삭제
      </CalendarButton> */}
    </CalendarContentBox>
  );
};

export default CalendarEdit;

const CalendarContentBox = styled.div``;
const CalendarTextArea = styled.textarea`
  margin-top: 4vh;
  margin-bottom: 2vh;
  padding: 12px;
  width: 18vw;
  height: 50vh;
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
// const CalendarButton = styled.button`
//   margin-top: 1vh;
//   margin-left: 1vw;
//   width: 4vw;
//   height: 3vh;
//   color: black;
//   background-color: white;
//   border: none;
//   font-size: 16px;
//   border-radius: 30px;
//   :hover {
//     cursor: pointer;
//     background-color: #dee2e6;
//   }
// `;
