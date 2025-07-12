import ToggleButton from "../../../elements/ToggleButton";
import { updateUserInfo } from "../../../api/users";
import { useAuth } from "../../../contexts/AuthContext";
import { UserInfo } from "../../../types/userinfo";
import TextField from "../../../elements/TextField";
import { Save } from 'lucide-react';
import { useState, useEffect, useRef, Dispatch, SetStateAction, useLayoutEffect } from 'react';


interface UserDataContextType {
    preMoveKey?: string | undefined;
    setPreMoveKey: (value: string | undefined) => void;
}

interface PremoveProps {
    userDataContext: UserDataContextType;
}
const PremoveSetting: React.FC<PremoveProps> = ({ userDataContext }) => {

    const [premoveToggled, setPremoveToggled] = useState(true);
    const [premoveVal, setPreMoveVal] = useState<string | undefined>(undefined);
    const [premoveBottomLabelText, setPreMoveBottomLabelText] = useState("Key bind");
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    const inputRef = useRef<HTMLInputElement>(null);

    const { user } = useAuth();

    useLayoutEffect(() => {
        if (userDataContext) {
            setPreMoveVal(userDataContext.preMoveKey);
            if (userDataContext.preMoveKey === undefined) {
                setPremoveToggled(false);
            } else {
                setPremoveToggled(true);
            }
        }
    }, [userDataContext]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const keys = [];
        if (e.ctrlKey) keys.push('Ctrl');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
            keys.push(e.key);
        }

        const combo = keys.join('+') || e.key;
        setPreMoveVal(combo);
    };

    const handleSavePremove = async () => {
        if (!user || isSaving || !userDataContext) return;
        if (premoveVal?.toLowerCase() === (userDataContext.preMoveKey?.toLowerCase() || '')) return;

        setIsSaving(true);
        setSaveStatus("idle");

        try {
            await updateUserInfo(user.id, { premove: premoveVal || null });
            setSaveStatus("success");
            setPreMoveBottomLabelText("Premove key bind saved!");
            userDataContext.setPreMoveKey(premoveVal);
        } catch (err) {
            console.error("Failed to update premove:", err);
            setSaveStatus("error");
            setPreMoveBottomLabelText("Failed to save key bind.");
        } finally {
            setTimeout(() => {
                setSaveStatus("idle");
                setPreMoveBottomLabelText("Key bind");
                setIsSaving(false);
            }, 1000);
        }
    };

    const handlePreMoveToggled = async () => {
        const isCurrentlyEnabled = userDataContext.preMoveKey !== undefined;

        if (isCurrentlyEnabled) {
            const newVal = undefined;

            setPremoveToggled(false);
            setPreMoveVal(newVal);
            userDataContext.setPreMoveKey(newVal);

            setIsSaving(true);
            setSaveStatus("idle");

            try {
                if (user) {
                    await updateUserInfo(user?.id, { premove: null });
                    setSaveStatus("success");
                } else {
                    throw new Error("User is not defined");
                }

            } catch (err) {
                console.error("Failed to update premove:", err);
                setSaveStatus("error");
                setPreMoveBottomLabelText("Failed to disable premove.");
            } finally {
                setTimeout(() => {
                    setSaveStatus("idle");
                    setPreMoveBottomLabelText("Key bind");
                    setIsSaving(false);
                }, 1000);
            }
        } else {
            setPremoveToggled(true);
        }
    };


    return (
        <>
            <div className="mb-2">
                <ToggleButton
                    defaultChecked={userDataContext.preMoveKey !== undefined}
                    label="Enable premoves"
                    bottomLabel="Make moves during the opponent's turn which will automatically execute once it becomes your turn"
                    onChange={() => handlePreMoveToggled()}
                />
            </div>

            {premoveToggled && (
                <div className="flex flex-row gap-x-4 items-start">
                    <TextField
                        placeholder="Press a key"
                        value={premoveVal || ""}
                        onKeyDown={handleKeyDown}
                        onChange={() => { }}
                        inputRef={inputRef}
                        onClick={() => inputRef.current?.focus()}
                        bottomLabel={
                            <span
                                className={`text-xs ms-1 transition-opacity duration-300 ${saveStatus === "success"
                                    ? "text-green-500 opacity-100"
                                    : saveStatus === "error"
                                        ? "text-red-500 opacity-100"
                                        : "text-gray-200 opacity-70"
                                    }`}
                            >
                                {premoveBottomLabelText}
                            </span>
                        }
                    />
                    <Save
                        className={`select-none mt-2 h-6 w-6 transition-colors duration-200 ${isSaving || premoveVal?.toLowerCase() === (userDataContext.preMoveKey?.toLowerCase() || '')
                            ? "text-gray-400 cursor-not-allowed"
                            : "cursor-pointer hover:text-blue-500"
                            }`}
                        onClick={
                            isSaving ||
                                ((premoveVal?.toLowerCase() === (userDataContext.preMoveKey?.toLowerCase() || '')) || premoveVal === undefined)
                                ? undefined
                                : handleSavePremove
                        }
                    />
                </div>
            )}
        </>
    )
};

export default PremoveSetting;