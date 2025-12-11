import { useEffect } from 'react';

export function useClickOutside(
    refs: React.RefObject<HTMLDivElement>[],
    handler: () => void
) {
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            const isOutside = refs.every(
                ref => ref.current && !ref.current.contains(event.target as Node)
            );
            if (isOutside) handler();
        }

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [refs, handler]);
}
