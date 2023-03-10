import { useRouter } from 'next/router';
import styled from 'styled-components';
interface BoardCategoryProps {
  setCategory?: React.Dispatch<React.SetStateAction<string>>;
  setEditDetailCategory?: React.Dispatch<React.SetStateAction<string>>;
}
const BoardCategory = ({ setCategory, setEditDetailCategory }: any) => {
  const router = useRouter();

  const post = router.pathname === `/board/Post`;
  const onChangeBoardCategory = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCategory(event?.target.value);
  };
  const onChangeEditCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditDetailCategory(event.target.value);
  };

  return (
    <>
      {post ? (
        <CategoryWrapper>
          <Text>카테고리</Text>
          <CategoryContainer>
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
          </CategoryContainer>
        </CategoryWrapper>
      ) : (
        <CategoryWrapper>
          <Text>카테고리</Text>
          <CategoryContainer>
            <CategoryLabel>
              <CategorySelect
                type="radio"
                name="category"
                value="운동정보"
                onChange={onChangeEditCategory}
              />
              <CategoryText>운동정보</CategoryText>
            </CategoryLabel>
            <CategoryLabel>
              <CategorySelect
                type="radio"
                name="category"
                value="헬스장정보"
                onChange={onChangeEditCategory}
              />
              <CategoryText>헬스장정보</CategoryText>
            </CategoryLabel>
            <CategoryLabel>
              <CategorySelect
                type="radio"
                name="category"
                value="헬스용품추천"
                onChange={onChangeEditCategory}
              />
              <CategoryText>헬스용품추천</CategoryText>
            </CategoryLabel>
          </CategoryContainer>
        </CategoryWrapper>
      )}
    </>
  );
};
const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;
const Text = styled.span`
  font-size: 20px;
  margin-right: 7px;
`;
const CategoryContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* justify-content: space-between; */
`;
const CategoryLabel = styled.label``;
const CategoryText = styled.span`
  ${({ theme }) => theme.btn.btn50}
  box-shadow: -2px 2px 0px 1px #000000;

  font-size: 18px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: white;
  color: black;
  border: 1px solid black;
  margin-left: 20px;
`;
const CategorySelect = styled.input.attrs({ type: 'radio' })`
  &:checked {
    background: ${({ theme }) => theme.color.brandColor100};
    display: inline-block;
    padding: 0px 10px;
    text-align: center;
    height: 35px;
    line-height: 33px;
    font-weight: 500;
    display: none;
  }
  &:checked + ${CategoryText} {
    background: ${({ theme }) => theme.color.brandColor100};
    color: #fff;
  }
  display: none;
`;

export default BoardCategory;
