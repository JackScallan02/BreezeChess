import React, { useEffect } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import { useNavigation } from '../navigator/navigate';

const Home = () => {
  const { user, loading } = useAuth();
  const { handleNavigation, key } = useNavigation();

  useEffect(() => {
    if (!loading && !user) handleNavigation('/')
  }, [handleNavigation, loading, user]);

  if (loading) return <LoadingScreen />


  if (user && !loading) {
    return (
      <div key={key} className="flex flex-col min-h-screen w-full">
        <MainToolBar />
        <main className="w-full">
          <div className="flex flex-row w-full justify-center mt-8">
            <p className="text-[2rem] font-semibold">Welcome, {user.username}</p>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default Home;
