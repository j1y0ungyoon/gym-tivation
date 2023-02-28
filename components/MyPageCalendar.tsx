import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { dbService, authService } from '@/firebase';
import CalendarEdit from './CalendarEdit';
import CalendarAdd from './CalendarAdd';

export type CalendarItem = {
  id: string;
  uid?: string;
  mark?: boolean;
  date?: string;
  content?: string;
};

const MyPageCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [mark, setMark] = useState([] as any);
  const [calendarInformation, setCalendarInformation] = useState<
    CalendarItem[]
  >([]);

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

  useEffect(() => {
    // const test = async () => {
    //   const q = query(collection(dbService, 'calendar'));
    //   const data = await getDocs(q);
    //   const newData = data.docs.map((doc) => {
    //     setMark((prev: any) => [...prev, doc.data().date]);
    //     const newDatas = {
    //       id: doc.id,
    //       ...doc.data(),
    //     };
    //     return newDatas;
    //   });
    //   setCalendarInformation(newData);
    // };

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
        <CalendarCSS>
          <Calendar
            onChange={setValue}
            value={value}
            next2Label={null}
            prev2Label={null}
            calendarType="US"
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
        </CalendarCSS>
        {markCompare === undefined ? (
          <>
            <CalendarAdd markDate={markDate} userUid={userUid} />
          </>
        ) : (
          calendarInformation
            .filter((item) => item.date === markDate)
            .map((item) => {
              return (
                <CalendarEdit
                  key={item.id}
                  item={item}
                  mark={mark}
                  setMark={setMark}
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
  border-radius: 16px;
  border-style: solid;
  padding-top: 2vh;
  padding-left: 1vw;
  padding-right: 1vw;
  border-width: 0.1rem;
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
  background-color: green;
`;

const CalendarCSS = styled.div`
  .react-calendar {
    width: 350px;
    max-width: 100%;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.125em;
    border-bottom-style: solid;
    border-width: 0.1rem;
  }
  .react-calendar--doubleView {
    width: 700px;
  }
  .react-calendar--doubleView .react-calendar__viewContainer {
    display: flex;
    margin: -0.5em;
  }
  .react-calendar--doubleView .react-calendar__viewContainer > * {
    width: 50%;
    margin: 0.5em;
  }
  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
  }
  .react-calendar button:enabled:hover {
    cursor: pointer;
  }
  .react-calendar__navigation {
    display: flex;
    height: 44px;
    margin-bottom: 1em;
  }
  .react-calendar__navigation button {
    min-width: 44px;
    font-size: 24px;
    background: none;
  }
  .react-calendar__navigation button:disabled {
    background-color: #f0f0f0;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    color: gray;
  }
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75em;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }
  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75em;
    font-weight: bold;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #d10000;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
  }
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }
  .react-calendar__tile {
    max-width: 100%;
    padding: 10px 6.6667px;
    background: none;
    text-align: center;
    line-height: 16px;
  }
  .react-calendar__tile:disabled {
    background-color: #f5f5f5;
    border-radius: 50%;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #f5f5f5;
    border-radius: 50%;
  }
  .react-calendar__tile--now {
    background: #f5f5f5;
  }
  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: #76baff;
  }
  .react-calendar__tile--hasActive {
    background: #76baff;
  }
  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: #a9d4ff;
  }
  .react-calendar__tile--active {
    background: #f5f5f5;
    border-radius: 50%;
    color: black;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #f5f5f5;
    border-radius: 50%;
  }
  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #e6e6e6;
  }
  .react-calendar__navigation__label > span {
    font-size: 20px;
    font-weight: bold;
  }
  .react-calendar__tile--now {
    background: #fff8e1;
    border-radius: 50%;
    color: black;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    font-size: 1rem;
    margin-top: 10px;
    margin-bottom: 10px;
    border-bottom-style: solid;
    border-width: 0.1rem;
  }
  abbr[title] {
    text-decoration: none;
  }
`;
