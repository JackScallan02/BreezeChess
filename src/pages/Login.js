import { React, useEffect } from 'react';
import MainToolBar from '../components/MainToolBar';
import LoginForm from '../components/LoginForm';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from '../pages/Loading.js';
import breezechesslogo from '../assets/BreezeChessLogo.png';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleUserLogin = async (user) => {
    try {
    if (user.is_new_user) {
      navigate('/welcome');
    } else {
      navigate('/');
    }
      
    } catch (error) {
      console.error(error);
    }

  }

  useEffect(() => {
    //if (user) navigate('/home');
    // TODO: Check if new user. If new user, then navigate to welcome page.
    if (user) handleUserLogin(user);
  }, [user, navigate]);

  if (loading) return <LoadingScreen />;

  if (!user && !loading) return (
    <>
      <style jsx>{`
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-rotate {
          animation: rotate 20s linear infinite;
          hover:scale-105;
        }
      `}</style>
      <div className="flex flex-col min-h-screen ">
        <MainToolBar />
        <div className="flex flex-grow">
          <div className="w-full lg:w-1/2 flex items-center justify-center from-gray-200:to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <LoginForm />
          </div>
          <div className="hidden lg:flex w-1/2 from-gray-200:to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <div className="relative w-full h-full flex items-center justify-center">
              <a href={!user ? "/" : "/home"}>
                <img src={breezechesslogo} alt="" className="w-60 animate-rotate" />
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
