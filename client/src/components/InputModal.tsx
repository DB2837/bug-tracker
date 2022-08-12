import React from 'react';
import styled from 'styled-components';

type Tprops = {
  text?: JSX.Element;
};

const InputModal = ({ text }: Tprops) => {
  if (!text) return <></>;
  return <Div>{text.props.children}</Div>;
};

export default InputModal;

const Div = styled.div`
  position: absolute;
  width: 100%;
  top: 60px;
  z-index: 99;
  padding: 5px;
  color: #750a79;
  background-color: #e48241;
`;
