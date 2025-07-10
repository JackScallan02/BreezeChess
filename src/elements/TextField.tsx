interface TextFieldProps {
    placeholder?: string; // Optional placeholder inside of the text field when empty
    styling?: string; // Optional additional classes that we might want to apply to the text field i.e., width
    topLabel?: string; // Optional label that goes on top of the text field
    bottomLabel?: React.ReactNode; // Optional label that goes on the bottom of the text field
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Optional function for when the text field changes
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    value: string; // String inside the text field
    readOnly?: boolean;
    inputRef?: React.RefObject<HTMLInputElement> | null;
    onClick?: () => void;
}

const TextField: React.FC<TextFieldProps> = ({
    placeholder = "",
    styling = "",
    topLabel,
    bottomLabel,
    onChange,
    onKeyDown,
    value,
    readOnly = false,
    inputRef,
    onClick,
}) => {
    return (
        <div className={styling}>
            {topLabel && (
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {topLabel}
                </label>
            )}
            <input
                ref={inputRef}
                type="text"
                readOnly={readOnly}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={placeholder}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onClick={onClick}
                value={value}
            />
            {bottomLabel}
        </div>
    );
};

export default TextField;