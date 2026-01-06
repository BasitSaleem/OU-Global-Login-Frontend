export function organizationName(name: string): string {
    if (!name) return '';
    const words = name.trim().split(/\s+/);
    const first = words[0]?.charAt(0).toUpperCase() ?? '';
    const second =
        words.length > 1
            ? words[1]?.charAt(0).toUpperCase()
            : words[0]?.charAt(1)?.toUpperCase() ?? '';

    return first + second;
}