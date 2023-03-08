import styled from 'styled-components';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { dbService } from '@/firebase';
import { useMutation, useQueryClient } from 'react-query';
type CalendarAddInformation = {
  markDate: string;
  userUid: string;
};

const CalendarAdd = ({ markDate, userUid }: CalendarAddInformation) => {
  const [calendarText, setCalendarText] = useState<string>('');
  const queryClient = useQueryClient();

  const calendarAdd = async (e: any) => {
    if (e.key === 'Enter') {
      try {
        await addDoc(collection(dbService, 'calendar'), {
          date: markDate,
          content: calendarText,
          uid: userUid,
        });
        setCalendarText('');
      } catch (error: any) {
        alert(error.message);
      }
    }
  };
  const { mutate: onClickCalendarAdd } = useMutation(
    'onClickCalendarAdd',
    calendarAdd,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('calendar');
      },
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );

  return (
    <>
      <CalendarTextArea
        spellCheck="false"
        value={calendarText}
        onChange={(e) => {
          setCalendarText(e.target.value);
        }}
        placeholder="Enter를 넣으면 저장됩니다."
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
