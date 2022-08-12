import { useState, useEffect } from 'react';
import { sendCrendetial } from '../../utils/sendCrendetial';
import { FormBtn } from '../../styles/buttons/FormBtn';
import { Form } from '../../styles/forms/LoginForm';
import { InputContainer } from '../../styles/forms/InputContainer';
import { StyledInput } from '../../styles/forms/StyledInput';
import InputModal from '../../components/InputModal';
import { NAMES_REGEX, PASSWORD_REGEX, EMAIL_REGEX } from '../../utils/regEx';
import { DisabledBtn } from '../../styles/buttons/DisabledBtn';
import CustomError from '../../components/CustomError';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styled from 'styled-components';

export type TRegister = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type TInputFocus = {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
};

const REGISTER_URL = process.env.REACT_APP_BE_REGISTER_URL as string;

const Register = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [credential, setCredential] = useState<TRegister>(() => ({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  }));

  const [errorMessage, seterrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const [validFirstName, setValidFirstName] = useState<boolean>(false);
  const [validLastName, setValidLastName] = useState<boolean>(false);
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);

  useEffect(() => {
    if (auth?.accessToken) navigate('/', { replace: true });
  }, []);

  useEffect(() => {
    setValidFirstName(NAMES_REGEX.test(credential.firstName));
    setValidLastName(NAMES_REGEX.test(credential.lastName));
    setValidEmail(EMAIL_REGEX.test(credential.email));
    setValidPassword(PASSWORD_REGEX.test(credential.password));
  }, [credential]);

  let validInputs =
    validFirstName && validLastName && validEmail && validPassword;

  const [inputsFocus, setInputsFocus] = useState<TInputFocus>(() => ({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  }));

  const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (errorMessage) {
      seterrorMessage('');
      setSuccess(false);
    }

    setInputsFocus((prevState) => {
      const newState = {
        ...prevState,
        [event.target.name]: true,
      };

      return newState;
    });
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputsFocus({
      firstName: false,
      lastName: false,
      email: false,
      password: false,
    });
  };

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
      const response = await sendCrendetial(REGISTER_URL, credential);

      if (response.status === 409) {
        seterrorMessage('Register Failed, User already Exists.');
        return;
      }

      if (response.status >= 400 && response.status < 500) {
        seterrorMessage('Register Failed, invalid credential.');
        return;
      }

      const data = await response.json();
      setSuccess(true);
      seterrorMessage('Registration Completed!');
      console.log(data);

      setCredential({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    } catch (error) {
      console.log(error);
      seterrorMessage('Something went wrong, try later.');
    }
  };

  return (
    <Div>
      <Form /* action='/login' */ autoComplete='off' onSubmit={handleSubmit}>
        {errorMessage && <CustomError text={errorMessage} success={success} />}

        <InputContainer>
          <label htmlFor='firstName'></label>
          <StyledInput
            type='text'
            name='firstName'
            placeholder='First Name'
            value={credential?.firstName}
            onChange={handleChange}
            autoComplete='off'
            isValid={validFirstName ? true : false}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {!validFirstName && inputsFocus.firstName && (
            <InputModal
              text={
                <p>
                  2 to 14 characters.
                  <br />
                  No numbers, underscores, hyphens allowed.
                </p>
              }
            />
          )}
        </InputContainer>

        <InputContainer>
          <label htmlFor='lastName'></label>
          <StyledInput
            type='text'
            name='lastName'
            placeholder='Last Name'
            value={credential?.lastName}
            onChange={handleChange}
            autoComplete='off'
            isValid={validLastName ? true : false}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {!validLastName && inputsFocus.lastName && (
            <InputModal
              text={
                <p>
                  2 to 14 characters.
                  <br />
                  No numbers, underscores, hyphens allowed.
                </p>
              }
            />
          )}
        </InputContainer>

        <InputContainer>
          <label htmlFor='email'></label>
          <StyledInput
            type='email'
            name='email'
            placeholder='Email'
            value={credential?.email}
            onChange={handleChange}
            autoComplete='off'
            isValid={validEmail ? true : false}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {!validEmail && inputsFocus.email && <InputModal />}
        </InputContainer>

        <InputContainer>
          <label htmlFor='password'></label>
          <StyledInput
            type='password'
            name='password'
            placeholder='Password'
            aria-describedby='passwordNote'
            value={credential?.password}
            onChange={handleChange}
            autoComplete='off'
            isValid={validPassword ? true : false}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {!validPassword && inputsFocus.password && (
            <InputModal
              text={
                <p id='passwordNote'>
                  8 to 24 characters. Must include uppercase and lowercase
                  letters, a number and a special character.
                  <br />
                  Allowed special characters:{' '}
                  <span aria-label='exclamation mark'>!</span>{' '}
                  <span aria-label='at symbol'>@</span>{' '}
                  <span aria-label='hashtag'>#</span>{' '}
                  <span aria-label='dollar sign'>$</span>{' '}
                  <span aria-label='percent'>%</span>
                </p>
              }
            />
          )}
        </InputContainer>
        {validInputs ? (
          <FormBtn type='submit' onSubmit={handleSubmit}>
            Register
          </FormBtn>
        ) : (
          <DisabledBtn disabled>Register</DisabledBtn>
        )}

        <InputContainer>
          <p style={{ paddingTop: '12px', marginTop: '12px' }}>
            Already have an account? Log in{' '}
            <Link to='/login' style={{ color: '#ba1fda' }}>
              here
            </Link>
          </p>
        </InputContainer>
      </Form>
    </Div>
  );
};

export default Register;

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  height: 100vh;
  min-height: 600px;
  position: relative;
`;
