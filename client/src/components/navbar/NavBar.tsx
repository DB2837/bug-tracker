import { Link } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import styled from 'styled-components';
import { StyledButton } from '../../styles/StyledButton';
import { FaPowerOff } from 'react-icons/fa';
import Avatar from '../Avatar';

const NavBar = () => {
  const logout = useLogout();

  return (
    <StyledNav>
      {/*   <Link to='/'>projects</Link>
      <Link to='/bugs'>bugs history</Link> */}
      <FaPowerOff style={StyledPowerOff} onClick={logout} />
      <Avatar />
    </StyledNav>
  );
};

export default NavBar;

const StyledPowerOff = {
  cursor: 'pointer',
  fontSize: '1.7rem',
  color: '#fa8925',
  marginRight: '.8rem',
};

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 1.1rem;
  min-width: 290px;
`;
