import { TLogin } from './../pages/login/Login';
import { TRegister } from '../pages/register/Register';
import { BASE_URL } from './apis';

export const sendCrendetial = (
  API_URL: string,
  credential: TRegister | TLogin
) => {
  return fetch(`${BASE_URL}${API_URL}`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(credential),
  });
};
