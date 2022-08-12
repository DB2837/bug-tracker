import React, { useState } from 'react';
import styled from 'styled-components';
import useCustomFetch from '../../hooks/useCustomFetch';
import { addBug } from '../../services/bug/addBug';
import { StyledButton } from '../../styles/StyledButton';
import { Bug, Priority, TModals } from '../../types';
import Loader from '../Loader';
import ModalContainer from './ModalContainer';

type TInputs = {
  title: string;
  description: string;
};

type TProps = {
  projectID: string;
  CRUDLoading: boolean;
  setBugs: React.Dispatch<React.SetStateAction<Bug[]>>;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
  setCRUDloading: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddBugModal = ({
  setModals,
  setBugs,
  setCRUDloading,
  projectID,
  CRUDLoading,
}: TProps) => {
  const _fetch = useCustomFetch();
  const [inputValue, setInputValue] = useState<TInputs>(() => ({
    title: '',
    description: '',
  }));

  const [priority, setPriority] = useState<Priority>(Priority.low);

  const handleInputsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRadioButtonChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPriority(() => event.target.value as Priority);
  };

  const handleSubmit = async () => {
    try {
      setCRUDloading(true);
      const response = await addBug(
        _fetch,
        projectID,
        inputValue.title,
        inputValue.description,
        priority
      );

      if (response?.status === 200) {
        const bug = await response?.json();
        setBugs((prevState: Bug[]) => [bug, ...prevState]);
        setModals((prevState) => ({ ...prevState, addBugModal: false }));
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
        <h3>Add new bug</h3>
      </Div>
      <Div>
        <StyledInput
          name='title'
          placeholder='Title...'
          onChange={handleInputsChange}
          value={inputValue.title}
          required
        />
      </Div>

      <InputRadioContainer onChange={handleRadioButtonChange}>
        <div>
          <input
            type='radio'
            value={Priority.low}
            name='priority'
            defaultChecked
          />{' '}
          Low
        </div>
        <div>
          {' '}
          <input type='radio' value={Priority.medium} name='priority' /> Medium
        </div>
        <div>
          {' '}
          <input type='radio' value={Priority.high} name='priority' /> High
        </div>
      </InputRadioContainer>

      <Div>
        <StyledTextArea
          name='description'
          placeholder='Description...'
          maxLength={520}
          onChange={handleInputsChange}
          value={inputValue.description}
          required
        />
      </Div>
      <StyledButton onClick={handleSubmit}>create Bug</StyledButton>
    </ModalContainer>
  );
};

export default AddBugModal;

const Div = styled.div`
  display: flex;
  position: relative;
  /*  justify-content: space-between; */
  padding: 1rem;
`;

const InputRadioContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

/* const Span = styled.span`
  font-size: 1rem;
  cursor: pointer;
`; */

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

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 0;
  color: #fff;
  margin-bottom: 25px;
  border: none;
  border-bottom: 1px solid #ffffff;
  outline: none;
  background-color: inherit;
  font-size: 1rem;
  ::placeholder {
    color: #fff;
  }
`;
