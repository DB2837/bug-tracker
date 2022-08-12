import useAuth from './useAuth';
import { BASE_URL, LOGOUT_URL } from '../utils/apis';

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({ accessToken: '' });
    try {
      await fetch(`${BASE_URL}${LOGOUT_URL}`, {
        credentials: 'include',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
