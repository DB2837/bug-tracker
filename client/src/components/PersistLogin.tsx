import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRefreshToken from '../hooks/useRefreshToken';
import Loader from './Loader';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  /*  console.log(isLoading);
  console.log(auth); */
  return isLoading ? <Loader /> : <Outlet />;
};

export default PersistLogin;
