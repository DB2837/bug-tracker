import { useState } from 'react';
import useAuth from './useAuth';
import useLogout from './useLogout';
import useRefreshToken from './useRefreshToken';
import { BASE_URL } from '../utils/apis';

export type TFetchOptions = {
  method?: string;
  mode?: RequestMode;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  redirect?: RequestRedirect;
  referrerPolicy?: ReferrerPolicy;
  body?: BodyInit | null;
  signal?: AbortSignal;
};

const useCustomFetch = () => {
  /*    const [data, setData] = useState<React.SetStateAction<any>>(null);
  const [error, setError] = useState<React.SetStateAction<any>>(null); */
  /* const [CRUDloading, setCRUDloading] =
    useState<React.SetStateAction<boolean>>(false); */
  const { setAuth } = useAuth();
  const refresh = useRefreshToken();
  const logout = useLogout();

  const _fetch = async (url: string, options: TFetchOptions) => {
    try {
      const response = await fetch(`${BASE_URL}${url}`, options);

      if (response.status === 403) {
        const newAccessToken = await refresh();
        if (!newAccessToken) {
          await logout();
          return;
        }

        options.headers = {
          ...options.headers,
          authorization: `Bearer ${newAccessToken}`,
        };

        const response = await fetch(`${BASE_URL}${url}`, {
          ...options,
        });

        setAuth((prevState) => ({
          ...prevState,
          accessToken: newAccessToken!,
        }));

        return response;
      }

      return response;
    } catch (err: any) {
      console.log(err);

      /* throw err; */
      /*  logout(); */
    }
  };

  return _fetch;
};

export default useCustomFetch;
