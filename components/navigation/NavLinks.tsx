import Link from "next/link";

const NAV_LINKS = [
    {name: "Shop", href: "/shop"},
    {name: "About Us", href: "/about"},
    {name: "Contact Us", href: "/contact"},
];

type Props = {
    isDark: boolean;
    onClick?: () => void;
};

export default function NavLinks({isDark, onClick}: Props) {
    return (
        <ul className="flex flex-col md:flex-row gap-5 lg:gap-6 items-start md:items-center font-semibold uppercase text-[0.82rem] tracking-wide">
            {NAV_LINKS.map((link) => (
                <li key={link.name}>
                    <Link
                        href={link.href}
                        onClick={onClick}
                        className={`relative py-1 group transition-colors ${
                            isDark ? "hover:text-white" : "hover:text-gray-600"
                        }`}
                    >
                        {link.name}
                        <span
                            className={`absolute left-1/2 bottom-0 w-0 h-[2px] transition-all duration-300 -translate-x-1/2 group-hover:w-full ${
                                isDark ? "bg-blue-500" : "bg-neutral-900"
                            }`}
                        />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
