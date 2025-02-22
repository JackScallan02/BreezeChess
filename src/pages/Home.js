import { React } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />

  return (
    <div className="flex flex-col min-h-screen">
      <MainToolBar />
      <main>
        <div className="flex flex-col">
          <p>Welcome, {user.displayName}</p>
        </div>
      </main>
    </div>
  );
};




export default Home;
