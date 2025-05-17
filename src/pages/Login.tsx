import React, { useEffect, useCallback } from 'react';
import MainToolBar from '../components/MainToolBar';
import LoginForm from '../components/LoginForm';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import breezechesslogo from '../assets/breezechess-logo-2.png';
import { useNavigation } from '../navigator/navigate';
import { User } from '../types/user';

const Login = () => {
  const { user, loading } = useAuth();
  const { handleNavigation, key } = useNavigation();

  const handleUserLogin = useCallback((user: User) => {
    try {
      if (user.is_new_user) {
        handleNavigation('/welcome');
      } else {
        handleNavigation('/');
      }
      } catch (error) {
        console.error(error);
    }
  }, [handleNavigation]);

  useEffect(() => {
    if (user) handleUserLogin(user);
  }, [user, handleUserLogin]);

  if (loading) return <LoadingScreen />;

  if (!user && !loading) return (
    <>
      <div key={key} className="flex flex-col min-h-screen ">
        <MainToolBar />
        <div className="flex grow">
          <div className="w-full lg:w-1/2 flex items-center justify-center from-gray-200:to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <LoginForm />
          </div>
          <div className="hidden lg:flex w-1/2 from-gray-200:to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <div className="relative w-full h-full flex items-center justify-center">
              <a href={!user ? "/" : "/home"}>
                <img src={breezechesslogo} alt="" className="w-125" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (<></>);

};

export default Login;
