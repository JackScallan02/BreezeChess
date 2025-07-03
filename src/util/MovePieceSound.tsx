import useSound from 'use-sound';
import { Chess, Move } from 'chess.js';
// @ts-ignore
import move from '/assets/sounds/move.mp3';
// @ts-ignore
import check from '/assets/sounds/check.mp3';
// @ts-ignore
import capture from '/assets/sounds/capture.mp3';

const useMovePieceSound = () => {
    const [playMove] = useSound(move, { volume: 0.5 });
    const [playCheck] = useSound(check, { volume: 0.5 });
    const [playCapture] = useSound(capture, { volume: 0.5 });

    /**
     * Plays a sound based on the result of a move.
     * @param {Move} move - The move object returned by chess.js.
     * @param {Chess} game - The game state *after* the move has been made.
     */
    const handlePlaySound = (move: Move, game: Chess) => {
        // The `game` object is already in the final state after the move.
        // We can check its status directly for check or checkmate.
        if (game.isCheck() || game.isCheckmate()) {
            playCheck();
            return;
        }

        if (move.captured || move.promotion) {
            playCapture();
            return;
        }

        // If none of the above, it's a simple move.
        playMove();
    };

    return {
        handlePlaySound
    };
};

export default useMovePieceSound;