import React, { useEffect, useState, useRef } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import { getUserInfo } from '../api/users';
import { useNavigation } from '../navigator/navigate';
import { UserInfo } from '../types/userinfo';
import { formatDate } from '../helpers/formatDate';
import { getFlag } from '../helpers/countryHelpers';
import { CircleUserRound } from 'lucide-react';
import CountrySelector from '../components/CountrySelector';
import PuzzleStatsBox from '../components/PuzzleStatsBox';
import ProfilePieceDisplay from '../components/ProfilePieceDisplay';

const Profile = () => {
  const { user, loading } = useAuth();
  const [userInfo, setUserInfo] = useState<null | UserInfo>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState<boolean>(true);
  const { handleNavigation, key } = useNavigation();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const flagRef = useRef<string>(null);

  useEffect(() => {
    if (!loading && !user) handleNavigation('/')
  }, [handleNavigation, loading, user]);

  const handleGetUserInfo = async () => {
    try {
      if (user && Object.keys(user).length > 0) {
        const res = await getUserInfo(user.id, '?include=country');
        setUserInfo(res);
        const flag = getFlag(res.country_code);
        if (flag) {
          flagRef.current = flag;
        }
        setLoadingUserInfo(false);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }

  useEffect(() => {
    document.title = 'Profile';
    handleGetUserInfo();
  }, [user]);

  if (loading || loadingUserInfo) return <LoadingScreen />

  if (user && !loading && userInfo) {
    return (
      <div key={key} className="flex flex-col min-h-screen">
        <MainToolBar />
        <main className="h-full">
          <div className="flex w-full">
            <div>
              <div className="flex flex-row mt-16 ml-16 items-center min-w-[30rem]">
                <CircleUserRound className="w-24 h-24 min-w-24 min-h-24" />
                <div className="flex flex-col ml-8">
                  <p className="text-[2.5rem] font-semibold">{user.username}</p>
                  <p className="text-[1.25rem] font-medium">Member since {formatDate(new Date(userInfo.created_at))}</p>
                  <div className="flex flex-row items-center">
                    {flagRef.current && (<img src={flagRef.current} alt="flag" className="w-8 h-8 mr-2" />)}
                    <p
                      className="text-[1.25rem] hover:cursor-pointer hover:text-sky-400"
                      onClick={() => { setOpenDialog(true); }}
                    >
                      {userInfo.country_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-[90%] mx-auto min-w-[20rem] hidden lg:block">
                <PuzzleStatsBox />

              </div>
            </div>
            <div className="w-[50%] mx-auto min-w-[30rem] hidden lg:block">
              <ProfilePieceDisplay />

            </div>
          </div>
          <div className="block lg:hidden w-full mt-8 pl-16 pr-16 pb-16">
            <PuzzleStatsBox />
            <ProfilePieceDisplay />
          </div>
          <CountrySelector openDialog={openDialog} setOpenDialog={setOpenDialog} handleGetUserInfo={handleGetUserInfo} />
        </main>
      </div>
    );
  }

  return null;
};

export default Profile;
