import styled from 'styled-components';
import { FaTrash, FaPen } from 'react-icons/fa';
import { IoMdPersonAdd } from 'react-icons/io';
import React from 'react';
import { DeletionTarget, TModals } from '../types';
import { Priority } from '../types';

type TProjectCardProps = {
  title: string;
  priority: Priority;
  isClosed: boolean;
  author: string;
  createdAt: string;
  projectOwner: string;
  /* updatedAt: string; */
  bugID: string;
  currentUser: string;
  comments?: any[];
  navigate: () => void;
  setSelectedBugID: React.Dispatch<React.SetStateAction<string>>;
  setModals: (value: React.SetStateAction<TModals>) => void;
  DelitionTarget: React.MutableRefObject<DeletionTarget>;
  /*  setSelectedProjectMembers: React.Dispatch<React.SetStateAction<any[]>>;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
  setSelectedProjectID: React.Dispatch<React.SetStateAction<string>>; */
};

const BugCard = ({
  title,
  priority,
  isClosed,
  author,
  createdAt,
  projectOwner,
  /*  updatedAt, */
  bugID,
  comments,
  currentUser,
  navigate,
  setSelectedBugID,
  setModals,
  DelitionTarget,
}: /*  navigate, */
/*  setModals, */
/* setSelectedProjectID,
  setSelectedProjectMembers, */
TProjectCardProps) => {
  const isBugAdmin = currentUser === author || currentUser === projectOwner;

  return (
    <Card onClick={navigate}>
      <Title>{title}</Title>
      <Attribute>
        priority: <Value>{priority}</Value>
      </Attribute>
      <Attribute>
        status: <Value>{isClosed ? 'closed' : 'open'}</Value>
      </Attribute>
      <Attribute>
        createdBy: <Value>{author}</Value>
      </Attribute>
      <Attribute>
        comments: <Value>{comments?.length}</Value>
      </Attribute>
      <Attribute> createdAt: {<Value>{createdAt}</Value>}</Attribute>
      {/* <Attribute>
        updatedAt: <Value>{updatedAt}</Value>
      </Attribute> */}
      {isBugAdmin && (
        <IconsContainer onClick={(e) => e.stopPropagation()}>
          <FaTrash
            style={IconsStyle}
            onClick={() => {
              setSelectedBugID(() => bugID);
              DelitionTarget.current = DeletionTarget.bug;
              setModals((prevState) => ({
                ...prevState,
                deleteModal: true,
              }));
              /* setModals((prevState) => ({
                ...prevState,
                deleteModal: true,
              }));
              setSelectedProjectID(() => projectID); */
            }}
          />
        </IconsContainer>
      )}
    </Card>
  );
};

export default BugCard;

const IconsStyle = {
  fontSize: '1.2em',
  marginLeft: '.7rem',
  cursor: 'pointer',
};

const Card = styled.div`
  min-height: 255px;
  max-height: 290px;
  min-width: 290px;
  max-width: 310px;
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
