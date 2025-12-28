import { globalStyle, style } from '@vanilla-extract/css'
import { vars } from './theme.css'

// Reset and base styles
globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
})

globalStyle('html, body, #root', {
  height: '100%',
  width: '100%',
})

globalStyle('body', {
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.base,
  lineHeight: 1.6,
  color: vars.color.text,
  backgroundColor: vars.color.bg,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
})

globalStyle('h1, h2, h3, h4, h5, h6', {
  fontFamily: vars.font.display,
  fontWeight: 500,
  lineHeight: 1.2,
})

globalStyle('code, pre', {
  fontFamily: vars.font.mono,
})

globalStyle('a', {
  color: vars.color.accent,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
})

globalStyle('a:hover', {
  color: vars.color.success,
})

globalStyle('::selection', {
  backgroundColor: vars.color.accentDim,
  color: vars.color.accent,
})

// Grid background
export const gridBg = style({
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  backgroundImage: `
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
  `,
  backgroundSize: '40px 40px',
  maskImage: 'radial-gradient(ellipse 80% 80% at 50% 20%, black 40%, transparent 100%)',
  '::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.06) 0%, transparent 50%)',
  },
})

// App container
export const appContainer = style({
  position: 'relative',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
})
