import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import CustomMenu from './CustomMenu';
import CustomToggle from './CutomToggle';

const UseDropDown = ({ children }: { children: string }) => {
  return (
    <Dropdown autoClose={true}>
      <Dropdown.Toggle as={CustomToggle} id="time-select-dropdown">
        {children}
      </Dropdown.Toggle>
      <Dropdown.Menu as={CustomMenu}>
        <Dropdown.Item eventKey="item1">01시</Dropdown.Item>
        <Dropdown.Item eventKey="item2">02시</Dropdown.Item>
        <Dropdown.Item eventKey="item3">03시</Dropdown.Item>
        <Dropdown.Item eventKey="item4">04시</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UseDropDown;
