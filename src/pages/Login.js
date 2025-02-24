import { React, useEffect } from 'react';
import MainToolBar from '../components/MainToolBar';
import LoginForm from '../components/LoginForm';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { firebase, auth } from '../Firebase.js'
import LoadingScreen from '../pages/Loading.js';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/home');
    // TODO: Check if new user. If new user, then navigate to welcome page.
  }, [user]);

  if (loading) return <LoadingScreen />;

  if (!user && !loading) return (
    <>
      <div className="flex flex-col min-h-screen">
        <MainToolBar />
        <div className="flex flex-grow">
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-200">
            <LoginForm />
          </div>
          <div className="hidden lg:flex w-1/2 bg-gray-200">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-60 h-60 bg-gradient-to-tr from-sky-500 to-white-500 rounded-full"></div>
              <div className="w-full h-1/2 absolute"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (<></>);

};

export default Login;
