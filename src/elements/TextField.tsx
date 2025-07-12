import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TextFieldProps {
    placeholder?: string;
    styling?: string;
    topLabel?: string;
    bottomLabel?: React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    value: string;
    readOnly?: boolean;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    onClick?: () => void;
    eyeToggle?: boolean;
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
    eyeToggle
}) => {
    // State to manage whether the text is visible or not
    const [isTextVisible, setIsTextVisible] = useState(false);

    // Function to toggle text visibility
    const toggleVisibility = () => {
        setIsTextVisible(prevState => !prevState);
    };

    return (
        <div className={styling}>
            {topLabel && (
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {topLabel}
                </label>
            )}
            <div className="relative w-full">
                <input
                    ref={inputRef}
                    // Dynamically set the input type based on visibility state
                    type={eyeToggle ? (isTextVisible ? 'text' : 'password') : 'text'}
                    readOnly={readOnly}
                    // Added padding to the right to make space for the icon
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={placeholder}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onClick={onClick}
                    value={value}
                />
                {/* Conditionally render the eye icon */}
                {eyeToggle && (
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer select-none"
                        onClick={toggleVisibility}
                    >
                        {isTextVisible ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                )}
            </div>
            {bottomLabel}
        </div>
    );
};

export default TextField;