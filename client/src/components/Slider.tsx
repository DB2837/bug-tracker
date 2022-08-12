import React from 'react';
import styled from 'styled-components';

type TProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const Slider = ({ currentPage, totalPages, setCurrentPage }: TProps) => {
  const goToPreviousPage = () => {
    return currentPage === 1
      ? undefined
      : setCurrentPage((prevState) => prevState - 1);
  };

  const goToNextPage = () => {
    return currentPage === totalPages
      ? undefined
      : setCurrentPage((prevState) => prevState + 1);
  };

  return (
    <Container>
      <AangleBrackets onClick={goToPreviousPage}>{`<`}</AangleBrackets>
      <Circle>{currentPage}</Circle>
      <AangleBrackets onClick={goToNextPage}>{`>`}</AangleBrackets>
    </Container>
  );
};

export default Slider;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7rem;
`;

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
  font-size: 1.3rem;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  /* border: 2px solid #fe5800; */
  background-color: #fe5800;
`;

const AangleBrackets = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  /* border: 2px solid #fff; */
  color: #fe5800;
  font-size: 1.7rem;
  margin-left: 0.4rem;
  margin-right: 0.4rem;

  :hover {
    transform: scale(1.3);
    transition: border 0.3s;
  }
`;
