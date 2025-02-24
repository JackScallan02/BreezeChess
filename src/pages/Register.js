import { React, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import { firebase, auth } from '../Firebase.js'
import LoadingScreen from '../pages/Loading.js';
import { getRedirectResult, signInWithRedirect, createUserWithEmailAndPassword } from "firebase/auth"

const Register = (props) => {
  const {user, loading} = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false); // Used to check if error thrown from firebase
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [redBorder, setRedBorder] = useState({ email: false, password: false });
  const [signUpClicked, setSignUpClicked] = useState(false);

  const createUser = async (email, password) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setLoginError(false);
        if (result && result.user) {
          navigate('/welcome');
        }
    } catch (err) {
        setLoginError(true);
        if (err.code === 'auth/invalid-email') {
            setErrorMsg('The email address is badly formatted.');
            setRedBorder({email: true, password: false});
          } else if (err.code === 'auth/email-already-in-use') {
            setErrorMsg('The email address is already in use.');
            setRedBorder({email: true, password: false});
          } else if (err.code === 'auth/weak-password') {
            setErrorMsg(err.message.replace(/^Firebase: /, '').split(' (auth/')[0]);
            setRedBorder({email: false, password: true});
          } else {
            setErrorMsg('Failed to login. Please try again.');
            setRedBorder({email: false, password: false})
        }
        console.error(err);
    }
}

const validateEmail = () => {
  if (loginError) {
    return false;
  }
  if (email === '') {
    setErrorMsg('Please enter an email');
    setRedBorder({email: true, password: redBorder.password});

    return false;
  }

  // TODO: Check that email is not already taken

  setRedBorder({email: true, password: redBorder.password});
  return true;
}

const validatePassword = () => {
  const regex = /^(?=(.*\d.*){2})(?=(.*[!@#$%^&*(),.?":{}|<>].*)).+$/; //Checks if at least 2 numbers and at least 1 special character

  if (loginError) {
    return false;
  }
  if (password === '') {
    setErrorMsg('Please enter a password');
    setRedBorder({email: redBorder.email, password: true});
    return false;
  } else if (password.length > 30) {
    setErrorMsg('Password must be less than 30 characters long.');
    setRedBorder({email: redBorder.email, password: true});
    return false;
  } else if (password.length < 8) {
    setErrorMsg('Password must be at least 8 characters long.');
    setRedBorder({email: redBorder.email, password: true});
    return false;
  } else if (!regex.test(password)) {
    setErrorMsg('Password must contain at least 2 numbers and 1 special character. (Example special characters: #, $, !)');
    setRedBorder({email: redBorder.email, password: true});
    return false;
  }
  setRedBorder({email: redBorder.email, password: false});
  return true;
}

useEffect(() => {
  // When they change the email/password, reset the login error variable to false
  // and corresponding red border outline.
  if (loginError) {
    setLoginError(false);
  }
  setRedBorder({email: redBorder.email, password: false});

}, [password]);

useEffect(() => {
  // When they change the email/password, reset the login error variable to false
  // and corresponding red border outline.
  if (loginError) {
    setLoginError(false);
  }
  setRedBorder({email: false, password: redBorder.password});

}, [email]);

const validateLogin = () => {
  if (email === '' && password === '') {
      setErrorMsg('Please enter an email and password');
      return false;
  }

  if (!validateEmail()) {
    return false;
  }

  return validatePassword();
}

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <MainToolBar />
        <div className="flex flex-row justify-center mt-12">
          <p className="text-[2.5rem] text-slate-900 font-extrabold tracking-tight">
            Register for BreezeChess
          </p>
          </div>
        {!signUpClicked ? (
        <div className='mt-8 flex flex-col gap-y-4'>
          <div className="flex flex-row justify-center">
            <button
              className='w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-4 rounded-xl bg-sky-500 text-white text-lg font-bold'
              onClick={(event) => { setSignUpClicked(true); }}
            >
              Sign up
            </button>
          </div>
          <div className="flex flex-row justify-center">
            <button className='w-[30%] min-w-[400px] flex py-3 rounded-xl border-2 border-black items-center justify-center gap-2 active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335" />
                <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853" />
                <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2" />
                <path d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z" fill="#FBBC05" />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
        ) : (
          <div>
            <div className='mt-4 w-screen flex flex-col items-center gap-y-4'>
                <div className="flex flex-col">
                    <label className='text-lg font-medium'>Enter an email</label>
                    <input
                        className={`w-[30%] min-w-[400px] border-2 rounded-xl p-4 mt-1 bg-transparent ${(redBorder.email) ? 'border-red-400' :  'border-black' }`}
                        placeholder='Email'
                        onInput={(event) => { setEmail(event.target.value);}}
                    />
                </div>
                <div className="flex flex-col">
                <label className='text-lg font-medium'>Choose a Password</label>
                <input
                        className={`w-[30%] min-w-[400px] border-2 rounded-xl p-4 mt-1 bg-transparent ${(redBorder.password) ? 'border-red-400' :  'border-black' }`}
                        placeholder='Password'
                        type='password'
                        onInput={(event) => { setPassword(event.target.value)}}
                    />
                </div>
                <p className='mt-4 text-red-400'>{errorMsg}</p>
                <div className="flex flex-row justify-center">
                  <button
                    className='w-[30%] min-w-[400px] active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-4 rounded-xl bg-sky-500 text-white text-lg font-bold'
                    onClick={(event) => { if (validateLogin()) { createUser(email, password); }}}
                  >
                    Sign up
                  </button>
                </div>
              </div>
              
          </div>
        )}
      </div>
    </>
  );
};

export default Register;
