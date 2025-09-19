export const BRAND_COLORS = {
  // Primary Brand Color
  primary: '#795CF5',
  
  // Portal/Brand Colors
  portal: {
    primary: '#795CF5',
    light: '#F5F3FF',
    pink: '#B11E67',
    orange: '#FF7C3B',
    coral: '#F95C5B',
    yellow: '#FFCB00',
    teal: '#137F6A',
    cyan: '#1AD1B9',
  },
  
  // State Colors
  state: {
    info: '#007BFF',
    success: '#28A745',
    warning: '#FF7C3B',
    error: '#D1202D',
  },
  
  // Black & White
  neutral: {
    black: '#000000',
    white: '#FFFFFF',
    heading: '#000000',
  },
  
  // Grey Colors
  grey: {
    icon: '#4B5563',
    stroke: '#E5E7EB',
    text: '#6B7280',
    inputText: '#495057',
  },
} as const;

export const BRAND_TYPOGRAPHY = {
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    inter: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Professional Typography System - Jira-like compact sizes
  headings: {
    h1: {
      fontSize: '16px',
      lineHeight: '20px',
      fontWeight: '600',
      usage: 'Main page titles',
      className: 'text-heading-1',
    },
    h2: {
      fontSize: '14px',
      lineHeight: '18px',
      fontWeight: '600',
      usage: 'Section headers',
      className: 'text-heading-2',
    },
    h3: {
      fontSize: '13px',
      lineHeight: '16px',
      fontWeight: '600',
      usage: 'Subsection headers',
      className: 'text-heading-3',
    },
  },

  body: {
    large: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '400',
      usage: 'Large body text',
      className: 'text-body-large',
    },
    largeBold: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '500',
      usage: 'Large body text (emphasis)',
      className: 'text-body-large-bold',
    },
    medium: {
      fontSize: '13px',
      lineHeight: '18px',
      fontWeight: '400',
      usage: 'Regular body text',
      className: 'text-body-medium',
    },
    mediumBold: {
      fontSize: '13px',
      lineHeight: '18px',
      fontWeight: '500',
      usage: 'Regular body text (emphasis)',
      className: 'text-body-medium-bold',
    },
    small: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '400',
      usage: 'Small text, captions',
      className: 'text-body-small',
    },
    smallBold: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '500',
      usage: 'Small text (emphasis)',
      className: 'text-body-small-bold',
    },
    tiny: {
      fontSize: '11px',
      lineHeight: '14px',
      fontWeight: '400',
      usage: 'Tiny text, metadata',
      className: 'text-body-tiny',
    },
  },
  
  // Professional font size system
  fontSize: {
    xs: '11px',     // Tiny text
    sm: '12px',     // Small text
    base: '13px',   // Regular text (default)
    md: '14px',     // Large body text
    lg: '16px',     // Page titles
    xl: '18px',     // Large titles (rare use)
    '2xl': '20px',  // Modal/dialog titles
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

export const BRAND_SPACING = {
  none: '0',       // 0px
  xs: '0.125rem',  // 2px - Tiny gaps
  sm: '0.25rem',   // 4px - Small gaps
  md: '0.5rem',    // 8px - Regular gaps
  lg: '0.75rem',   // 12px - Medium gaps
  xl: '1rem',      // 16px - Large gaps
  '2xl': '1.25rem', // 20px - Section spacing
  '3xl': '1.5rem',  // 24px - Component spacing
  '4xl': '2rem',    // 32px - Layout spacing
  '5xl': '2.5rem',  // 40px - Page spacing
  '6xl': '3rem',    // 48px - Large sections
} as const;

// Professional spacing tokens
export const SPACING = {
  // Component internal spacing
  component: {
    xs: '2px',   // Icon margins
    sm: '4px',   // Button padding
    md: '8px',   // Card padding
    lg: '12px',  // Panel padding
    xl: '16px',  // Section padding
  },
  // Layout spacing
  layout: {
    xs: '8px',   // Between related items
    sm: '12px',  // Between components
    md: '16px',  // Between sections
    lg: '20px',  // Between major sections
    xl: '24px',  // Page margins
  },
} as const;

export const BRAND_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export const BRAND_SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

// Usage examples and semantic mappings
export const SEMANTIC_COLORS = {
  // Backgrounds
  background: {
    primary: BRAND_COLORS.neutral.white,
    secondary: BRAND_COLORS.portal.light,
    accent: BRAND_COLORS.primary,
  },
  
  // Text colors
  text: {
    primary: BRAND_COLORS.neutral.heading,
    secondary: BRAND_COLORS.grey.text,
    muted: BRAND_COLORS.grey.inputText,
    inverse: BRAND_COLORS.neutral.white,
    accent: BRAND_COLORS.primary,
  },
  
  // Border colors
  border: {
    default: BRAND_COLORS.grey.stroke,
    focus: BRAND_COLORS.primary,
    error: BRAND_COLORS.state.error,
    success: BRAND_COLORS.state.success,
  },
  
  // Interactive elements
  interactive: {
    primary: BRAND_COLORS.primary,
    secondary: BRAND_COLORS.grey.icon,
    accent: BRAND_COLORS.portal.orange,
  },
} as const;

// Typography Utility Functions
export const getTypographyClass = (type: 'heading' | 'body', variant: string) => {
  if (type === 'heading') {
    const headingMap: Record<string, string> = {
      '1': 'text-heading-1',
      '2': 'text-heading-2', 
      '3': 'text-heading-3',
      'h1': 'text-heading-1',
      'h2': 'text-heading-2',
      'h3': 'text-heading-3',
    };
    return headingMap[variant] || 'text-heading-1';
  }
  
  if (type === 'body') {
    const bodyMap: Record<string, string> = {
      'medium-bold': 'text-body-medium-bold',
      'medium': 'text-body-medium',
      'normal-bold': 'text-body-normal-bold',
      'normal': 'text-body-normal',
      'small-bold': 'text-body-small-bold',
      'small': 'text-body-small',
    };
    return bodyMap[variant] || 'text-body-normal';
  }
  
  return 'text-base';
};
