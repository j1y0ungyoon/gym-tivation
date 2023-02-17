import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { dbService, authService } from '@/firebase';
import test from 'node:test';
import CalendarEdit from './CalendarEdit';

export type CalendarItem = {
  id: string;
  uid?: string;
  mark?: boolean;
  date?: string;
  content?: string;
};

export type CalendarLoad = {
  setIsLoadCalendar: (p: boolean) => void;
};

const MyPageCalendar = ({ setIsLoadCalendar }: CalendarLoad) => {
  const [value, setValue] = useState(new Date());
  const [mark, setMark] = useState([] as any);
  const [calendarInformation, setCalendarInformation] = useState<
    CalendarItem[]
  >([]);

  const [calendarText, setCalendarText] = useState('');
  const markDate = String(
    new Date(value).toLocaleDateString('ko', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
  );

  const markCompare = mark.find(
    (oneDate: any) =>
      oneDate ===
      String(
        new Date(value).toLocaleDateString('ko', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
      ),
  );

  const userUid: any = String(authService.currentUser?.uid);

  const onClickCalendarAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(dbService, 'calendar'), {
        date: markDate,
        content: calendarText,
        uid: authService.currentUser?.uid,
      });
      alert('마크저장');
      setCalendarText('');
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const q = query(
      collection(dbService, 'calendar'),
      where('uid', '==', userUid),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newcalendars = snapshot.docs.map((doc) => {
        setMark((prev: any) => [...prev, doc.data().date]);
        const newcalendar = {
          id: doc.id,
          ...doc.data(),
        };
        return newcalendar;
      });

      setCalendarInformation(newcalendars);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <CalendarWrapper>
      <>
        <Calendar
          onChange={setValue}
          value={value}
          formatDay={(locale, date) =>
            new Date(date).toLocaleDateString('en-us', {
              day: '2-digit',
            })
          }
          tileContent={({ date }) => {
            const exist = mark.find(
              (oneDate: any) =>
                oneDate ===
                String(
                  new Date(date).toLocaleDateString('ko', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }),
                ),
            );
            return (
              <>
                <DotBox>{exist && <CalendarDot />}</DotBox>
              </>
            );
          }}
        />

        <h3>{markDate}</h3>
        {markCompare === undefined ? (
          <form onSubmit={onClickCalendarAdd}>
            <CalendarContentBox>
              <CalendarTextArea
                value={calendarText}
                onChange={(e) => {
                  setCalendarText(e.target.value);
                }}
                placeholder="일정을 적어주세요."
              />
              <CalendarButton type="submit">등록</CalendarButton>
            </CalendarContentBox>
          </form>
        ) : (
          calendarInformation
            .filter((item) => item.date === markDate)
            .map((item) => {
              return (
                <CalendarEdit
                  key={item.id}
                  item={item}
                  setIsLoadCalendar={setIsLoadCalendar}
                />
              );
            })
        )}
      </>
    </CalendarWrapper>
  );
};

export default MyPageCalendar;

const CalendarWrapper = styled.div`
  padding-top: 2vh;
  padding-left: 2vw;
  padding-right: 2vw;
`;
const DotBox = styled.div`
  width: 100%;
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CalendarDot = styled.div`
  margin-top: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #f87171;
`;
const CalendarTextArea = styled.textarea`
  padding-top: 2vh;
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

const CalendarContentBox = styled.div``;
