import { useEffect, useState } from 'react';
import { Link /* , useNavigate */, useNavigate } from 'react-router-dom';
/* import { LOGIN_URL } from '../../utils/apis';
import { sendCrendetial } from '../../utils/sendCrendetial'; */
import { FormBtn } from '../../styles/buttons/FormBtn';
import { Form } from '../../styles/forms/LoginForm';
import { InputContainer } from '../../styles/forms/InputContainer';
import { StyledInput } from '../../styles/forms/StyledInput';
import { DisabledBtn } from '../../styles/buttons/DisabledBtn';
import CustomError from '../../components/CustomError';
import useLogin from '../../hooks/useLogin';
import useAuth from '../../hooks/useAuth';
import styled from 'styled-components';

export type TLogin = {
  email: string;
  password: string;
};

/* const fetchOptions = {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  redirect: 'follow', // manual, *follow, error
  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  body: JSON.stringify(data) // body data type must match "Content-Type" header
}; */

const Login = () => {
  const { auth } = useAuth();
  const login = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.accessToken) navigate('/', { replace: true });
  }, []);

  /* const location = useLocation(); */
  /*  const from = location.state?.from?.pathname || '/'; */

  const [credential, setCredential] = useState<TLogin>(() => ({
    email: '',
    password: '',
  }));

  const [errorMessage, seterrorMessage] = useState('');

  let validInputs = credential.email && credential.password;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCredential((prevState) => {
      const newState = {
        ...prevState,
        [event.target.name]: event.target.value,
      };
      return newState;
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const response = await login(credential);

      /* const response = await sendCrendetial(LOGIN_URL, credential); */

      if (!response) {
        seterrorMessage('No Server Response');
        return;
      }

      if (response.status >= 400 && response.status < 500) {
        seterrorMessage('Login Failed, invalid credential.');
        return;
      }

      /*  const data = await response.json();

      setAuth({ accessToken: data.accessToken }); */

      setCredential({
        email: '',
        password: '',
      });

      /*  navigate('/', { replace: true }); */
    } catch (error: any) {
      console.log(error);
      seterrorMessage('Something went wrong.');
    }
  };

  return (
    <Div>
      <Form onSubmit={handleSubmit}>
        {errorMessage && <CustomError text={errorMessage} />}
        <InputContainer>
          <label htmlFor='email'></label>
          <StyledInput
            type='email'
            name='email'
            placeholder='Email Address'
            value={credential?.email}
            onChange={handleChange}
            autoComplete='off'
            onFocus={() => seterrorMessage('')}
          />
        </InputContainer>

        <InputContainer>
          <label htmlFor='password'></label>
          <StyledInput
            type='password'
            name='password'
            placeholder='Password'
            value={credential?.password}
            onChange={handleChange}
            autoComplete='off'
            onFocus={() => seterrorMessage('')}
          />
        </InputContainer>
        {validInputs ? (
          <FormBtn type='submit'>Log in</FormBtn>
        ) : (
          <DisabledBtn disabled>Log In</DisabledBtn>
        )}

        <InputContainer>
          <p style={{ paddingTop: '12px', marginTop: '12px' }}>
            Don't have an account? Register{' '}
            <Link to='/register' style={{ color: '#ba1fda' }}>
              here
            </Link>
          </p>
        </InputContainer>
      </Form>
    </Div>
  );
};

export default Login;

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  height: 100vh;
  position: relative;
`;
