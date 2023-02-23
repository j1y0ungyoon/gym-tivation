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
      <div
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
      </div>
    );
  },
);

CustomMenu.displayName = 'CustomMenu';

export default CustomMenu;

const StyledUl = styled.ul`
  height: 18rem;
  overflow: auto;
  overflow-x: hidden;
`;
