import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/utils/storage';
import { LS } from '@/constants';

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(false);
  const [user, setUser] = useState(null);

  const login = (data) => {
    const dataToken = data?.token;
    const dataUser = {
      Id: data?.Id,
      name: data?.name,
      email: data?.email,
    };

    storage.set(LS.token, dataToken);
    setSession(dataToken);

    storage.set(LS.user, dataUser, 'object');
    setUser(dataUser);
  };

  const logout = () => {
    setUser(null);
    setSession(false);
    storage.remove(LS.token);
    storage.remove(LS.user);
  };

  const getInfo = () => {
    const user = storage.get(LS.user, 'object');
    const token = storage.get(LS.token);
    setUser(user);
    setSession(token);
  };

  const data = {
    login,
    logout,
    session,
    user,
  };

  useEffect(() => {
    getInfo();
  }, []);

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
