import MainToolBar from "../../components/MainToolBar";
import { Settings, Gamepad2, UserRoundCog, Tv, UsersRound, BellRing, KeyRound, PersonStanding, LucideProps, ArrowLeft } from 'lucide-react';
import { FC, useState, useEffect } from "react";
import GameplayTab from "./GameplayTab/GameplayTab";
import DisplayTab from "./DisplayTab";
import SocialTab from "./SocialTab";
import NotificationsTab from "./NotificationsTab";
import AccountTab from "./AccountTab/AccountTab";
import AccessibilityTab from "./AccessibilityTab";
import { useUserData } from "../../contexts/UserDataContext";

// Interface for the tab data
interface SettingsTab {
    [key: string]: {
        url: string;
        icon: FC<LucideProps>;
        displayName: string;
    };
}

const SettingsPage = () => {
    const settingsTabs: SettingsTab = {
        'Gameplay': { url: 'gameplay', icon: Gamepad2, displayName: 'Gameplay Settings' },
        'Profile': { url: 'profile', icon: UserRoundCog, displayName: 'Profile Settings' },
        'Display': { url: 'display', icon: Tv, displayName: 'Display Settings' },
        'Social': { url: 'social', icon: UsersRound, displayName: 'Social Settings' },
        'Notifications': { url: 'notifications', icon: BellRing, displayName: 'Notification Settings' },
        'Account': { url: 'account', icon: KeyRound, displayName: 'Account Settings' },
        'Accessibility': { url: 'accessibility', icon: PersonStanding, displayName: 'Accessibility Settings' }
    };
    
    const userDataContext = useUserData();

    const [activeTab, setActiveTab] = useState<string>('');
    // State to manage visibility on mobile. True = show list, False = show content.
    const [isMobileListVisible, setMobileListVisible] = useState(true);

    useEffect(() => {
        const handleUrlChange = () => {
            const url = new URL(window.location.href);
            const page = url.searchParams.get('page');
            const isValidTab = Object.values(settingsTabs).some(tab => tab.url === page);

            if (isValidTab && page) {
                setActiveTab(page);
            } else {
                const defaultTabUrl = settingsTabs['Gameplay'].url;
                setActiveTab(defaultTabUrl);
                url.searchParams.set('page', defaultTabUrl);
                window.history.replaceState({ path: url.href }, '', url.href);
            }
        };

        handleUrlChange();
        window.addEventListener('popstate', handleUrlChange);
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, []);

    const handleTabClick = (tabUrl: string) => {
        setActiveTab(tabUrl);
        const url = new URL(window.location.toString());
        url.searchParams.set('page', tabUrl);
        window.history.pushState({ path: url.href }, '', url.href);
        // On mobile, after clicking a tab, hide the list to show the content
        setMobileListVisible(false);
    };

const getTab = (activeTab: string) => {
    switch (activeTab) {
        case 'gameplay':
            return <GameplayTab userDataContext={userDataContext} />;
        case 'display':
            return <DisplayTab />;
        case 'social':
            return <SocialTab />;
        case 'notifications':
            return <NotificationsTab />;
        case 'account':
            return <AccountTab />;
        case 'accessibility':
            return <AccessibilityTab />;
        default:
            return <></>;
    }
};

    if (!activeTab) {
        return null;
    }

    return (
        <div className="w-full min-h-screen dark:bg-gray-900">
            <MainToolBar />
            <div className="flex md:flex-row flex-col">
                {/* --- Sidebar --- */}
                {/* Always shows on medium screens and up. On smaller screens, visibility is controlled by state. */}
                <div className={`dark:bg-slate-800 bg-slate-100 md:w-[15%] md:min-w-60 w-full h-screen md:border-r md:border-slate-700 md:block ${isMobileListVisible ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col h-full w-full">
                        <div className="flex flex-row md:p-8 p-4 gap-x-4 items-center border-b border-slate-700 w-full">
                            <Settings className="md:w-6 md:h-6 w-5 h-5 dark:text-white text-black" />
                            <p className="md:text-xl text-lg font-bold dark:text-white text-black">Settings</p>
                        </div>
                        <div className="flex flex-col w-full py-4">
                            {Object.keys(settingsTabs).map((tabKey) => {
                                const tab = settingsTabs[tabKey];
                                const { icon: Icon } = tab;
                                const isActive = activeTab === tab.url;
                                return (
                                    <div
                                        key={tab.url}
                                        onClick={() => handleTabClick(tab.url)}
                                        className={`w-full h-16 flex flex-row items-center justify-start px-8 gap-x-4 transition-colors duration-150 cursor-pointer ${isActive ? 'dark:bg-slate-600 bg-sky-200 font-semibold' : 'hover:dark:bg-slate-700 hover:bg-sky-100'}`}
                                    >
                                        <Icon className="w-5 h-5 dark:text-white text-black" />
                                        <p className="text-md dark:text-white text-black">{tabKey}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* --- Main Content Area --- */}
                {/* Always shows on medium screens and up. On smaller screens, visibility is controlled by state (inverse of sidebar). */}
                <div className={`md:w-[85%] w-full h-full p-8 md:block ${isMobileListVisible ? 'hidden' : 'block'}`}>
                    <div className="flex items-center gap-x-4">
                        {/* Arrow to return to the list, only visible on mobile (md:hidden) */}
                        <ArrowLeft 
                            className="h-6 w-6 cursor-pointer md:hidden" 
                            onClick={() => setMobileListVisible(true)}
                        />
                        <h1 className="text-3xl font-bold text-black dark:text-white">
                            {Object.values(settingsTabs).find(tab => tab.url === activeTab)?.displayName}
                        </h1>
                    </div>
                    <hr className="my-4 border-slate-700" />
                    {getTab(activeTab)}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;