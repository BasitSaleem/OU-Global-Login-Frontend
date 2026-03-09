import { useEffect } from "react";

let lockCount = 0;

export function useScrollLock(locked: boolean) {
    useEffect(() => {
        if (!locked) return;

        lockCount += 1;

        const originalOverflow = document.body.style.overflow;

        if (lockCount === 1) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            lockCount -= 1;

            if (lockCount === 0) {
                document.body.style.overflow = originalOverflow;
            }
        };
    }, [locked]);
}
