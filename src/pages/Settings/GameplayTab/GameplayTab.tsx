import { getUserInfo } from "../../../api/users";
import { useAuth } from "../../../contexts/AuthContext";
import { UserInfo } from "../../../types/userinfo";
import { useState, useEffect } from 'react';
import { updateUserInfo } from "../../../api/users";
import PremoveSetting from "./PreMoveSetting";
import ToggleButton from "../../../elements/ToggleButton";
import SectionHeader from "../Elements/SectionHeader";

interface UserDataContextType {
    alwaysPromoteQueen: boolean;
    showLegalMoves: boolean;
    setAlwaysPromoteQueen: (updater: (prev: boolean) => boolean) => void;
    setShowLegalMoves: (updater: (prev: boolean) => boolean) => void;
    dataFetched: boolean;
}

interface GameplayProps {
    userDataContext: UserDataContextType;
}
const GameplayTab: React.FC<GameplayProps> = ({ userDataContext }) => {

    const { user } = useAuth();

    const handleUpdateUserInfo = async (data: object) => {
        try {
            if (user) {
                await updateUserInfo(user.id, data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (!userDataContext.dataFetched) return;

    return (
        <div className="mt-4">
            <div className="mb-6">
                <SectionHeader text="Chess Board & Gameplay" />
            </div>
            <div className="flex flex-col gap-y-8">
                <div>
                    <PremoveSetting userDataContext={userDataContext} />
                </div>
                <div>
                    <ToggleButton
                        label="Always promote to queen"
                        bottomLabel="If this setting is enabled, hold the ALT key when promoting to choose a different piece"
                        onChange={() => {
                            handleUpdateUserInfo({ alwaysPromoteQueen: !userDataContext.alwaysPromoteQueen })
                            userDataContext.setAlwaysPromoteQueen((prev: boolean) => !prev);
                        }}
                        defaultChecked={userDataContext.alwaysPromoteQueen}
                    />
                </div>
                <div>
                    <ToggleButton
                        label="Show legal moves for selected piece"
                        bottomLabel="If a piece is selected, legal moves will be denoted on the board"
                        onChange={() => {
                            handleUpdateUserInfo({ showLegalMoves: !userDataContext.showLegalMoves });
                            userDataContext.setShowLegalMoves((prev: boolean) => !prev);
                        }}
                        defaultChecked={userDataContext.showLegalMoves}
                    />
                </div>
            </div>
            <div className="mt-12">
                <div className="mb-6">
                    <SectionHeader text="Game Analysis (Board Builder)" />
                </div>
                <div className="flex flex-col gap-y-8">
                    <div>
                        <ToggleButton defaultChecked label="Evaluation bar" bottomLabel="Show evaluation bar next to the chess board" />
                    </div>
                    <div>
                        <ToggleButton defaultChecked label="Engine evaluation" bottomLabel="Show game evaluation next to the chess board" />
                    </div>
                    <div>
                        <ToggleButton defaultChecked label="Move type labels" bottomLabel="Show labels indicating blunders, crushing moves, etc." />
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <div className="mb-6">
                    <SectionHeader text="Puzzles" />
                </div>
                <div className="flex flex-col gap-y-8">
                    <div>
                        <ToggleButton defaultChecked label="Show timer" bottomLabel="Show a timer as you solve puzzles" />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default GameplayTab;
