import { React, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from '../pages/Loading.js';
import { updateUser } from '../api/users.js';

const Welcome = () => {
  const {user, loading, setLoading, handleUserUpdate} = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [redBorder, setRedBorder] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/');
    if (user && !loading && !user.is_new_user) navigate('/home');

  }, [navigate, loading, user]);

  const handleSignIn = async () => {
    setErrorMsg('');
    setRedBorder(false);
    try {
      setLoading(true);
      const curTime = Date.now();
      await updateUser(user.id, { username: username, is_new_user: false });
      await handleUserUpdate(); // Since we updated the display name, we need to refresh the user object
      const afterTime = Date.now();
      // We want to show the loading screen for at least 1 second (so it doesn't flicker).
      if (afterTime - curTime < 1000) {
        setTimeout(() => {
          setLoading(false);
          navigate('/home');
        }, [1000 - (afterTime - curTime)])
      } else {
        setLoading(false);
        navigate('/home');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const validateUsername = () => {

    if (!username.toLowerCase().match(/^[0-9a-z]+$/)) {
        setErrorMsg("Username must only contain letters or numbers.");
        setRedBorder(true);
        return false;
    }
    if (username.length < 3) {
        setErrorMsg("Username must be at least 3 characters long.");
        setRedBorder(true);
        return false;
    }
    if (username.length > 20) {
        setErrorMsg("Username must be less than 20 characters long.");
        setRedBorder(true);
        return false;
    }
    // TODO: Want to check for profane words

    // TODO: Want to check that the name isn't taken already (case-insensitive), via the database
    return true;
  }

  if (loading) return <LoadingScreen />;

  if (user && !loading && user.is_new_user) return (
    <>
      <div className="flex flex-col min-h-screen">
        <MainToolBar />
        <div className="flex flex-row justify-center mt-12">
          <p className="text-[2.5rem] text-slate-900 dark:text-white font-extrabold tracking-tight">
            Welcome to BreezeChess!
          </p>
        </div>
        <div className="flex flex-col items-center mt-12">
            <div className="flex flex-col">
                <label className='text-lg font-medium dark:text-white'>Choose a Username</label>
                <input
                    className={`w-[30%] min-w-[400px] border-2 dark:border-slate-600 rounded-xl p-4 mt-1 bg-transparent ${redBorder ? 'border-red-400' : 'border-black'}`}
                    placeholder='Username'
                    onInput={(event) => { setUsername(event.target.value); setRedBorder(false); }}
                />
            </div>
            <p className='mt-4 text-red-400'>{errorMsg}</p>
            <div className="flex flex-row justify-center mt-2">
                <button
                    className='w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-4 rounded-xl bg-sky-500 text-white text-lg font-bold'
                    onClick={(event) => {if (validateUsername()) { handleSignIn(); }}}
                >
                    Sign up
                </button>
            </div>
        </div>
        </div>
    </>
  );

  return (<></>);
};

export default Welcome;
