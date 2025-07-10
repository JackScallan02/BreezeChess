import ToggleButton from "../../elements/ToggleButton";
import SectionHeader from "./Elements/SectionHeader";

const NotificationsTab = () => {
    return (
        <div className="mt-4">
            <div className="mb-6">
                <SectionHeader text="Notifications" />
            </div>
            <div className="flex flex-col gap-y-8">
                <div>
                    <ToggleButton label="Enable email notifications" />
                </div>
                <div>
                    <ToggleButton label="Enable mobile notifications" />
                </div>
            </div>
        </div>
    );
};

export default NotificationsTab;