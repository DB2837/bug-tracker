import React from 'react';
import styled from 'styled-components';
import { TModals } from '../../types';

type TProps = {
  children: JSX.Element[];
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
};

const ModalContainer = (
  { children, setModals }: TProps /* { children }: TProps */
) => {
  const closeModal = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    setModals({
      deleteModal: false,
      addMembersModal: false,
      editTitleModal: false,
      addProjectModal: false,
      addBugModal: false,
      editBugModal: false,
      addCommentModal: false,
      editCommentModal: false,
      leaveProjectModal: false,
    });
  };

  return (
    <Container
      onClick={() => {
        setModals({
          deleteModal: false,
          addMembersModal: false,
          editTitleModal: false,
          addProjectModal: false,
          addBugModal: false,
          editBugModal: false,
          addCommentModal: false,
          editCommentModal: false,
          leaveProjectModal: false,
        });
      }}
    >
      <ModalBox
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Cancel onClick={closeModal}>x</Cancel>
        {children}
      </ModalBox>
    </Container>
  );
};

export default ModalContainer;

const Container = styled.div`
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

const ModalBox = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.8rem 1rem;
  width: 360px;
  min-height: 140px;
  background: #111111;
  border-radius: 6px;
  color: #fff;
  z-index: 99;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const Cancel = styled.div`
  cursor: pointer;
  position: absolute;
  padding: 0.4rem 1rem;
  top: 0;
  right: 0;
  font-size: 1.4rem;
`;
