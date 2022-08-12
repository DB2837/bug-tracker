import useAuth from './useAuth';
import useLogout from './useLogout';
import { BASE_URL, REFRESH_URL } from '../utils/apis';

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const logout = useLogout();

  const refresh = async () => {
    const controller = new AbortController();
    const { signal } = controller;

    try {
      const response = await fetch(`${BASE_URL}${REFRESH_URL}`, {
        method: 'GET',
        credentials: 'include',
        signal: signal,
      });

      if (response.status >= 400 && response.status < 500) {
        await logout();
        return;
      }

      const { accessToken }: { accessToken: string } = await response.json();

      setAuth((prevState) => ({
        ...prevState,
        accessToken: accessToken,
      }));

      return accessToken;
    } catch (err) {
      console.log(err);
    } finally {
      controller.abort();
    }
  };

  return refresh;
};

export default useRefreshToken;
