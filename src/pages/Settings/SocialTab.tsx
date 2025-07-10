import ToggleButton from "../../elements/ToggleButton";
import SectionHeader from "./Elements/SectionHeader";

const SocialTab = () => {
    return (
        <div className="mt-4">
            <div className="mb-6">
                <SectionHeader text="Communication" />
            </div>
            <div className="flex flex-col gap-y-8">
                <div>
                    <ToggleButton label="Global chat" bottomLabel="Shows/hides global chat" />
                </div>
                <div>
                    <ToggleButton label="Direct messages" bottomLabel="Send and receive direct messages" />
                </div>
            </div>
        </div>
    );
};

export default SocialTab;