import styled, { keyframes } from 'styled-components';

const Loader = () => {
  return (
    <SpinnerContainer>
      <LoadingSpinner />
    </SpinnerContainer>
  );
};

export default Loader;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  position: absolute;
  display: grid;
  place-content: center;
  height: 100%;
  width: 100%;
  background-color: rgba(54, 54, 54, 0.4);
  top: 0;
  left: 0;
  z-index: 90;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 10px solid #f3f3f3; /* Light grey */
  border-top: 10px solid #383636; /* Black */
  border-radius: 50%;
  animation: ${rotate} 1.5s linear infinite;
`;
