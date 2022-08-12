import styled from 'styled-components';

export const FormBtn = styled.button`
  font-weight: bold;
  background-color: #11689b;
  color: #fff;
  width: 100%;
  max-width: 330px;
  padding: 0.5rem;
  margin-top: 0.4rem;
  /* margin-top: calc(0.6rem + 0.2vw); */
  outline: none;
  border: 3px solid #fff;
  border-radius: 5px;

  &:hover {
    transition: 0.3s;
    background-color: #fff;
    color: #11689b;
  }
`;
