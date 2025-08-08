import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { deleteUser } from '../../../api/users';
import { useNavigation } from '../../../navigator/navigate';

const DeleteAccount = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    const { user, handleLogout } = useAuth();
    const { handleNavigation } = useNavigation();

    useEffect(() => {
        // Function to handle keydown events
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowDialog(false);
                if (deleted && !deleteError) {
                    handleLeavePage();
                }
            }
        };

        // Add event listener only when the dialog is shown
        if (showDialog) {
            window.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showDialog]); // Dependency array ensures this effect runs when showDialog changes

    const handleDelete = async () => {
        try {
            if (user) {
                setDeleted(true);
                await deleteUser(user.id);
            }
        } catch (error) {
            console.error(error);
            setDeleteError(true);
        }
    };

    const handleLeavePage = () => {
        handleLogout();
        handleNavigation('/');
    };

    return (
        <div>
            <button
                type="button"
                className={`text-red-400 cursor-pointer w-[200px]
            dark:bg-slate-700 bg-gray-300 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg
            text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-600 dark:hover:bg-slate-700 focus:outline-none
            dark:focus:ring-blue-800`}
                onClick={() => setShowDialog(true)}
            >
                Delete account
            </button>
            {showDialog && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/50 z-40"></div>

                    {/* Modal */}
                    <div
                        id="default-modal"
                        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full"
                    >
                        <div className="relative p-4 w-full max-w-2xl">
                            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Delete Account
                                    </h3>
                                    <button
                                        type="button"
                                        className="cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200
                                        hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex
                                        justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        onClick={() => {
                                            setShowDialog(false); if (deleted && !deleteError) {
                                                handleLeavePage();
                                            }
                                        }} // Set state to close
                                    >
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                {/* Modal Body */}
                                <div className="p-4 md:p-5 space-y-4">
                                    {!deleted ? (
                                        <div className="flex flex-col gap-y-2">
                                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                                We're sorry to see you go! Are you sure you want to delete your account? This action is irreversible and all your data will be permanently lost.
                                            </p>
                                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                                If there is anything we can assist you with, please contact breezechess99@gmail.com!
                                            </p>
                                        </div>
                                    ) : (
                                        !deleteError ? (
                                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                                Account has been successfully deleted.
                                            </p>
                                        ) : (
                                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                                There was a problem when deleting your account. Please contact breezechess99@gmail.com for assistance. We apologize for any inconvenience!
                                            </p>
                                        )

                                    )}

                                </div>
                                {/* Modal Footer */}
                                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                    {!deleted ? (
                                        <>
                                            <button
                                                type="button"
                                                className="cursor-pointer text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                                                onClick={() => handleDelete()}
                                            >
                                                I'm sure, delete
                                            </button>
                                            <button
                                                type="button"
                                                className="cursor-pointer py-2.5 px-5 ms-3 text-sm font-medium
                                        text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200
                                        hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2
                                        focus:ring-gray-100 dark:focus:ring-blue-700 dark:bg-gray-700
                                        dark:text-gray-300 dark:border-gray-600 dark:hover:text-white
                                        dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setShowDialog(false); if (deleted && !deleteError) {
                                                        handleLeavePage();
                                                    }
                                                }} // Set state to close
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        !deleteError ? (
                                            <button
                                                type="button"
                                                className="cursor-pointer py-2.5 px-5 ms-3 text-sm font-medium
                                        text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200
                                        hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2
                                        focus:ring-gray-100 dark:focus:ring-blue-700 dark:bg-gray-700
                                        dark:text-gray-300 dark:border-gray-600 dark:hover:text-white
                                        dark:hover:bg-gray-700"
                                                onClick={() => handleLeavePage()}
                                            >
                                                Back to home
                                            </button>
                                        ) : (
                                            <></>
                                        )

                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
};

export default DeleteAccount;