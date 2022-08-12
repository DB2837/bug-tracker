import styled from 'styled-components';

type TProps = {
  isValid?: boolean;
};

export const StyledInput = styled.input<TProps>`
  width: 100%;
  padding: 10px 0;
  color: #fff;
  margin-bottom: 25px;
  border: none;
  border-bottom: 1px solid #ffffff;
  outline: none;
  background-color: inherit;
  ::placeholder {
    color: #fff;
  }

  :focus {
    border-bottom: 1px solid
      ${({ isValid }) => {
        return isValid === true
          ? ` #67ff49`
          : isValid === false
          ? ` #ff5549`
          : '#fff';
      }};
  }
`;
