"use client";
import {useReveal} from "@/hooks/useReveal";
import {ElementType} from "react";

type Direction = "fromLeft" | "fromRight" | "fromUp" | "fromDown";

interface RevealProps {
    direction?: Direction;
    delay?: number;
    duration?: number;
    distance?: number;
    threshold?: number;
    once?: boolean;
    fade?: boolean;
    as?: ElementType;
    className?: string;
    children: React.ReactNode;
}

export function Reveal({
                           direction = "fromDown",
                           delay = 0,
                           duration = 600,
                           distance = 40,
                           threshold = 0.15,
                           once = true,
                           fade = false,
                           as: Tag = "div",
                           className,
                           children,
                       }: RevealProps) {
    const {ref, style} = useReveal({direction, delay, duration, distance, threshold, once, fade});

    return (
        <Tag ref={ref} style={style} className={className}>
            {children}
        </Tag>
    );
}