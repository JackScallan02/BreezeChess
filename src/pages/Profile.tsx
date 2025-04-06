import React, { useEffect, useState } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import { getUserInfo } from '../api/users';
import { useNavigation } from '../navigator/navigate';
import { UserInfo } from '../types/userinfo';
import { formatDate } from '../helpers/formatDate';
import { CircleUserRound } from 'lucide-react';


const Profile = () => {
  const { user, loading } = useAuth();
  const [userInfo, setUserInfo] = useState<null | UserInfo>(null);
  const { handleNavigation, key } = useNavigation();

  useEffect(() => {
    if (!loading && !user) handleNavigation('/')
  }, [handleNavigation, loading, user]);

  const handleGetUserInfo = async () => {
    try {
      if (user && Object.keys(user).length > 0) {
        const res = await getUserInfo(user.id, '?include=country');
        setUserInfo(res);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }


  useEffect(() => {
    document.title = 'Profile';
    handleGetUserInfo();
  }, [user]);

  if (loading) return <LoadingScreen />

  if (user && !loading && userInfo) {
    return (
      <div key={key} className="flex flex-col min-h-screen">
        <MainToolBar />
        <main>
            <div className="flex flex-row mt-16 ml-16 items-center">
                <CircleUserRound className="w-24 h-24"/>
                <div className="flex flex-col ml-8">
                    <p className="text-[2.5rem]">{user.username}</p>
                    <p className="text-[1.25rem]">Member since {formatDate(new Date(userInfo.created_at))}</p>
                    <p className="text-[1.25rem]">{userInfo.country_name}</p>
                </div>
            </div>
        </main>
      </div>
    );
  }

  return null;
};

export default Profile;
