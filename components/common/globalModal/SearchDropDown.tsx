import Dropdown from 'react-bootstrap/Dropdown';
import CustomMenu from '@/components/common/dropDown/CustomMenu';
import CustomToggle from '@/components/common/dropDown/CustomToggle';
import { PropsWithChildren } from 'react';
import { nanoid } from 'nanoid';

interface SearchDropDownPropsType {
  setSearchCategory: React.Dispatch<React.SetStateAction<string>>;
}

const SearchDropDown = (props: PropsWithChildren<SearchDropDownPropsType>) => {
  const { setSearchCategory, children } = props;

  const onSelectSearchCategory = (eventKey: any) => {
    if (!eventKey) return;

    if (eventKey === '내용') {
      setSearchCategory(eventKey);
    }

    if (eventKey === '닉네임') {
      setSearchCategory(eventKey);
    }

    if (eventKey === '전체') {
      setSearchCategory(eventKey);
    }
  };

  return (
    <>
      <Dropdown autoClose={true} onSelect={onSelectSearchCategory}>
        <Dropdown.Toggle as={CustomToggle} id="search-select-dropdown">
          {children}
        </Dropdown.Toggle>
        <Dropdown.Menu
          key={`search-select-dropdown-menu-${nanoid()}`}
          as={CustomMenu}
        >
          <Dropdown.Item key={`all-${nanoid()}`} eventKey={'전체'}>
            전체
          </Dropdown.Item>
          <Dropdown.Item key={`content-${nanoid()}`} eventKey={'내용'}>
            내용
          </Dropdown.Item>
          <Dropdown.Item key={`nickName-${nanoid()}`} eventKey={'닉네임'}>
            닉네임
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default SearchDropDown;
