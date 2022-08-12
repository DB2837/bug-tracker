import styled from 'styled-components';
import { FaTrash, FaPen } from 'react-icons/fa';
import { IoMdPersonAdd } from 'react-icons/io';
import React from 'react';
import { Project, TModals } from '../types';

type TProjectCardProps = {
  project: Project;
  currentUser: string;
  navigate: () => void;
  SelectedProject: React.MutableRefObject<Project>;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
};

const ProjectCard = ({
  project,
  currentUser,
  navigate,
  setModals,
  SelectedProject,
}: TProjectCardProps) => {
  const isAdmin = project.createdBy['email'] === currentUser;

  const handleIconsClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    SelectedProject.current = project;
  };

  return (
    <Card onClick={navigate}>
      <Title>{project.title}</Title>
      <Attribute>
        admin: <Value>{project.createdBy['email']}</Value>
      </Attribute>
      <Attribute>
        members: <Value>{project.members.length}</Value>
      </Attribute>
      <Attribute>
        bugs: <Value>{project.bugs.length}</Value>
      </Attribute>
      <Attribute>
        <Value> {project.createdAt}</Value>
      </Attribute>
      {isAdmin && (
        <IconsContainer onClick={handleIconsClick}>
          <IoMdPersonAdd
            style={IconsStyle}
            onClick={() => {
              setModals((prevState) => ({
                ...prevState,
                addMembersModal: true,
              }));
            }}
          />
          <FaPen
            style={IconsStyle}
            onClick={() => {
              setModals((prevState) => ({
                ...prevState,
                editTitleModal: true,
              }));
            }}
          />
          <FaTrash
            style={IconsStyle}
            onClick={() => {
              setModals((prevState) => ({
                ...prevState,
                deleteModal: true,
              }));
            }}
          />
        </IconsContainer>
      )}
    </Card>
  );
};

export default ProjectCard;

const IconsStyle = {
  fontSize: '1.2em',
  marginLeft: '.7rem',
  cursor: 'pointer',
};

const Card = styled.div`
  min-height: 255px;
  max-height: 290px;
  width: 300px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  /* border: 2px solid #f8edab; */
  color: #ff7a41;
  background-color: #202020;

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
  :hover {
    transform: scale(1.06);
    transition: all 0.2s ease-in-out;
  }
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 1rem;
`;

const Attribute = styled.p`
  margin: 0.3rem 0;
  font-weight: bold;
`;
const Value = styled.span`
  font-weight: normal;
  font-style: italic;
  color: #fff;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2.5rem;
`;
