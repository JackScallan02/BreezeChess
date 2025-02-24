import { React, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { firebase, auth } from '../Firebase.js'
import LoadingScreen from '../pages/Loading.js';
import { getRedirectResult, signInWithRedirect, signInWithEmailAndPassword } from "firebase/auth"

const LoginForm = () => {

    const {user, loading} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false); // Used to check if error thrown from firebase
    const [remember, setRemember] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [redBorder, setRedBorder] = useState({email: false, password: false});


    const handleRedirectSignIn = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                console.log("result: ", result);
                // Check if new user by querying database
                // Successful google login
                // Send this idToken to firebase backend to verify identity.
                // Store uuid in database.
            } else {
                // No user found
            }
        } catch(err) {
            console.error(err);
            setErrorMsg('Failed to login. Please try again.');
            setRedBorder({email: false, password: false})
        }

    }

    const signInUser = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
            setLoginError(true);
            if (err.code === 'auth/invalid-email') {
                setErrorMsg('The email address is badly formatted.');
                setRedBorder({email: true, password: false});

              } else if (err.code === 'auth/user-not-found') {
                setRedBorder({email: true, password: false});
                setErrorMsg(
                <>
                    <div className="flex justify-center flex-col">
                        <p>No user exists with the provided email. </p>
                        <button
                            className='text-sky-500 text-base text-center font-medium hover:text-sky-400'
                            onClick={(event) => navigate("/register")}
                        >
                            Sign up here
                        </button>
                    </div>
                </>
                );
              } else if (err.code === 'auth/wrong-password') {
                setErrorMsg('Invalid password. Please try again.');
                setRedBorder({email: false, password: true});                
              } else {
                setErrorMsg('Failed to login. Please try again.');
                setRedBorder({email: false, password: false});
            }
            console.error(err);
        }
    }

    useEffect(() => {
        handleRedirectSignIn();
      }, []);

    const googleSignIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.useDeviceLanguage();
        signInWithRedirect(auth, provider);

    }

    const validateEmail = () => {
        return email !== '' && !loginError;
    }

    const validatePassword = () => {
        return password !== '' && !loginError;
    }

    const validateLogin = () => {
        if (email === '' && password === '') {
            setErrorMsg('Please enter an email and password');
        }
        else if (email === '') {
            setErrorMsg('Please enter an email');
        }
        else if (password === '') {
            setErrorMsg('Please enter a password')
        } else {
            setErrorMsg('');
        }
        return email !== '' && password !== '';
    }

    if (!user && !loading) return (
        <div className='bg-white px-10 py-20 rounded-3xl border-2 border-gray-200 relative mt-4'>
            <h1 className='text-5xl font-semibold'>BreezeChess</h1>
            <p className='font-medium text-lg text-gray-500 mt-4'>Welcome back!</p>
            <div className='mt-4'>
                <div>
                    <label className='text-lg font-medium'>Login</label>
                    <input
                        className={`w-full border-2 rounded-xl p-4 mt-1 bg-transparent ${(redBorder.email && !validateEmail()) ? 'border-red-400' :  'border-gray-100' }`}
                        placeholder='Email, Phone, or Email'
                        onInput={(event) => {setRedBorder({email: false, password: redBorder.password}); setEmail(event.target.value);}}
                    />
                </div>
                <div>
                <label className='text-lg font-medium'>Password</label>
                <input
                        className={`w-full border-2 rounded-xl p-4 mt-1 bg-transparent ${(redBorder.password && !validatePassword()) ? 'border-red-400' :  'border-gray-100' }`}
                        placeholder='Password'
                        type='password'
                        onInput={(event) => {setRedBorder({email: redBorder.email, password: false}); setPassword(event.target.value)}}
                    />
                </div>
                <div className='mt-8 flex justify-between items-center'>
                    <div>
                        <input
                            type='checkbox'
                            id='remember'
                            onClick={(event) => setRemember(!remember)}
                        />
                        <label className='ml-2 font-medium text-base' htmlFor='remember'>Remember me</label>
                    </div>
                    <button className='font-medium text-base text-sky-500 hover:text-sky-400'>Forgot password</button>
                </div>
                <p className='mt-4 text-red-400'>{errorMsg}</p>
                <div className='mt-8 flex flex-col gap-y-4'>
                    <button
                        className='active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-sky-500 text-white text-lg font-bold'
                        onClick={(event) => {setRedBorder({email: !validateEmail(), password: !validatePassword()}); if (validateLogin()) { signInUser(email, password); }}}
                    >
                        Sign In
                    </button>
                    <button
                        className='flex py-3 rounded-xl border-2 border-gray-100 items-center justify-center gap-2 active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all'
                        onClick={(event) => {googleSignIn();}}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335"/>
                            <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853"/>
                            <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2"/>
                            <path d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z" fill="#FBBC05"/>
                        </svg>
                        Sign in with Google
                    </button>
                </div>
                <div className='mt-8 flex justify-center items-center'>
                    <p className='font-medium text-base'>Don't have an account?</p>
                    <button
                        className='text-sky-500 text-base font-medium ml-2 hover:text-sky-400'
                        onClick={(event) => navigate("/register")}
                        >
                            Sign Up
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;
