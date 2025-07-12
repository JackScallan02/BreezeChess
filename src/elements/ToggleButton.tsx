interface ToggleButtonProps {
    defaultChecked?: boolean; // Whether or not it is checked by default
    checked?: boolean;
    onChange?: () => void; // Optional function for when the toggle button is changed
    label?: string; // Optional label placed to the right of the toggle button
    bottomLabel?: string; // Optional label placed underneath the toggle button
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ defaultChecked, onChange, label, bottomLabel }) => {
    return (
        <div className="flex flex-col gap-y-1">
            {label ? (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        defaultChecked={defaultChecked ?? false}
                        onChange={onChange}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-md font-medium text-gray-900 dark:text-gray-300">{label}</span>
                </label>
            ) : (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        defaultChecked={defaultChecked ?? false}
                        onChange={onChange}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
            )}
            {bottomLabel && (<span className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-400">{bottomLabel}</span>)}
        </div>
    )
};

export default ToggleButton;