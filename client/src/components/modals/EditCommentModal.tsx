import React, { useState } from 'react';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import useCustomFetch from '../../hooks/useCustomFetch';
import { updateComment } from '../../services/comment/updateComment';
import { StyledButton } from '../../styles/StyledButton';
import { TModals } from '../../types';
import { replaceItemInArray } from '../../utils/replaceItemInArray';
import Loader from '../Loader';
import ModalContainer from './ModalContainer';

type TProps = {
  projectID: string;
  selectedComment: any;
  CRUDLoading: boolean;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
  setComments: (value: React.SetStateAction<any[]>) => void;
  setCRUDloading: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditCommentModal = ({
  projectID,
  selectedComment,
  CRUDLoading,
  setModals,
  setComments,
  setCRUDloading,
}: TProps) => {
  const _fetch = useCustomFetch();
  const { auth } = useAuth();
  const [commentText, setCommentText] = useState<string>(
    selectedComment.description
  );

  const handleInputsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCommentText(() => event.target.value);
  };

  const handleSubmitComment = async () => {
    try {
      setCRUDloading(true);
      const response = await updateComment(
        _fetch,
        projectID as string,
        selectedComment.id,
        commentText,
        auth?.accessToken
      );

      /*  console.log(response); */
      if (response?.status === 201) {
        const updatedComment = await response.json();
        setComments((prevState) => {
          const newCommentsArray = replaceItemInArray(
            prevState,
            selectedComment.id,
            updatedComment
          );

          return newCommentsArray;
        });
        setModals((prevState) => ({
          ...prevState,
          editCommentModal: false,
        }));
      }
    } catch (error) {
      throw error;
    } finally {
      setCRUDloading(false);
    }
  };

  return (
    <ModalContainer setModals={setModals}>
      <Div>
        {CRUDLoading && <Loader />}
        <h3>Update comment description</h3>
      </Div>

      <Div>
        <StyledTextArea
          name='comment'
          placeholder='comment...'
          maxLength={520}
          onChange={handleInputsChange}
          value={commentText}
          required
        />
      </Div>
      <StyledButton onClick={handleSubmitComment}>update comment</StyledButton>
    </ModalContainer>
  );
};

export default EditCommentModal;

const Div = styled.div`
  display: flex;
  position: relative;
  /*  justify-content: space-between; */
  padding: 1rem;
`;

const StyledTextArea = styled.textarea`
  background-color: inherit;
  color: #fff;
  font-size: 1rem;
  min-width: 280px;
  min-height: 145px;

  ::placeholder {
    color: #fff;
  }
`;
