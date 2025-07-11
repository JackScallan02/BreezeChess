interface props {
    onClick: () => void;
    text: string;
    style: string;
    disabled?: boolean;
}

const Button: React.FC<props> = ({ text, onClick, style, disabled }) => {
    return (
        <button
            type="button"
            className={`${style} text-white cursor-pointer disabled:cursor-default dark:disabled:text-gray-400 disabled:text-gray-300 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-800`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    )
};

export default Button;