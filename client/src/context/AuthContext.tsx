import { createContext, useState } from 'react';

type TProps = {
  children: JSX.Element;
};

type TContext = {
  auth: TAuth | null;
  setAuth: React.Dispatch<React.SetStateAction<TAuth | null>>;
};

type TAuth = {
  accessToken: string;
};

const AuthContext = createContext({} as TContext);

//{ children }: { children: JSX.Element }

export const AuthProvider = ({ children }: TProps) => {
  const [auth, setAuth] = useState<TAuth | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
