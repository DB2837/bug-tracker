import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Project, TModals } from '../../types';
import { StyledButton } from '../../styles/StyledButton';
import SelectMembers from './SelectMembers';
import ModalContainer from './ModalContainer';
import { User } from '../../types';
import Loader from '../Loader';

type TProps = {
  adminEmail: string;
  selectedProject: Project;
  users: User[];
  usersChecked: string[];
  CRUDLoading: boolean;
  setUsersChecked: React.Dispatch<React.SetStateAction<string[]>>;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
  handleUpdateMembers: () => Promise<void>;
};

const AddMembersModal = ({
  setModals,
  users,
  selectedProject,
  adminEmail,
  CRUDLoading,
  setUsersChecked,
  handleUpdateMembers,
  usersChecked,
}: TProps) => {
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [showusersUpdated, setShowUsersUpdated] = useState<any[]>(() => users);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setUsersChecked(() =>
      selectedProject.members.map((member) => member.email)
    );
  }, []);

  const handleInputsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowUsers(true);
    setInputValue(event.target.value);
    const usersUpdated = users.filter((user) =>
      user.email.includes(event.target.value)
    );

    setShowUsersUpdated(() => [...usersUpdated]);
  };

  return (
    <ModalContainer setModals={setModals}>
      <Div>
        {CRUDLoading && <Loader />}
        <h3>Update project members</h3>
      </Div>
      <Div>
        <StyledInput
          placeholder='Search users...'
          onChange={handleInputsChange}
          value={inputValue}
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
      <StyledButton onClick={handleUpdateMembers}>update members</StyledButton>
    </ModalContainer>
  );
};

export default AddMembersModal;

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
