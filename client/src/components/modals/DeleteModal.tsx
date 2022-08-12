import React from 'react';
import styled from 'styled-components';
import { TModals } from '../../types';

import { StyledButton } from '../../styles/StyledButton';

import ModalContainer from './ModalContainer';
import Loader from '../Loader';

type TProps = {
  title: string;
  CRUDLoading: boolean;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
  handleDelete: (event: React.SyntheticEvent) => Promise<void>;
};

const DeleteModal = ({
  setModals,
  handleDelete,
  title,
  CRUDLoading,
}: TProps) => {
  const closeModal = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    setModals((prevState) => ({
      ...prevState,
      deleteModal: false,
    }));
  };

  return (
    <>
      <ModalContainer setModals={setModals}>
        <h3>{title}</h3>
        <Div>
          {CRUDLoading && <Loader />}
          <StyledButton onClick={(e) => closeModal(e)}>cancel</StyledButton>
          <StyledButton
            style={{
              marginLeft: '0.7rem',
            }}
            onClick={handleDelete}
          >
            confirm
          </StyledButton>
        </Div>
      </ModalContainer>
    </>
  );
};

export default DeleteModal;

const Div = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-top: 2rem;
`;
