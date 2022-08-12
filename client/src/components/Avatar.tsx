import styled from 'styled-components';
import jwt_decode from 'jwt-decode';
import useAuth from '../hooks/useAuth';
import { TPayload } from '../types';

type TProps = {
  firstName?: string;
};

const Avatar = ({ firstName }: TProps) => {
  const { auth } = useAuth();
  const payload: TPayload = jwt_decode(auth?.accessToken as string);
  const currentUserName = payload?.firstName;

  return (
    <Circle>
      {firstName
        ? firstName[0].toUpperCase()
        : currentUserName[0].toUpperCase()}
    </Circle>
  );
};

export default Avatar;

const Circle = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  /*  border: 2px solid #fff; */
  background-color: #565656;
  color: #fa8925;
  font-weight: bold;
`;
