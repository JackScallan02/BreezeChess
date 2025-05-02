import React from 'react';
import MainToolBar from '../components/MainToolBar';
import LoadingScreen from './Loading';
import { useAuth } from "../contexts/AuthContext";

const Contact = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;
  
  if (!loading) return (
    <div className="flex flex-col min-h-screen">
      <MainToolBar />
      <main className="w-screen">
        <div className="w-[60%] min-w-[400px] bg-white mx-auto rounded-lg flex flex-col justify-center items-center mt-16 pb-16 p-8 shadow-md border">
            <p className="text-[3rem] font-bold">Contact Us</p>
            <p className="text-lg font-medium mt-8 text-center">
                If you have any questions, feedback, or need assistance, feel free to reach out to us!
            </p>
            <div className='flex flex-col mt-8 lg:flex-row w-full justify-evenly items-center'>
                <input
                    className={`w-[80%] lg:w-[40%] border-2 rounded-xl p-4 bg-transparent`}
                    placeholder='Enter your email'
                    type='email'
                />
                <input
                    className={`lg:mt-0 mt-4 w-[80%] lg:w-[40%] border-2 rounded-xl p-4 bg-transparent`}
                    placeholder='Enter your name'
                    type='text'
                />
            </div>
            <textarea
                    className={`mt-4 w-[80%] lg:w-[86.667%] border-2 rounded-xl p-4 bg-transparent`}
                    rows={7}
                    placeholder='Enter your message'
                />
            <button
                className={`w-[80%] lg:w-[86.667%] active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:cursor-pointer ease-in-out transition-all
                  py-4 rounded-xl text-white text-lg font-bold bg-sky-500 mt-8`}
              >
                Submit
            </button>
        </div>
      </main>
    </div>
  );
};

export default Contact;
