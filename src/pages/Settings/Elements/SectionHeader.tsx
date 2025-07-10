
interface SectionHeaderProps {
    text: string;
}
const SectionHeader: React.FC<SectionHeaderProps> = ({ text }) => {
    return (
        <p className="text-xl font-semibold">{text}</p>
    );
};

export default SectionHeader;