import styled from 'styled-components';
interface BoardCategoryProps {
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}
const BoardCategory = ({ setCategory }: BoardCategoryProps) => {
  const onChangeBoardCategory = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log(event.target.value);
    setCategory(event?.target.value);
  };
  return (
    <CategoryWrapper>
      <CategoryLabel>
        <CategorySelect
          type="radio"
          name="category"
          value="운동정보"
          onChange={onChangeBoardCategory}
        />
        <CategoryText>운동정보</CategoryText>
      </CategoryLabel>
      <CategoryLabel>
        <CategorySelect
          type="radio"
          name="category"
          value="헬스장정보"
          onChange={onChangeBoardCategory}
        />
        <CategoryText>헬스장정보</CategoryText>
      </CategoryLabel>
      <CategoryLabel>
        <CategorySelect
          type="radio"
          name="category"
          value="헬스용품추천"
          onChange={onChangeBoardCategory}
        />
        <CategoryText>헬스용품추천</CategoryText>
      </CategoryLabel>
    </CategoryWrapper>
  );
};
const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const CategoryLabel = styled.label``;
const CategoryText = styled.span`
  font-size: 18px;
  width: 110px;
  height: 35px;
  background: #e6e6e6;
  border-radius: 50px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 1rem;
  color: #777; ;
`;
const CategorySelect = styled.input.attrs({ type: 'radio' })`
  &:checked {
    display: inline-block;
    background: none;
    padding: 0px 10px;
    text-align: center;
    height: 35px;
    line-height: 33px;
    font-weight: 500;
    display: none;
  }
  &:checked + ${CategoryText} {
    background: #000;
    color: #fff;
  }
  display: none;
`;

export default BoardCategory;
