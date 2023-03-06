import styled from 'styled-components';
import { CalendarItem } from './MyPageCalendar';
import { useState } from 'react';
import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { dbService } from '@/firebase';
import { useMutation, useQueryClient } from 'react-query';

type CalendarProps = {
  item: CalendarItem;

  mark: [];
  setMark: (p: any) => void;
};

const CalendarEdit = ({ item, mark, setMark }: CalendarProps) => {
  const [textAreaContent, setTextAreaContent] = useState(item.content);
  const queryClient = useQueryClient();

  const editCalendar = async (id: string) => {
    if ((e: KeyboardEvent) => e.key === 'Enter') {
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
  const { mutate: onClickCalendarEdit } = useMutation(
    'onClickCalendarEdit',
    editCalendar,
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
        value={textAreaContent}
        spellCheck="false"
        onChange={(e) => {
          setTextAreaContent(e.target.value);
        }}
        placeholder="입력시 Enter 키를 눌러주세요."
        onKeyPress={() => onClickCalendarEdit(item.id)}
      />
    </>
  );
};

export default CalendarEdit;

const CalendarTextArea = styled.textarea`
  padding: 8px;
  height: 100%;
  width: 100%;
  border-radius: 20px;
  border-style: solid;
  border-width: 0.1rem;
  font-size: 16px;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
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
