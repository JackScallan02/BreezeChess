import { getUserInfo } from "../../../api/users";
import { useAuth } from "../../../contexts/AuthContext";
import { UserInfo } from "../../../types/userinfo";
import { useState, useEffect } from 'react';
import { updateUserInfo } from "../../../api/users";
import PremoveSetting from "./PreMoveSetting";
import ToggleButton from "../../../elements/ToggleButton";
import SectionHeader from "../Elements/SectionHeader";
import { useUserData } from "../../../contexts/UserDataContext";

const GameplayTab = () => {

    const { user } = useAuth();

    const {
        setUserDataField,
        showLegalMoves,
        alwaysPromoteQueen,
        showBoardBuilderEngineEval,
        showBoardBuilderEvalBar,
        showMoveTypeLabels,
        showPuzzleTimer,
        dataFetched,
    } = useUserData();

    const handleUpdateUserInfo = async (data: object) => {
        try {
            if (user) {
                await updateUserInfo(user.id, data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (!dataFetched) return;

    return (
        <div className="mt-4">
            <div className="mb-6">
                <SectionHeader text="Chess Board & Gameplay" />
            </div>
            <div className="flex flex-col gap-y-8">
                <div>
                    <PremoveSetting />
                </div>
                <div>
                    <ToggleButton
                        label="Always promote to queen"
                        bottomLabel="If this setting is enabled, hold the ALT key when promoting to choose a different piece"
                        onChange={() => {
                            handleUpdateUserInfo({ alwaysPromoteQueen })
                            setUserDataField('alwaysPromoteQueen', !alwaysPromoteQueen);
                        }}
                        defaultChecked={alwaysPromoteQueen}
                    />
                </div>
                <div>
                    <ToggleButton
                        label="Show legal moves for selected piece"
                        bottomLabel="If a piece is selected, legal moves will be denoted on the board"
                        onChange={() => {
                            handleUpdateUserInfo({ showLegalMoves: !showLegalMoves });
                            setUserDataField('showLegalMoves', !showLegalMoves);
                        }}
                        defaultChecked={showLegalMoves}
                    />
                </div>
            </div>
            <div className="mt-12">
                <div className="mb-6">
                    <SectionHeader text="Game Analysis (Board Builder)" />
                </div>
                <div className="flex flex-col gap-y-8">
                    <div>
                        <ToggleButton
                            label="Evaluation bar"
                            bottomLabel="Show evaluation bar next to the chess board"
                            onChange={() => {
                                handleUpdateUserInfo({ showBoardBuilderEvalBar: !showBoardBuilderEvalBar });
                                setUserDataField('showBoardBuilderEvalBar', !showBoardBuilderEvalBar);
                            }}
                            defaultChecked={showBoardBuilderEvalBar}
                        />
                    </div>
                    <div>
                        <ToggleButton
                            label="Engine evaluation"
                            bottomLabel="Show game evaluation next to the chess board"
                            onChange={() => {
                                handleUpdateUserInfo({ showBoardBuilderEngineEval: !showBoardBuilderEngineEval });
                                setUserDataField('showBoardBuilderEngineEval', !showBoardBuilderEngineEval);
                            }}
                            defaultChecked={showBoardBuilderEngineEval}
                        />
                    </div>
                    <div>
                        <ToggleButton
                            label="Move type labels"
                            bottomLabel="Show labels indicating blunders, crushing moves, etc."
                            onChange={() => {
                                handleUpdateUserInfo({ showMoveTypeLabels: !showMoveTypeLabels });
                                setUserDataField('showMoveTypeLabels', !showMoveTypeLabels);
                            }}
                            defaultChecked={showMoveTypeLabels}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <div className="mb-6">
                    <SectionHeader text="Puzzles" />
                </div>
                <div className="flex flex-col gap-y-8">
                    <div>
                        <ToggleButton
                            label="Show timer"
                            bottomLabel="Show a timer as you solve puzzles"
                            onChange={() => {
                                handleUpdateUserInfo({ showPuzzleTimer: !showPuzzleTimer });
                                setUserDataField('showPuzzleTimer', !showPuzzleTimer);
                            }}
                            defaultChecked={showPuzzleTimer}
                        />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default GameplayTab;
