import React, { useEffect } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import { useNavigation } from '../navigator/navigate';
import { CircleUserRound } from 'lucide-react';


const Profile = () => {
  const { user, loading } = useAuth();
  const { handleNavigation, key } = useNavigation();

  useEffect(() => {
    if (!loading && !user) handleNavigation('/')
  }, [handleNavigation, loading, user]);

  if (loading) return <LoadingScreen />

  if (user && !loading) {
    return (
      <div key={key} className="flex flex-col min-h-screen">
        <MainToolBar />
        <main>
            <div className="flex flex-row mt-16 ml-16 items-center">
                <CircleUserRound className="w-24 h-24"/>
                <div className="flex flex-col ml-8">
                    <p className="text-[2.5rem]">{user.username}</p>
                    <p className="mt-4 text-[1.25rem]">Member since </p>
                </div>
            </div>
        </main>
      </div>
    );
  }

  return null;
};

export default Profile;
