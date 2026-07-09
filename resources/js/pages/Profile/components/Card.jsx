export default function Card({
    children,
    className = "",
    style = {},
    background = true,
}) {
    return (
        <div
            className={`
                ${background ? "bg-white" : ""}
                border
                dark:border-[#2C2C2C]
                rounded-2xl
                ${className}
            `}
            style={style}
        >
            {children}
        </div>
    );
}