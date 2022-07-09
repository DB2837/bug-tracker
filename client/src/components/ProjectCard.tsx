import styled from 'styled-components';
import { FaTrash, FaPen } from 'react-icons/fa';
import { IoMdPersonAdd } from 'react-icons/io';
import React from 'react';
import { Project, TModals } from '../types';

type TProjectCardProps = {
  title: string;
  bugs: number;
  admin: string;
  createdAt: string;
  projectID: string;
  currentUser: string;
  members: any[];
  navigate: () => void;
  setSelectedProjectMembers: React.Dispatch<React.SetStateAction<any[]>>;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
  setSelectedProjectID: React.Dispatch<React.SetStateAction<string>>;
};

const ProjectCard = ({
  title,
  bugs,
  admin,
  createdAt,
  projectID,
  currentUser,
  members,
  navigate,
  setModals,
  setSelectedProjectID,
  setSelectedProjectMembers,
}: TProjectCardProps) => {
  const isAdmin = admin === currentUser;

  return (
    <Card onClick={navigate}>
      <Title>{title}</Title>
      <Attribute>
        admin: <Value>{admin}</Value>
      </Attribute>
      <Attribute>
        members: <Value>{members.length}</Value>
      </Attribute>
      <Attribute>
        bugs: <Value>{bugs}</Value>
      </Attribute>
      <Attribute>
        <Value> {createdAt}</Value>
      </Attribute>
      {isAdmin && (
        <IconsContainer onClick={(e) => e.stopPropagation()}>
          <IoMdPersonAdd
            style={IconsStyle}
            onClick={(e) => {
              setSelectedProjectMembers(() => members);
              setModals((prevState) => ({
                ...prevState,
                addMembersModal: true,
              }));
              setSelectedProjectID(() => projectID);
            }}
          />
          <FaPen
            style={IconsStyle}
            onClick={() => {
              setModals((prevState) => ({
                ...prevState,
                editTitleModal: true,
              }));
              setSelectedProjectID(() => projectID);
            }}
          />
          <FaTrash
            style={IconsStyle}
            onClick={() => {
              setModals((prevState) => ({
                ...prevState,
                deleteModal: true,
              }));
              setSelectedProjectID(() => projectID);
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
  min-height: 250px;
  max-height: 270px;
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
