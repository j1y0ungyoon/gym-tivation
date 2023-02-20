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
      {/* &#x25bc; */}
    </ToggleButton>
  ),
);

export default CustomToggle;

const ToggleButton = styled.button`
  border-radius: 0.6rem;
`;
