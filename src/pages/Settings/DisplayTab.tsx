import ToggleButton from "../../elements/ToggleButton";
import SectionHeader from "./Elements/SectionHeader";

const DisplayTab = () => {
    return (
        <div className="mt-4">
            <div className="mb-6">
                <SectionHeader text="Interface" />
            </div>
            <div className="flex flex-col gap-y-8">
                <div>
                    <ToggleButton label="Dark mode" />
                </div>
            </div>
        </div>
    );
};

export default DisplayTab;