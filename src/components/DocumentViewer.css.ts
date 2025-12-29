import { style, keyframes } from '@vanilla-extract/css'
import { vars } from '../styles/theme.css'

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

const pulseGlow = keyframes({
  '0%, 100%': { boxShadow: `0 0 20px ${vars.color.accentDim}` },
  '50%': { boxShadow: `0 0 30px rgba(0, 212, 255, 0.25)` },
})

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.md} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bgElevated,
  animation: `${fadeIn} 0.4s ease-out`,
})

export const headerLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
})

export const headerCenter = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const backButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.lg,
  color: vars.color.textDim,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    color: vars.color.accent,
    borderColor: vars.color.accent,
  },
})

export const navButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.lg,
  color: vars.color.textDim,
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    color: vars.color.accent,
  },
  ':disabled': {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
})

export const logo = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.xl,
  fontWeight: 600,
  color: vars.color.text,
  letterSpacing: '-0.02em',
})

export const logoAccent = style({
  color: vars.color.accent,
})

export const citation = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  color: vars.color.textDim,
  padding: `${vars.space.xs} ${vars.space.md}`,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
})

export const viewToggle = style({
  display: 'flex',
  gap: vars.space.xs,
  padding: vars.space.xs,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
})

export const viewButton = style({
  padding: `${vars.space.xs} ${vars.space.md}`,
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  color: vars.color.textDim,
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    color: vars.color.text,
    backgroundColor: vars.color.borderHover,
  },
})

export const viewButtonActive = style({
  color: vars.color.bg,
  backgroundColor: vars.color.accent,
  ':hover': {
    color: vars.color.bg,
    backgroundColor: vars.color.accent,
  },
})

export const main = style({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
})

export const panel = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: `${fadeIn} 0.5s ease-out`,
})

export const panelLeft = style({
  borderRight: `1px solid ${vars.color.border}`,
})

export const panelHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  backgroundColor: vars.color.bgElevated,
  borderBottom: `1px solid ${vars.color.border}`,
})

export const panelTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.sm,
  fontWeight: 500,
  color: vars.color.textDim,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
})

export const panelTitleAccent = style({
  color: vars.color.accent,
})

export const panelContent = style({
  flex: 1,
  overflow: 'auto',
  padding: vars.space.xl,
})

// Statute text styles
export const statuteTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize['2xl'],
  fontWeight: 500,
  color: vars.color.text,
  marginBottom: vars.space.lg,
  animation: `${fadeIn} 0.6s ease-out`,
})

export const subsection = style({
  marginBottom: vars.space.lg,
  padding: vars.space.md,
  borderRadius: vars.radius.md,
  backgroundColor: 'transparent',
  border: '1px solid transparent',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  animation: `${fadeIn} 0.5s ease-out backwards`,
})

export const subsectionHighlighted = style({
  backgroundColor: vars.color.accentDim,
  borderColor: vars.color.accent,
  animation: `${pulseGlow} 2s ease-in-out infinite`,
})

export const subsectionId = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.color.accent,
  marginBottom: vars.space.xs,
})

export const subsectionText = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.lg,
  lineHeight: 1.8,
  color: vars.color.text,
})

export const highlightedTerm = style({
  backgroundColor: vars.color.successDim,
  color: vars.color.success,
  padding: '0 4px',
  borderRadius: '2px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
})

// Code panel styles
export const codeBlock = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.7,
  whiteSpace: 'pre',
  color: vars.color.text,
})

export const codeLine = style({
  display: 'block',
  padding: `2px ${vars.space.md}`,
  marginLeft: `-${vars.space.md}`,
  marginRight: `-${vars.space.md}`,
  borderRadius: vars.radius.sm,
  transition: 'all 0.2s ease',
})

export const codeLineHighlighted = style({
  backgroundColor: vars.color.accentDim,
})

export const codeKeyword = style({
  color: vars.color.accent,
  fontWeight: 500,
})

export const codeType = style({
  color: vars.color.success,
})

export const codeString = style({
  color: vars.color.amber,
})

export const codeComment = style({
  color: vars.color.textMuted,
  fontStyle: 'italic',
})

export const codeImportLink = style({
  color: vars.color.accent,
  textDecoration: 'underline',
  textDecorationStyle: 'dotted',
  textUnderlineOffset: '2px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    color: vars.color.success,
    textDecorationStyle: 'solid',
  },
})

export const codeVariable = style({
  color: '#ff79c6',
})

export const codeNumber = style({
  color: '#bd93f9',
})

// Divider
export const divider = style({
  width: '4px',
  backgroundColor: vars.color.border,
  cursor: 'col-resize',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: vars.color.accent,
  },
})

// Status bar
export const statusBar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.xs} ${vars.space.xl}`,
  backgroundColor: vars.color.bgElevated,
  borderTop: `1px solid ${vars.color.border}`,
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
})

export const statusItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const statusDot = style({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: vars.color.success,
})

export const jurisdictionBadge = style({
  marginLeft: 'auto',
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  fontWeight: 500,
})

export const sourceInfo = style({
  marginTop: vars.space.xl,
  padding: vars.space.md,
  backgroundColor: vars.color.bgElevated,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
})

export const sourceLabel = style({
  display: 'block',
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  marginBottom: vars.space.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

export const sourcePath = style({
  display: 'block',
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  color: vars.color.accent,
  wordBreak: 'break-all',
})
