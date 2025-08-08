import ToggleButton from "../../elements/ToggleButton";
import SectionHeader from "./Elements/SectionHeader";
import { useUserData } from "../../contexts/UserDataContext";
import useDarkMode from "../../darkmode/useDarkMode";
import { updateUserInfo } from "../../api/users";
import { useAuth } from "../../contexts/AuthContext";

const DisplayTab = () => {
    const { setTheme } = useUserData();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { user } = useAuth();

    const updateTheme = async (newTheme: string) => {
        try {
            if (user) {
                await updateUserInfo(user.id, { theme: newTheme });
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mt-4">
            <div className="mb-6">
                <SectionHeader text="Interface" />
            </div>
            <div className="flex flex-col gap-y-8">
                <div>
                    <ToggleButton label="Dark mode" defaultChecked={isDarkMode} onChange={() => {
                        setTheme(isDarkMode ? 'dark' : 'light');
                        updateTheme(isDarkMode ? 'dark' : 'light');
                        toggleDarkMode();
                        window.location.reload();
                    }} />
                </div>
            </div>
        </div>
    );
};

export default DisplayTab;