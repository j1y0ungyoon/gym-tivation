import styled from 'styled-components';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { dbService } from '@/firebase';

type CalendarAddInformation = {
  markDate: string;
  userUid: string;
};

const CalendarAdd = ({ markDate, userUid }: CalendarAddInformation) => {
  const [calendarText, setCalendarText] = useState<string>('');

  const onClickCalendarAdd = async (e: any) => {
    if (e.key === 'Enter') {
      try {
        await addDoc(collection(dbService, 'calendar'), {
          date: markDate,
          content: calendarText,
          uid: userUid,
        });
        // setIsLoadCalendar(false);
        setCalendarText('');
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  return (
    <>
      <CalendarTextArea
        spellCheck="false"
        value={calendarText}
        onChange={(e) => {
          setCalendarText(e.target.value);
        }}
        placeholder="메모장처럼 일지를 작성하세요!"
        onKeyPress={onClickCalendarAdd}
      />
      {/* <CalendarButton onClick={onClickCalendarAdd}>등록</CalendarButton> */}
    </>
  );
};

export default CalendarAdd;

const CalendarTextArea = styled.textarea`
  padding: 8px;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  border-style: solid;
  border-width: 0.1rem;
  font-size: 16px;
  overflow: auto;
  resize: none;
  ::-webkit-scrollbar {
    display: none;
  }
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
