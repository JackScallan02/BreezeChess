interface SelectedItemMenuProps {
    onEquipFn: () => void;
    onDetailsFn: () => void;
    index: number;
    equipped: boolean;
}

const SelectedItemMenu: React.FC<SelectedItemMenuProps> = ({ onEquipFn, onDetailsFn, equipped, index }) => (
    <div className="flex flex-col gap-y-2 w-full mt-2">
        <button
            className={`${equipped ? 'bg-slate-700' : 'bg-indigo-600 cursor-pointer hover:bg-indigo-700'} w-full rounded py-1 text-sm dark:text-white transition`}
            onClick={onEquipFn}
            disabled={equipped}
        >
            {equipped ? 'Equipped' : 'Equip'}
        </button>
        <button
            className="w-full cursor-pointer rounded bg-indigo-600 py-1 text-sm text-white transition hover:bg-indigo-700"
            onClick={onDetailsFn}
        >
            Details
        </button>
    </div>
);

export default SelectedItemMenu;