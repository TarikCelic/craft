"use client";
import {useEffect, useRef, useState} from "react";

type Direction = "fromLeft" | "fromRight" | "fromUp" | "fromDown";

interface UseRevealOptions {
    direction?: Direction;
    delay?: number;
    duration?: number;
    distance?: number;
    threshold?: number;
    once?: boolean;
    fade?: boolean;
}

export function useReveal({
                              direction = "fromDown",
                              delay = 0,
                              duration = 600,
                              distance = 40,
                              threshold = 0.15,
                              once = true,
                              fade = false,
                          }: UseRevealOptions = {}) {
    const ref = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setVisible(false);
                    setDone(false);
                }
            },
            {threshold}
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, once]);

    useEffect(() => {
        const el = ref.current;
        if (!el || !visible) return;
        const onEnd = () => setDone(true);
        el.addEventListener("transitionend", onEnd, {once: true});
        return () => el.removeEventListener("transitionend", onEnd);
    }, [visible]);

    const translate: Record<Direction, string> = {
        fromLeft: `translateX(-${distance}px)`,
        fromRight: `translateX(${distance}px)`,
        fromUp: `translateY(-${distance}px)`,
        fromDown: `translateY(${distance}px)`,
    };

    const style: React.CSSProperties = fade
        ? {
            opacity: visible ? 1 : 0,
            transition: `opacity ${duration}ms ease ${delay}ms`,
            willChange: done ? "auto" : "opacity",
        }
        : {
            opacity: visible ? 1 : 0,
            transform: visible ? "translate(0)" : translate[direction],
            transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
            willChange: done ? "auto" : "opacity, transform",
        };

    return {ref, style, visible};
}