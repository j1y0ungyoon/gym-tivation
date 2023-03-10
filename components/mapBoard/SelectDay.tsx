import { DayType } from '@/type';
import React from 'react';
import styled from 'styled-components';

const SelectDay = (props: DayType) => {
  const {
    mon,
    tus,
    wed,
    fri,
    thurs,
    sat,
    sun,
    every,
    setMon,
    setTus,
    setEvery,
    setFri,
    setSat,
    setSun,
    setThurs,
    setWed,
    setSelectedDays,
    selectedDays,
  } = props;

  // 요일 선택하기
  const onClickSelectDay = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { value }, // 무슨 요일인지 꺼냈음
    } = event;

    if (value === '월 ') {
      setMon(!mon);
    }

    if (value === '화 ') {
      setTus(!tus);
    }

    if (value === '수 ') {
      setWed(!wed);
    }

    if (value === '목 ') {
      setThurs(!thurs);
    }

    if (value === '금 ') {
      setFri(!fri);
    }

    if (value === '토 ') {
      setSat(!sat);
    }

    if (value === '일 ') {
      setSun(!sun);
    }

    if (value === '매일 ') {
      setEvery(!every);
    }

    // 선택한 요일이 기존 배열에 포함되어 있으면 아래와 같이 동작
    if (selectedDays.includes(value)) {
      const newArr = selectedDays.filter((day) => day !== value);
      setSelectedDays([...newArr]);

      return;
    }

    // 선택한 요일이 기존 배열이 포함되어 있지 않으면 아래와 같이 동작
    if (!selectedDays.includes(value)) {
      setSelectedDays((prev) => [...prev, value]);

      return;
    }
  };

  return (
    <>
      {mon ? (
        <ToggledDayBox value="월 " onClick={onClickSelectDay}>
          <ToggledDayText>월</ToggledDayText>
        </ToggledDayBox>
      ) : (
        <DayBox value="월 " onClick={onClickSelectDay}>
          <DayText>월</DayText>
        </DayBox>
      )}

      {tus ? (
        <ToggledDayBox value="화 " onClick={onClickSelectDay}>
          <ToggledDayText>화</ToggledDayText>
        </ToggledDayBox>
      ) : (
        <DayBox value="화 " onClick={onClickSelectDay}>
          <DayText>화</DayText>
        </DayBox>
      )}

      {wed ? (
        <ToggledDayBox value="수 " onClick={onClickSelectDay}>
          <ToggledDayText>수</ToggledDayText>
        </ToggledDayBox>
      ) : (
        <DayBox value="수 " onClick={onClickSelectDay}>
          <DayText>수</DayText>
        </DayBox>
      )}

      {thurs ? (
        <ToggledDayBox value="목 " onClick={onClickSelectDay}>
          <ToggledDayText>목</ToggledDayText>
        </ToggledDayBox>
      ) : (
        <DayBox value="목 " onClick={onClickSelectDay}>
          <DayText>목</DayText>
        </DayBox>
      )}

      {fri ? (
        <ToggledDayBox value="금 " onClick={onClickSelectDay}>
          <ToggledDayText>금</ToggledDayText>
        </ToggledDayBox>
      ) : (
        <DayBox value="금 " onClick={onClickSelectDay}>
          <DayText>금</DayText>
        </DayBox>
      )}

      {sat ? (
        <ToggledDayBox value="토 " onClick={onClickSelectDay}>
          <ToggledDayText>토</ToggledDayText>
        </ToggledDayBox>
      ) : (
        <DayBox value="토 " onClick={onClickSelectDay}>
          <DayText>토</DayText>
        </DayBox>
      )}

      {sun ? (
        <ToggledDayBox value="일 " onClick={onClickSelectDay}>
          <ToggledDayText>일</ToggledDayText>
        </ToggledDayBox>
      ) : (
        <DayBox value="일 " onClick={onClickSelectDay}>
          <DayText>일</DayText>
        </DayBox>
      )}

      {every ? (
        <ToggledEveryDayBox value="매일 " onClick={onClickSelectDay}>
          <EveryDayText>매일</EveryDayText>
        </ToggledEveryDayBox>
      ) : (
        <EveryDayBox value="매일 " onClick={onClickSelectDay}>
          <EveryDayText>매일</EveryDayText>
        </EveryDayBox>
      )}
    </>
  );
};

export default SelectDay;

const ToggledDayBox = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-right: 0.6rem;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  cursor: pointer;
  background-color: #ffcab5;
`;
const ToggledDayText = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
  color: black;
`;

const DayText = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
`;

const DayBox = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-right: 0.6rem;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  cursor: pointer;

  background-color: white;
`;

const EveryDayBox = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 42px;
  margin-right: 0.6rem;
  box-shadow: -2px 2px 0px 1px #000000;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  cursor: pointer;

  background-color: white;
`;

const ToggledEveryDayBox = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 42px;
  margin-right: 0.6rem;
  box-shadow: -2px 2px 0px 1px #000000;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  cursor: pointer;
  background-color: #ffcab5; ;
`;

const EveryDayText = styled.span`
  font-size: ${({ theme }) => theme.font.font10};
`;
