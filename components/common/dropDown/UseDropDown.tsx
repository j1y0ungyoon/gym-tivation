import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import CustomMenu from './CustomMenu';
import CustomToggle from './CustomToggle';
import { PropsWithChildren } from 'react';
import { DropDownProps } from '@/type';
import { nanoid } from 'nanoid';

const UseDropDown = (props: PropsWithChildren<DropDownProps>) => {
  const timeArray = [
    '01 : 00',
    '01 : 30',
    '02 : 00',
    '02 : 30',
    '03 : 00',
    '03 : 30',
    '04 : 00',
    '04 : 30',
    '05 : 00',
    '05 : 30',
    '06 : 00',
    '06 : 30',
    '07 : 00',
    '07 : 30',
    '08 : 00',
    '08 : 30',
    '09 : 00',
    '09 : 30',
    '10 : 00',
    '10 : 30',
    '11 : 00',
    '11 : 30',
    '12 : 00',
    '12 : 30',
    '13 : 00',
    '13 : 30',
    '14 : 00',
    '14 : 30',
    '15 : 00',
    '15 : 30',
    '16 : 00',
    '16 : 30',
    '17 : 00',
    '17 : 30',
    '18 : 00',
    '18 : 30',
    '19 : 00',
    '19 : 30',
    '20 : 00',
    '20 : 30',
    '21 : 00',
    '21 : 30',
    '22 : 00',
    '22 : 30',
    '23 : 00',
    '23 : 30',
    '24 : 00',
    '24 : 30',
  ];

  const { children, setEnd, setStart } = props;

  const onSelectStart = (eventKey: any) => {
    if (eventKey) {
      setStart(eventKey);
    }
  };

  const onSelectEnd = (eventKey: any) => {
    if (eventKey) {
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
          <Dropdown.Menu key={`${children}-시작 시간`} as={CustomMenu}>
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
          <Dropdown.Menu key={`${children}-종료 시간`} as={CustomMenu}>
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
