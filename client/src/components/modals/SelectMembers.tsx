import React from 'react';
import styled from 'styled-components';
import { User } from '../../types';
import Avatar from '../Avatar';

type TProps = {
  users: User[];
  adminEmail: string;
  usersChecked: string[];
  setUsersChecked: React.Dispatch<React.SetStateAction<string[]>>;
};

const SelectMembers = ({
  users,
  setUsersChecked,
  usersChecked,
  adminEmail,
}: TProps) => {
  const handleCheck = (userEmail: string) => {
    const isFound = usersChecked.find((email) => email === userEmail);
    if (isFound) {
      setUsersChecked(() =>
        usersChecked.filter((email) => email !== userEmail)
      );
      return;
    }

    setUsersChecked((prevState: any) => {
      return [...prevState, userEmail];
    });
  };

  return (
    <MembersBox>
      {users.map((user) => {
        if (user.email !== adminEmail) {
          return (
            <UserBox key={user.id}>
              <Avatar firstName={user.firstName} />
              {user.email}
              <input
                type='checkbox'
                checked={
                  usersChecked.find((email) => email === user.email)
                    ? true
                    : false
                }
                onChange={() => handleCheck(user.email)}
                id={user.email}
              />
            </UserBox>
          );
        }
        return null;
      })}
    </MembersBox>
  );
};

export default SelectMembers;

const MembersBox = styled.div`
  position: absolute;
  left: 50%;
  top: 165%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 270px;
  max-height: 220px;
  overflow: auto;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #fff;

  z-index: 99;
  background-color: #111111;
`;

const UserBox = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  min-width: 200px;
  align-items: center;
  padding: 0.6rem 0.4rem;
  border-bottom: 2px solid #fff;
`;
