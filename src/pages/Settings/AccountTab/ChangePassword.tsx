import { useState, useEffect } from 'react';
import TextField from "../../../elements/TextField";
import Button from '../../../elements/Button';
import { updateUser } from "../../../api/users";
import { useAuth } from '../../../contexts/AuthContext';


const ChangePassword = () => {
    const [typedPassword, setTypedPassword] = useState({ p1: "", p2: "" });
    const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
    const [statusText, setStatusText] = useState("");

    const { user } = useAuth();

    const validatePassword = (password: string) => {
        const regex = /^(?=(.*\d.*){2})(?=(.*[!@#$%^&*(),.?":{}|<>].*)).+$/; //Checks if at least 2 numbers and at least 1 special character
        if (password === '') {
            return false;
        } else if (password.length > 30) {
            return false;
        } else if (password.length < 8) {
            return false;
        } else if (!regex.test(password)) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (typedPassword.p1 === typedPassword.p2 && validatePassword(typedPassword.p1) && validatePassword(typedPassword.p2)) {
            setSaveButtonEnabled(true);
        } else {
            setSaveButtonEnabled(false);
        }
    }, [typedPassword]);

    const handleUpdatePassword = async () => {
        setSaveButtonEnabled(false);
        if (user) {
            await updateUser(user.id, { password: typedPassword.p1 });
            setTypedPassword({ p1: "", p2: "" })
            //TODO: Check if used old password already
            setStatusText("Password saved!");
            setTimeout(() => {
                setStatusText("");
            }, 3000)
        }
    };

    return (
        <div>
            <p className="text-sm mt-2 text-gray-200">Password must be between 8-30 characters long, and contain at least 2 numbers and 1 special character</p>
            <div className="max-w-[300px] flex flex-col gap-y-2 mt-4">
                <TextField value={typedPassword.p1} topLabel="New password" eyeToggle={true} onChange={(e) => setTypedPassword({ ...typedPassword, p1: e.target.value })} />
                <TextField value={typedPassword.p2} topLabel="Retype password" eyeToggle={true} onChange={(e) => setTypedPassword({ ...typedPassword, p2: e.target.value })} />
                <div className="mt-4">
                    <Button text="Save" onClick={() => handleUpdatePassword()} style="w-[200px]" disabled={!saveButtonEnabled} />
                    <div>
                        <p className="dark:text-lime-300 text-sm">{statusText}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ChangePassword;