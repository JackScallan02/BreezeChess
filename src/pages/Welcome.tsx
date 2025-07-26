import React, { useState, useEffect } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import { updateUser, checkUsernameExists } from '../api/users';
import { useNavigation } from '../navigator/navigate';

const Welcome = () => {
  const { user, loading, setLoading, handleUserUpdate } = useAuth();
  const { handleNavigation, key } = useNavigation();

  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [redBorder, setRedBorder] = useState(false);

  const handleSignIn = async () => {
    setErrorMsg('');
    setRedBorder(false);

    try {
      if (user) {
        setLoading(true);
        const curTime = Date.now();

        await updateUser(user.id, {
          username: username.trim(),
          is_new_user: false,
        });
        await handleUserUpdate();

        const afterTime = Date.now();
        const loadingDuration = Math.max(750 - (afterTime - curTime), 0);

        setTimeout(() => {
          setLoading(false);
          handleNavigation('/');
        }, loadingDuration);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.is_new_user) {
      handleNavigation('/');
    }
  }, [user])

  const validateUsername = async () => {
    const trimmed = username.trim().toLowerCase();

    if (!trimmed.match(/^[0-9a-z]+$/)) {
      setErrorMsg("Username must only contain letters or numbers.");
      setRedBorder(true);
      return false;
    }
    if (trimmed.length < 3) {
      setErrorMsg("Username must be at least 3 characters long.");
      setRedBorder(true);
      return false;
    }
    if (trimmed.length > 20) {
      setErrorMsg("Username must be less than 20 characters long.");
      setRedBorder(true);
      return false;
    }

    const usernameExists = await checkUsernameExists(trimmed);
    if (usernameExists) {
      setErrorMsg("Username already exists. Please choose another username.");
      setRedBorder(true);
      return false;
    }

    return true;
  };

  if (loading) return <LoadingScreen />;

  if (user && user.is_new_user && !loading) {
    return (
      <div key={key} className="flex flex-col min-h-screen">
        <MainToolBar />

        <div className="flex flex-row justify-center mt-12">
          <p className="text-[2.5rem] dark:text-white font-extrabold tracking-tight">
            Welcome to BreezeChess!
          </p>
        </div>

        <div className="flex flex-col items-center mt-12">
          <div className="flex flex-col">
            <label className="text-lg font-medium dark:text-white">
              Choose a Username
            </label>
            <input
              className={`w-[30%] min-w-[400px] border-2 rounded-xl p-4 mt-1 bg-transparent ${
                redBorder ? 'border-red-400' : 'border-black bc-dark-border'
              }`}
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setRedBorder(false);
              }}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  if (await validateUsername()) {
                    await handleSignIn();
                  }
                }
              }}
            />
          </div>

          {errorMsg && (
            <p className="mt-4 text-red-400 text-sm font-medium">{errorMsg}</p>
          )}

          <div className="flex flex-row justify-center mt-4">
            <button
              className="w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] transition-all py-4 rounded-xl bg-sky-500 text-white text-lg font-bold"
              onClick={async () => {
                if (await validateUsername()) {
                  await handleSignIn();
                }
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Welcome;
