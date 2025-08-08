
interface SectionHeaderProps {
    text: string;
}
const SectionHeader: React.FC<SectionHeaderProps> = ({ text }) => {
    return (
        <p className="text-xl font-semibold text-black dark:text-white">{text}</p>
    );
};

export default SectionHeader;