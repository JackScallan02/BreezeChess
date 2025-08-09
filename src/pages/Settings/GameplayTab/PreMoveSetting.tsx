import ToggleButton from "../../../elements/ToggleButton";
import { updateUserInfo } from "../../../api/users";
import { useAuth } from "../../../contexts/AuthContext";
import { UserInfo } from "../../../types/userinfo";
import TextField from "../../../elements/TextField";
import { Save } from 'lucide-react';
import { useState, useEffect, useRef, Dispatch, SetStateAction, useLayoutEffect } from 'react';
import { useUserData } from "../../../contexts/UserDataContext";

const PremoveSetting = () => {

    const [premoveToggled, setPremoveToggled] = useState(true);
    const [curPremoveVal, setCurPremoveVal] = useState<string | undefined>(undefined);
    const [premoveBottomLabelText, setPreMoveBottomLabelText] = useState("Key bind");
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    const inputRef = useRef<HTMLInputElement>(null);

    const { user } = useAuth();
    const { preMoveKey, setUserDataField, dataFetched } = useUserData();

    useLayoutEffect(() => {
        if (dataFetched) {
            setCurPremoveVal(preMoveKey);
            if (preMoveKey === undefined) {
                setPremoveToggled(false);
            } else {
                setPremoveToggled(true);
            }
        }
    }, [dataFetched]);

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
        setCurPremoveVal(combo);
    };

    const handleSavePremove = async () => {
        if (!user || isSaving) return;
        if (curPremoveVal?.toLowerCase() === (preMoveKey?.toLowerCase() || '')) return;

        setIsSaving(true);
        setSaveStatus("idle");

        try {
            await updateUserInfo(user.id, { premove: curPremoveVal || null });
            setSaveStatus("success");
            setPreMoveBottomLabelText("Premove key bind saved!");
            setUserDataField('preMoveKey', curPremoveVal);
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
        const isCurrentlyEnabled = preMoveKey !== undefined;
        setPremoveToggled((prev) => !prev);
        if (isCurrentlyEnabled) {
            const newVal = undefined;

            setCurPremoveVal(newVal);
            setUserDataField('preMoveKey', newVal);

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
        }
    };
    return (
        <>
            <div className="mb-2">
                <ToggleButton
                    defaultChecked={preMoveKey !== undefined}
                    label="Enable premoves"
                    bottomLabel="Make moves during the opponent's turn which will automatically execute once it becomes your turn"
                    onChange={() => handlePreMoveToggled()}
                />
            </div>

            {premoveToggled && (
                <div className="flex flex-row gap-x-4 items-start">
                    <TextField
                        placeholder="Press a key"
                        value={curPremoveVal || ""}
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
                                        : "dark:text-gray-200 text-gray-700 opacity-70"
                                    }`}
                            >
                                {premoveBottomLabelText}
                            </span>
                        }
                    />
                    <Save
                        className={`select-none mt-2 h-6 w-6 transition-colors duration-200 ${isSaving || curPremoveVal?.toLowerCase() === (preMoveKey?.toLowerCase() || '')
                            ? "text-gray-400 cursor-not-allowed"
                            : "cursor-pointer hover:text-blue-500"
                            }`}
                        onClick={
                            isSaving ||
                                ((curPremoveVal?.toLowerCase() === (preMoveKey?.toLowerCase() || '')) || curPremoveVal === undefined)
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