import styled from 'styled-components';

export const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /*  width: calc(100% + 1vw);
  height: calc(100% + 1vw); */
  /* max-height: 405px;
  max-width: 450px; */
  padding: 2rem;

  /* background-color: #19283a; */
  background-color: #2e2d2d;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 6px;

  > * {
    font-size: calc(1rem + 0.2vw);
  }

  > input {
  }
`;
