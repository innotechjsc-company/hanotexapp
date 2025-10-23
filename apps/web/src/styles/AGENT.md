# Styles Folder Rules

## Purpose
This folder contains global styles, CSS configurations, theme definitions, and styling utilities.

## Guidelines

### File Organization
- `globals.css`: Global CSS resets, base styles, utility classes
- `variables.css`: CSS custom properties (CSS variables)
- `theme.ts`: Theme configuration (colors, spacing, typography)
- `tailwind.config.js`: Tailwind CSS configuration (if used)

### Global Styles
- Keep global styles minimal
- Define CSS resets and normalizations
- Set up base typography
- Define utility classes sparingly
- Avoid overly specific global selectors

### CSS Variables
```css
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;
}
```

### Theme Configuration
- Define theme in TypeScript for type safety
- Include colors, spacing, typography, breakpoints
- Support light/dark modes if needed
- Export theme for use in styled-components or CSS-in-JS

```typescript
// theme.ts
export const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export type Theme = typeof theme;
```

### Best Practices
- Use CSS custom properties for dynamic theming
- Keep specificity low
- Avoid `!important` unless absolutely necessary
- Follow BEM or similar naming convention for utility classes
- Use PostCSS for vendor prefixing
- Minimize global CSS - prefer component-level styles
- Use CSS modules or CSS-in-JS for component styles
- Support RTL (right-to-left) if needed

### Responsive Design
- Mobile-first approach
- Use consistent breakpoints
- Define breakpoint utilities
- Test on multiple devices

### Dark Mode Support
```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
}

[data-theme='dark'] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}
```

### Performance
- Minimize CSS bundle size
- Remove unused styles (PurgeCSS, Tailwind purge)
- Use critical CSS for above-the-fold content
- Lazy load non-critical styles

### Integration with Components
- Components can import global styles
- Prefer CSS Modules or CSS-in-JS for component styles
- Use className prop for customization
- Provide style override mechanisms

### Typography
- Define consistent font scales
- Set up font loading strategy
- Use system fonts for performance
- Define heading styles (h1-h6)
- Set up text utility classes
