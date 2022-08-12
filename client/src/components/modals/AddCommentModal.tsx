import React, { useState } from 'react';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import useCustomFetch from '../../hooks/useCustomFetch';
import { addComment } from '../../services/comment/addComment';
import { StyledButton } from '../../styles/StyledButton';
import { TModals } from '../../types';
import Loader from '../Loader';
import ModalContainer from './ModalContainer';

type TProps = {
  projectID: string;
  bugID: string;
  CRUDLoading: boolean;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
  setComments: (value: React.SetStateAction<any[]>) => void;
  setCRUDloading: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddCommentModal = ({
  projectID,
  bugID,
  CRUDLoading,
  setModals,
  setComments,
  setCRUDloading,
}: TProps) => {
  const _fetch = useCustomFetch();
  const { auth } = useAuth();
  const [commentText, setCommentText] = useState<string>('');

  const handleInputsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCommentText(() => event.target.value);
  };

  const handleSubmitComment = async () => {
    try {
      setCRUDloading(true);
      const response = await addComment(
        _fetch,
        projectID as string,
        bugID as string,
        commentText,
        auth?.accessToken
      );

      /*  console.log(response); */
      if (response?.status === 201) {
        const comment = await response.json();
        setComments((prevState) => [comment, ...prevState]);
        setModals((prevState) => ({
          ...prevState,
          addCommentModal: false,
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
        <h3>Add new comment</h3>
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
      <StyledButton onClick={handleSubmitComment}>add comment</StyledButton>
    </ModalContainer>
  );
};

export default AddCommentModal;

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
