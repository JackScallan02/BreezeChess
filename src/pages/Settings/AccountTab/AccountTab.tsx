import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import SectionHeader from '../Elements/SectionHeader';

const AccountTab = () => {
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
                <SectionHeader text="Change password" />
                <ChangePassword />
            </div>
            <div className="flex flex-col gap-y-4">
                <SectionHeader text="Account" />
                <DeleteAccount />
            </div>
        </div>

    );
};

export default AccountTab;