import { React, useEffect } from 'react';
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

  if (loading) {
    return <LoadingScreen />
  }

  if (user) {
    return (
      <div key={key} className="flex flex-col min-h-screen">
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
