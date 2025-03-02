import { React, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from '../pages/Loading.js';

const Welcome = () => {
  const {user, loading} = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [redBorder, setRedBorder] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/')
  }, [navigate, loading, user]);

  const handleSignIn = () => {
    setErrorMsg('');
    setRedBorder(false);
    user.displayName = displayName;
    navigate('/home');
  }

  const validateDisplayName = () => {

    if (!displayName.toLowerCase().match(/^[0-9a-z]+$/)) {
        setErrorMsg("Display name must only contain letters or numbers.");
        setRedBorder(true);
        return false;
    }
    if (displayName.length < 3) {
        setErrorMsg("Display name must be at least 3 characters long.");
        setRedBorder(true);
        return false;
    }
    if (displayName.length > 20) {
        setErrorMsg("Display name must be less than 20 characters long.");
        setRedBorder(true);
        return false;
    }
    // TODO: Want to check for profane words

    // TODO: Want to check that the name isn't taken already (case-insensitive), via the database
    return true;
  }

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
        <div className="flex flex-col items-center mt-12">
            <div className="flex flex-col">
                <label className='text-lg font-medium'>Choose a Display Name</label>
                <input
                    className={`w-[30%] min-w-[400px] border-2 rounded-xl p-4 mt-1 bg-transparent ${redBorder ? 'border-red-400' : 'border-black'}`}
                    placeholder='Display name'
                    onInput={(event) => { setDisplayName(event.target.value); setRedBorder(false); }}
                />
            </div>
            <p className='mt-4 text-red-400'>{errorMsg}</p>
            <div className="flex flex-row justify-center mt-2">
                <button
                    className='w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-4 rounded-xl bg-sky-500 text-white text-lg font-bold'
                    onClick={(event) => {if (validateDisplayName()) { handleSignIn(); }}}
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
