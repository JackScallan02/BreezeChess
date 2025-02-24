import { React, useState } from 'react';
import { useNavigate } from "react-router-dom";
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import { firebase, auth } from '../Firebase.js'
import LoadingScreen from '../pages/Loading.js';

const Welcome = (props) => {
  const {user, loading} = useAuth();
  const navigate = useNavigate();

  if (loading) return <LoadingScreen />;

  if (user && !loading) return (
    <>
      <div className="flex flex-col min-h-screen">
        <MainToolBar />
        <div className="flex flex-row justify-center mt-12">
          <p className="text-[2.5rem] text-slate-900 font-extrabold tracking-tight">
            Welcome to BreezeChess!
          </p>
          </div>
        </div>
    </>
  );

  return (<></>);
};

export default Welcome;
