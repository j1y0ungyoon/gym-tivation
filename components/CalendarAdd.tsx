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

  const onClickCalendarAdd = async () => {
    try {
      await addDoc(collection(dbService, 'calendar'), {
        date: markDate,
        content: calendarText,
        uid: userUid,
      });
      alert('마크저장');
      // setIsLoadCalendar(false);
      setCalendarText('');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <CalendarContentBox>
      <CalendarTextArea
        value={calendarText}
        onChange={(e) => {
          setCalendarText(e.target.value);
        }}
        placeholder="일정을 적어주세요."
      />
      <CalendarButton onClick={onClickCalendarAdd}>등록</CalendarButton>
    </CalendarContentBox>
  );
};

export default CalendarAdd;

const CalendarContentBox = styled.div``;
const CalendarTextArea = styled.textarea`
  padding: 12px;
  width: 18vw;
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
