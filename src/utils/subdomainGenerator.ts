export function generateSubdomainSuggestions(companyName: string): string[] {
    if (!companyName.trim()) return [];
    const name = companyName.trim().toLowerCase();

    const cleanName = name
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const suggestions: string[] = [];

    const simpleSlug = cleanName
        .replace(/\s+/g, '')
        .replace(/-+/g, '-')
        .slice(0, 30);
    if (simpleSlug) suggestions.push(simpleSlug);

    const firstLetters = cleanName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toLowerCase()
        .slice(0, 8);

    if (firstLetters.length > 1) suggestions.push(firstLetters);

    const words = cleanName.split(' ');
    if (words.length > 1) {
        const firstWordPlus = words[0] +
            words.slice(1)
                .map(word => word.charAt(0))
                .join('');
        if (firstWordPlus.length > 2) {
            suggestions.push(firstWordPlus.slice(0, 15));
        }
    }
    const suffixes = ['app', 'team',];
    const baseName = simpleSlug.split('-')[0];

    suffixes.forEach(suffix => {
        if (baseName && baseName !== suffix) {
            suggestions.push(`${baseName}${suffix}`);
        }
    });

    return [...new Set(suggestions.filter(s => s && s.length >= 2))].slice(0, 3);
}