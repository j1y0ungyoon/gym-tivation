import React, { useState } from 'react';
import styled from 'styled-components';

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  (
    { children, style, className, 'aria-labelledby': labeledBy }: any,
    ref: any,
  ) => {
    const [value, setValue] = useState('');

    return (
      <StyledMenuBox
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        {/* <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        /> */}
        <StyledUl className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              //@ts-ignore
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </StyledUl>
      </StyledMenuBox>
    );
  },
);

CustomMenu.displayName = 'CustomMenu';

export default CustomMenu;

const StyledMenuBox = styled.div`
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
`;

const StyledUl = styled.ul`
  min-height: 4rem;
  max-height: 14rem;
  overflow: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;
