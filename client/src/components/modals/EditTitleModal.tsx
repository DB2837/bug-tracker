import React, { useState } from 'react';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import useCustomFetch from '../../hooks/useCustomFetch';
import { Project, TModals } from '../../types';
import { updateProjectTitle } from '../../services/project/eiditProjectTitle';
import { StyledInput } from '../../styles/forms/StyledInput';
import { StyledButton } from '../../styles/StyledButton';
import ModalContainer from './ModalContainer';
import Loader from '../Loader';

type TProps = {
  selectedProject: Project;
  CRUDLoading: boolean;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setCRUDloading: React.Dispatch<React.SetStateAction<boolean>>;
};

const replaceProjectsArray = (
  originalProjectsArray: Project[],
  idProjectToReplace: string,
  projectUpdated: Project
) => {
  const index = originalProjectsArray.findIndex(
    (project) => project.id === idProjectToReplace
  );
  originalProjectsArray.splice(index, 1);
  originalProjectsArray.splice(index, 0, projectUpdated);

  return originalProjectsArray;
};

const EditProjectTitle = ({
  setModals,
  setCRUDloading,
  CRUDLoading,
  selectedProject,
  setProjects,
}: TProps) => {
  const { auth } = useAuth();
  const _fetch = useCustomFetch();
  const [title, setTitle] = useState<string>('');

  const handleSubmit = async () => {
    try {
      setCRUDloading(true);
      const response = await updateProjectTitle(
        _fetch,
        selectedProject.id,
        title,
        auth?.accessToken
      );

      if (response?.status === 200) {
        const updatedProject = await response.json();
        setProjects((prevState) => {
          const newProjectsArray = replaceProjectsArray(
            prevState,
            selectedProject.id,
            updatedProject
          );

          return newProjectsArray;
        });

        setModals((prevState) => ({
          ...prevState,
          editTitleModal: false,
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
        <h3>Edit project title</h3>
      </Div>
      <Div>
        <StyledInput
          name='title'
          placeholder='Title...'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </Div>
      <StyledButton onClick={handleSubmit}>update title</StyledButton>
    </ModalContainer>
  );
};

export default EditProjectTitle;

const Div = styled.div`
  display: flex;
  position: relative;
  /*  justify-content: space-between; */
  padding: 1rem;
`;
