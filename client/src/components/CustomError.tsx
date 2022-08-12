import styled from 'styled-components';

type TProps = {
  text: string;
  success?: boolean;
};

type TStyled = {
  success?: boolean;
};

const CustomError = ({ text, success }: TProps) => {
  return <Div success={success}>{text}</Div>;
};

export default CustomError;

const Div = styled.div<TStyled>`
  position: absolute;
  align-self: center;
  text-align: center;
  width: 100%;
  top: 0;
  z-index: 99;
  padding: 5px;
  border-radius: 4px;
  color: #ffffff;
  background-color: #ee3c24;
  background-color: ${({ success }) => (success ? '#56d835' : '#ee3c24')};
`;
