import Link from "next/link";
import {ShoppingCart, Heart, User, Bell, Search} from "lucide-react";
import {useCartStore} from "@/globalStates/shop";
import {useMessagesStore} from "@/globalStates/notifications";
import BUser from "./BetterUser";

type Props = {
    isDark: boolean;
    isOpened: boolean;
    hideSearchIcon?: boolean;
    onSearchClick?: () => void;
    onClick?: () => void;
};

export default function NavIcons({
                                     isDark,
                                     hideSearchIcon,
                                     onSearchClick,
                                     onClick,
                                     isOpened,
                                 }: Props) {
    const count = useCartStore((s) => s.count);
    const countMsgs = useMessagesStore((s) => s.count);

    const hoverIcon = isDark
        ? "hover:bg-(--mainTransparentLink) hover:text-blue-400"
        : "hover:bg-(--mainTransparentLink) hover:text-blue-600";

    return (
        <ul className="flex gap-1 items-center">
            {!hideSearchIcon && (
                <li>
                    {onSearchClick && (
                        <button
                            aria-label="Search"
                            onClick={onSearchClick}
                            className={`p-2 rounded-md transition-all duration-200 ${hoverIcon} cursor-pointer ${isOpened ? " bg-(--mainTransparentLink) text-blue-600" : ""}`}
                        >
                            <Search size={22}/>
                        </button>
                    )}
                </li>
            )}

            <li>
                <Link
                    href="/account/notifications"
                    aria-label="Notification Centar"
                    onClick={onClick}
                >
                    <div
                        className={`relative p-2 rounded-md transition-all duration-200 ${hoverIcon}`}
                    >
                        <Bell size={22}/>
                        {countMsgs > 0 && (
                            <span
                                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-500 text-white text-[0.65rem] font-bold rounded-full flex items-center justify-center leading-none pointer-events-none">
                {countMsgs > 99 ? "99+" : countMsgs}
              </span>
                        )}
                    </div>
                </Link>
            </li>

            <li>
                <Link href="/cart" aria-label="Cart" onClick={onClick}>
                    <div
                        className={`relative p-2 rounded-md transition-all duration-200 ${hoverIcon}`}
                    >
                        <ShoppingCart size={22}/>
                        {count > 0 && (
                            <span
                                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-500 text-white text-[0.65rem] font-bold rounded-full flex items-center justify-center leading-none pointer-events-none">
                {count > 99 ? "99+" : count}
              </span>
                        )}
                    </div>
                </Link>
            </li>

            <li>
                <Link
                    href="/account/favourites"
                    aria-label="Favourites"
                    onClick={onClick}
                >
                    <div
                        className={`relative p-2 rounded-md transition-all duration-200 ${hoverIcon}`}
                    >
                        <Heart size={22}/>
                    </div>
                </Link>
            </li>
            <BUser/>
        </ul>
    );
}
