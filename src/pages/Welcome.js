import { React, useState, useEffect } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from '../pages/Loading.js';
import { updateUser } from '../api/users.js';
import { getGoals } from '../api/goals.js';
import { createUserGoals } from '../api/user_goals.js';
import { useNavigation } from '../navigator/navigate';
import { useSearchParams } from 'react-router-dom';

const Welcome = () => {
  const {user, loading, setLoading, handleUserUpdate} = useAuth();

  const experience_levels = ['New to Chess', 'Beginner', 'Intermediate', 'Advanced'];

  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [redBorder, setRedBorder] = useState(false);
  const [goals, setGoals] = useState(null);
  const [userExp, setUserExp] = useState(null);
  const [userGoals, setUserGoals] = useState(null);
  const { handleNavigation, key } = useNavigation();

  const [searchParams, setSearchParams] = useSearchParams();
  const step = searchParams.get("step") || "displayName";

  const nextStep = () => {
    if (step === "displayName") {
      setSearchParams({ step: "experience" });
    } else if (step === "experience") {
      setSearchParams({ step: "goals" });
    } else {
      handleNavigation("/home");
    }
  };

  const fetchGoals = async () => {
    const result = await getGoals();
    setGoals(result);
  }

  useEffect(() => {
    fetchGoals();
  }, []);


  useEffect(() => {
    if (!loading && !user) handleNavigation('/');
    if (user && !loading && !user.is_new_user) handleNavigation('/home');

  }, [handleNavigation, loading, user]);


  const handleSignIn = async () => {
    setErrorMsg('');
    setRedBorder(false);
    try {
      setLoading(true);
      const curTime = Date.now();
      await updateUser(user.id, { username: username });
      await handleUserUpdate(); // Since we updated the display name, we need to refresh the user object
      const afterTime = Date.now();
      // We want to show the loading screen for at least 1 second (so it doesn't flicker).
      if (afterTime - curTime < 1000) {
        setTimeout(() => {
          setLoading(false);
          nextStep();
        }, [1000 - (afterTime - curTime)])
      } else {
        setLoading(false);
        nextStep();
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

  const handleGoalSelection = (goal) => {
    if (!userGoals) {
      // Initialize array with goal
      setUserGoals([goal.id])
    } else {
      if (userGoals.includes(goal.id)) {
        // Remove goal
        setUserGoals(userGoals.filter((val) => val !== goal.id));
      } else {
        // Add goal
        setUserGoals([...userGoals, goal.id]);
      }
    }
  }

  const handleExpSelection = (level) => {
      setUserExp(level);
  }

  const handleGoalSubmission = async () => {
    if (userGoals && userGoals.length > 0) {
      setLoading(true);
      await createUserGoals({
        user_id: user.id,
        goal_ids: userGoals
      });
      await updateUser(user.id, { is_new_user: false, experience_level: userExp })
      nextStep();
      setLoading(false);
    }
  }

  const handleExpSubmission = () => {
    // TODO update user exp
    if (userExp) nextStep();
  }


  if (loading) return <LoadingScreen />;

  if (user && !loading && user.is_new_user) return (
    <>
    {step === "displayName" && (
      <div key={key} className="flex flex-col min-h-screen">
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
                  onClick={() => {if (validateUsername()) { handleSignIn(); }}}
              >
                  Sign up
              </button>
          </div>
      </div>
      </div>
    )}
    {step === "experience" && (
      <div key={key} className="flex flex-col min-h-screen">
        <MainToolBar />
        <div className="flex flex-row justify-center mt-12">
          <p className="text-[2.5rem] text-slate-900 dark:text-white font-extrabold tracking-tight">
            Welcome to BreezeChess!
          </p>
        </div>
        <div className="flex flex-row justify-center mt-12">
          <p className="text-[1.5rem] text-slate-900 dark:text-white font-extrabold tracking-tight">
            What is your chess experience level?
          </p>
        </div>
        <div className="flex flex-col items-center mt-8 gap-y-8">
          {experience_levels.map((level) => (
            <div key={level}>
              <button
                className={`w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all
                  py-4 rounded-xl text-white text-lg font-bold ${userExp && userExp === level ? 'bg-sky-500 border-blue-500 border-2 dark:border-slate-600' : 'bg-sky-300'}`}                onClick={() => { handleExpSelection(level); }}
              >
                {level}
              </button>
            </div>
          ))}
        <div className="mt-4">
            <button
              className={'w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-4 rounded-xl text-white text-lg font-bold bg-sky-400 disabled:opacity-50 disabled:hover:scale-100 disabled:bg-sky-300'}
              onClick={() => handleExpSubmission()}
              disabled={!userExp}
            >
              <p>
                Submit
              </p>
            </button>
          </div>
        </div>
      </div>
    )}
    {step === "goals" && (
      <div key={key} className="flex flex-col min-h-screen">
        <MainToolBar />
        <div className="flex flex-row justify-center mt-12">
          <p className="text-[2.5rem] text-slate-900 dark:text-white font-extrabold tracking-tight">
            Welcome to BreezeChess!
          </p>
        </div>
        <div className="flex flex-row justify-center mt-8">
          <p className="text-[1.5rem] text-slate-900 dark:text-white font-extrabold tracking-tight">
            Select your goals
          </p>
        </div>
        <div className="flex flex-col items-center mt-8">
          {goals && goals.map((goal) => (
            <div key={goal.id} className="mb-8">
              <button
                className={`w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all
                  py-4 rounded-xl text-white text-lg font-bold ${userGoals && userGoals.includes(goal.id) ? 'bg-sky-500 border-blue-500 border-2 dark:border-slate-600' : 'bg-sky-300'}`}
                onClick={() => handleGoalSelection(goal)}
              >
                {goal.description}
              </button>
            </div>
          ))}
          <div className="mt-4">
            <button
              className={'w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-4 rounded-xl text-white text-lg font-bold bg-sky-400'}
              onClick={() => handleGoalSubmission()}
            >
              <p>
                Submit
              </p>
            </button>
          </div>
        </div>
      </div>
    )}

    </>
  );

  return (<></>);
};

export default Welcome;
