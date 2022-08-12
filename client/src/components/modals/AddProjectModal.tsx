import React, { useState } from 'react';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import useCustomFetch from '../../hooks/useCustomFetch';
import { TModals } from '../../types';
import { addProject } from '../../services/project/addProject';
import { StyledButton } from '../../styles/StyledButton';
import { Project, User } from '../../types';
import ModalContainer from './ModalContainer';
import SelectMembers from './SelectMembers';
import Loader from '../Loader';

type TProps = {
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setCRUDloading: React.Dispatch<React.SetStateAction<boolean>>;
  CRUDLoading: boolean;
  users: User[];
  adminEmail: string;
};

type TInputs = {
  title: string;
  search: string;
};

const AddProjectModal = ({
  setModals,
  setProjects,
  setCRUDloading,
  CRUDLoading,
  users,
  adminEmail,
}: TProps) => {
  const _fetch = useCustomFetch();
  const { auth } = useAuth();
  const [inputValue, setInputValue] = useState<TInputs>(() => ({
    title: '',
    search: '',
  }));
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [showusersUpdated, setShowUsersUpdated] = useState<any[]>(() => users);
  const [usersChecked, setUsersChecked] = useState<string[]>([]);

  const handleInputsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'search') {
      setShowUsers(true);
    }

    setInputValue((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));

    const usersUpdated =
      event.target.name === 'search'
        ? users.filter((user) => user.email.includes(event.target.value))
        : users;

    setShowUsersUpdated(() => [...usersUpdated]);
  };

  const closeModal = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    setModals((prevState) => ({
      ...prevState,
      addProjectModal: false,
    }));
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    try {
      setCRUDloading(true);
      const response = await addProject(
        _fetch,
        inputValue.title,
        usersChecked,
        auth?.accessToken
      );

      if (response?.status === 200) {
        const project = await response.json();
        setProjects((prevState: any) => [project, ...prevState]);
        closeModal(event);
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
        <h3>Creaete Project</h3>
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

      <Div>
        <StyledInput
          name='search'
          placeholder='Search users...'
          onChange={handleInputsChange}
          value={inputValue.search}
          required
        />
        <Span onClick={() => setShowUsers((prevState) => !prevState)}>
          &#9660;
        </Span>
        {showUsers && (
          <SelectMembers
            adminEmail={adminEmail}
            users={showusersUpdated}
            usersChecked={usersChecked}
            setUsersChecked={setUsersChecked}
          />
        )}
      </Div>
      <StyledButton onClick={handleSubmit}>create project</StyledButton>
    </ModalContainer>
  );
};

export default AddProjectModal;

const Div = styled.div`
  display: flex;
  position: relative;
  /*  justify-content: space-between; */
  padding: 1rem;
`;

const Span = styled.span`
  font-size: 1rem;
  cursor: pointer;
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
