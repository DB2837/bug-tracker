import React from 'react';
import styled from 'styled-components';
import { StyledButton } from '../styles/StyledButton';
import { DeletionTarget, TModals } from '../types';
import Avatar from './Avatar';

type TProps = {
  comment: any;
  currentUserEmail: string;
  setDelitionTarget: React.Dispatch<React.SetStateAction<DeletionTarget>>;
  selectedComment: React.MutableRefObject<any>;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
};

const CommentBox = ({
  comment,
  currentUserEmail,
  setDelitionTarget,
  selectedComment,
  setModals,
}: TProps) => {
  const handleDeleteClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setDelitionTarget(() => DeletionTarget.comment);
    selectedComment.current = comment;
    setModals((prevState) => ({
      ...prevState,
      deleteModal: true,
    }));
  };

  return (
    <CommentContainer>
      <Div>
        <Avatar firstName={comment.creator['firstName']} />
      </Div>
      <Div>
        <Paragraph>
          {comment.description}
          <br />
          <br />
          {comment.createdAt} - {comment.creator['email']}
        </Paragraph>
        {currentUserEmail === comment.creator['email'] && (
          <ButtonContainer>
            <StyledButton
              onClick={() => {
                selectedComment.current = comment;
                setModals((prevState) => ({
                  ...prevState,
                  editCommentModal: true,
                }));
              }}
            >
              edit
            </StyledButton>
            <StyledButton onClick={handleDeleteClick}>delete</StyledButton>
          </ButtonContainer>
        )}
      </Div>
    </CommentContainer>
  );
};

export default CommentBox;

const CommentContainer = styled.div`
  display: flex;
  padding: 0.8rem 0.2rem;
  border-top: 2px solid #fff;
`;

const Div = styled.div`
  /* padding: 0 0.4rem; */
  display: flex;
  flex-direction: column;
  /*   justify-content: center; */
  /*   border: 2px solid #e64646; */
  /*  justify-content: center; */
`;

const Paragraph = styled.p`
  margin: 0 0.5rem;
  /*  border: 2px solid #fff; */
`;

const ButtonContainer = styled.div`
  padding: 0.6rem 0;
  display: flex;
  /*  justify-content: flex-end; */
  /*  justify-content: flex-end; */
  max-width: 1100px;
  /* @media screen and (max-width: 768px) {
    justify-content: space-between;
  } */
`;
