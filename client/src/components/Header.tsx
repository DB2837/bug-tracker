import styled from 'styled-components';
import { ImBug } from 'react-icons/im';
import NavBar from './navbar/NavBar';

const Header = () => {
  return (
    <StyledHeader>
      <ImBug style={IconsStyle} />
      <NavBar />
    </StyledHeader>
  );
};

export default Header;

const IconsStyle = { fontSize: '2rem', color: '#ff7034' };

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-around;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;
