type Props = {
    children: string;
    className?: string;
};

export default function SectionTitle({ children, className = 'mb-8' }: Props) {
    return <h2 className={`text-3xl font-bold ${className}`}>{children}</h2>;
}
