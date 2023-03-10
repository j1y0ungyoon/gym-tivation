import React from 'react';
import styled from 'styled-components';

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(
  ({ children, onClick }: { children: any; onClick: any }, ref: any) => (
    <ToggleButton
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </ToggleButton>
  ),
);
CustomToggle.displayName = 'CustomToggle';

export default CustomToggle;

const ToggleButton = styled.button`
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  width: 7rem;
  height: 2.5rem;
  border: 1px solid black;
  margin-right: 1rem;
  background-color: white;
  box-shadow: -2px 2px 0px 1px #000000;
  &:hover {
    background-color: #ffcab5;
    color: black;
  }
`;
