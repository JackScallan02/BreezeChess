import React, { useState, useEffect } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import { updateUser, checkUsernameExists } from '../api/users';
import { getGoals } from '../api/goals';
import { createUserGoals } from '../api/user_goals';
import { useNavigation } from '../navigator/navigate';
import { useSearchParams } from 'react-router-dom';
import { Check } from "lucide-react";
import { Goal } from '../types/goal';
const Welcome = () => {
  const {user, loading, setLoading, handleUserUpdate} = useAuth();

  const experience_levels: string[] = ['New to Chess', 'Beginner', 'Intermediate', 'Advanced'];

  const [username, setUsername] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');
  const [redBorder, setRedBorder] = useState<boolean>(false);
  const [goals, setGoals] = useState<Goal[] | null>(null);
  const [userExp, setUserExp] = useState<string | null>(null);
  const [userGoals, setUserGoals] = useState<number[] | null>(null);
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

  useEffect(() => {
    setLoading(false);
  }, [step]);

  const fetchGoals = async () => {
    const result = await getGoals();
    let goalsArray: Goal[] = [];
    result.forEach((res) => {
      goalsArray.push({id: res.id, description: res.description});
    })
    setGoals(goalsArray);
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
      if (user) {
        setLoading(true);
        const curTime = Date.now();
        await updateUser(user.id, { username: username });
        await handleUserUpdate(); // Since we updated the display name, we need to refresh the user object
        const afterTime = Date.now();
        // Ensure the loading state stays for at least 0.75 seconds
        const loadingDuration = Math.max(750 - (afterTime - curTime), 0);
        // Delay nextStep based on loadingDuration to avoid flickering
        setTimeout(() => {
          nextStep();
        }, loadingDuration);
        
      }
    } catch (error) {
      console.error(error);
    }
  }

  const validateUsername = async () => {

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

    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      setErrorMsg("Username already exists. Please choose another username.");
      setRedBorder(true);
      return false;
    }
    // TODO: Want to check for profane words

    return true;
  }

  const handleGoalSelection = (goal: Goal) => {
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

  const handleExpSelection = (level: string) => {
      setUserExp(level);
  }

  const handleGoalSubmission = async () => {
    if (user && userGoals && userGoals.length > 0) {
      const curTime = Date.now();
      setLoading(true);
      await createUserGoals({
        user_id: user.id,
        goal_ids: userGoals
      });
      await updateUser(user.id, { is_new_user: false, experience_level: userExp });
      await handleUserUpdate(); // Since we updated the display name, we need to refresh the user object
      const afterTime = Date.now();
      // We want to show the loading screen for at least 0.75 seconds (so it doesn't flicker).
      if (afterTime - curTime < 750) {
        setTimeout(() => {
          setLoading(false);
          nextStep();
        }, 750 - (afterTime - curTime));
      } else {
        setLoading(false);
        nextStep();
      }
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
        <p className="text-[2.5rem] dark:text-white font-extrabold tracking-tight">
          Welcome to BreezeChess!
        </p>
      </div>
      <div className="flex flex-col items-center mt-12">
          <div className="flex flex-col">
              <label className='text-lg font-medium dark:text-white'>Choose a Username</label>
              <input
                  className={`w-[30%] min-w-[400px] border-2 rounded-xl p-4 mt-1 bg-transparent ${redBorder ? 'border-red-400' : 'border-black bc-dark-border'}`}
                  placeholder='Username'
                  onInput={(event: React.ChangeEvent<HTMLInputElement>) => { setUsername(event.target.value); setRedBorder(false); }}
                  onKeyDown={(async (event: React.KeyboardEvent<HTMLInputElement>) => {
                      if (event.key === 'Enter') {
                        if (await validateUsername()) {
                          handleSignIn();
                        }
                      }
                  })}
              />
          </div>
          <p className='mt-4 text-red-400'>{errorMsg}</p>
          <div className="flex flex-row justify-center mt-2">
              <button
                  className='w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:cursor-pointer ease-in-out transition-all py-4 rounded-xl bg-sky-500 text-white text-lg font-bold'
                  onClick={async () => {if (await validateUsername()) { handleSignIn(); }}}
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
          <p className="text-[2.5rem] dark:text-white font-extrabold tracking-tight">
            Welcome to BreezeChess!
          </p>
        </div>
        <div className="flex flex-row justify-center mt-12">
          <p className="text-[1.5rem] dark:text-white font-extrabold tracking-tight">
            What is your chess experience level?
          </p>
        </div>
        <div className="flex flex-col items-center mt-8 gap-y-8">
          {experience_levels.map((level) => (
            <div key={level}>
              <button
                className={`w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:cursor-pointer ease-in-out transition-all
                  py-4 rounded-xl text-white text-lg font-bold ${userExp && userExp === level ? 'bg-indigo-500 border-slate-500 border bc-dark-border' : 'bg-indigo-400'}`}
                  onClick={() => { handleExpSelection(level);
                }}
              >
                {level}
              </button>
            </div>
          ))}
        <div className="mt-4">
            <button
              className={'w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:cursor-pointer ease-in-out transition-all py-4 rounded-xl text-white text-lg font-bold bg-indigo-400 disabled:opacity-50 disabled:hover:scale-100'}
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
          <p className="text-[2.5rem] dark:text-white font-extrabold tracking-tight">
            Welcome to BreezeChess!
          </p>
        </div>
        <div className="flex flex-row justify-center mt-8">
          <p className="text-[1.5rem] dark:text-white font-extrabold tracking-tight">
            Select your goals
          </p>
        </div>
        <div className="flex flex-col items-center mt-8">
          {goals && goals.map((goal: Goal) => (
            <div key={goal.id} className="mb-8">
              <button
                className={`w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:cursor-pointer ease-in-out transition-all flex items-center justify-center
                  py-4 rounded-xl text-white text-lg font-bold ${userGoals && userGoals.includes(goal.id) ? 'bg-indigo-500 border-slate-500 border bc-dark-border' : 'bg-indigo-400'}`}
                onClick={() => handleGoalSelection(goal)}
              >
                {userGoals && userGoals.includes(goal.id) && <Check className="w-6 h-6 text-white-500 ml-4" />}
                <span className={`flex-1 text-center ${userGoals && userGoals.includes(goal.id) && 'mr-5'}`}>{goal.description}</span>
              </button>
            </div>
          ))}
          <div className="mt-4">
            <button
              className={'w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:cursor-pointer ease-in-out transition-all py-4 rounded-xl text-white text-lg font-bold bg-indigo-400'}
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
