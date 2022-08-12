import { useNavigate } from 'react-router-dom';
import { TLogin } from './../pages/login/Login';
import useAuth from './useAuth';
import { LOGIN_URL } from '../utils/apis';
import useFetch from './useCustomFetch';
import { useState } from 'react';

const useLogin = () => {
  const { setAuth } = useAuth();
  const _fetch = useFetch();
  const navigate = useNavigate();

  const login = async (credentials: TLogin) => {
    try {
      const response = await _fetch(`${LOGIN_URL}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(credentials),
      });

      if (!response) {
        throw new Error('Something went wrong.');
      }

      if (response.status >= 400 && response.status < 500) {
        return response;
      }

      const data = await response.json();
      setAuth({ accessToken: data.accessToken });
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error(err.messages);
      return err.messages;
    }
  };

  return login;
};

export default useLogin;
