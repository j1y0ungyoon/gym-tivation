import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import CustomMenu from './CustomMenu';
import CustomToggle from './CustomToggle';
import { PropsWithChildren } from 'react';
import { DropDownProps } from '@/type';
import { nanoid } from 'nanoid';

const UseDropDown = (props: PropsWithChildren<DropDownProps>) => {
  const timeArray = [
    '01시',
    '01시 30분',
    '02시',
    '02시 30분',
    '03시',
    '03시 30분',
    '04시',
    '04시 30분',
    '05시',
    '05시 30분',
    '06시',
    '06시 30분',
    '07시',
    '07시 30분',
    '08시',
    '08시 30분',
    '09시',
    '09시 30분',
    '10시',
    '10시 30분',
    '11시',
    '11시 30분',
    '12시',
    '12시 30분',
    '13시',
    '13시 30분',
    '14시',
    '14시 30분',
    '15시',
    '15시 30분',
    '16시',
    '16시 30분',
    '17시',
    '17시 30분',
    '18시',
    '18시 30분',
    '19시',
    '19시 30분',
    '20시',
    '20시 30분',
    '21시',
    '21시 30분',
    '22시',
    '22시 30분',
    '23시',
    '23시 30분',
    '24시',
    '24시 30분',
  ];

  const { children, setEnd, setStart } = props;

  // const onSelectTime = () => {
  //   console.log('눌렀음');
  // };

  const onSelectStart = (eventKey: any) => {
    if (eventKey) {
      console.log('시작', eventKey);
      setStart(eventKey);
    }
  };

  const onSelectEnd = (eventKey: any) => {
    if (eventKey) {
      console.log('종료', eventKey);
      setEnd(eventKey);
    }
  };

  return (
    <>
      {children === '시작 시간' ? (
        <Dropdown autoClose={true} onSelect={onSelectStart}>
          <Dropdown.Toggle as={CustomToggle} id="time-select-dropdown1">
            {children}
          </Dropdown.Toggle>
          <Dropdown.Menu as={CustomMenu}>
            {timeArray.map((time) => {
              return (
                <>
                  <Dropdown.Item
                    key={`${children}-${nanoid()}}`}
                    eventKey={time}
                  >
                    {time}
                  </Dropdown.Item>
                </>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Dropdown autoClose={true} onSelect={onSelectEnd}>
          <Dropdown.Toggle as={CustomToggle} id="time-select-dropdown2">
            {children}
          </Dropdown.Toggle>
          <Dropdown.Menu as={CustomMenu}>
            {timeArray.map((time) => {
              return (
                <>
                  <Dropdown.Item key={nanoid()} eventKey={time}>
                    {time}
                  </Dropdown.Item>
                </>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
};

export default UseDropDown;
