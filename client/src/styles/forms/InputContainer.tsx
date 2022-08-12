import styled from 'styled-components';

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  max-width: 390px;
  margin-top: calc(0.6rem + 0.1vw);
  margin-bottom: calc(0.4rem + 0.2vw);
  letter-spacing: 1px;
  background-color: inherit;
  > * {
    font-size: 0.9em;
    padding: 3px;
    /*  border: none;
    border-bottom: 1px solid #fff;
    background: transparent;
    color: #fff; */
  }
`;
