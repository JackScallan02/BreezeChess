import { React, useEffect } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/')
  }, [navigate, loading, user]);

  if (loading) {
    return <LoadingScreen />
  }

  if (user) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainToolBar />
        <main>
          <div className="flex flex-col">
            <p>Welcome, {user.username}</p>
          </div>
        </main>
      </div>
    );
  }

  return null;
};


export default Home;
