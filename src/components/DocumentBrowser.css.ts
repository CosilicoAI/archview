import { style, keyframes } from '@vanilla-extract/css'
import { vars } from '../styles/theme.css'

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
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
  padding: `${vars.space.lg} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bgElevated,
  animation: `${fadeIn} 0.4s ease-out`,
})

export const logo = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize['2xl'],
  fontWeight: 600,
  color: vars.color.text,
  letterSpacing: '-0.02em',
})

export const logoAccent = style({
  color: vars.color.accent,
})

export const stats = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  color: vars.color.textDim,
})

export const searchContainer = style({
  padding: vars.space.lg,
  backgroundColor: vars.color.bg,
  borderBottom: `1px solid ${vars.color.border}`,
})

export const searchInput = style({
  width: '100%',
  padding: `${vars.space.md} ${vars.space.lg}`,
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.base,
  color: vars.color.text,
  backgroundColor: vars.color.bgElevated,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  outline: 'none',
  transition: 'all 0.2s ease',
  '::placeholder': {
    color: vars.color.textMuted,
  },
  ':focus': {
    borderColor: vars.color.accent,
    boxShadow: `0 0 0 2px ${vars.color.accentDim}`,
  },
})

export const content = style({
  flex: 1,
  overflow: 'auto',
  padding: vars.space.lg,
})

export const group = style({
  marginBottom: vars.space.md,
  animation: `${fadeIn} 0.5s ease-out backwards`,
})

export const groupHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.sm,
  fontWeight: 500,
  color: vars.color.textDim,
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.2s ease',
  ':hover': {
    color: vars.color.text,
    backgroundColor: vars.color.bgElevated,
  },
})

export const groupChevron = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.accent,
  width: '1em',
})

export const groupLabel = style({
  flex: 1,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

export const groupCount = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  padding: `2px ${vars.space.sm}`,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.sm,
})

export const groupContent = style({
  marginTop: vars.space.xs,
  marginLeft: vars.space.lg,
  borderLeft: `1px solid ${vars.color.border}`,
  paddingLeft: vars.space.md,
})

export const docItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  marginBottom: vars.space.xs,
  fontFamily: vars.font.body,
  color: vars.color.text,
  backgroundColor: 'transparent',
  border: '1px solid transparent',
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: vars.color.bgElevated,
    borderColor: vars.color.border,
  },
})

export const docItemSelected = style({
  backgroundColor: vars.color.accentDim,
  borderColor: vars.color.accent,
})

export const docCitation = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.color.accent,
})

export const docTitle = style({
  fontSize: vars.fontSize.base,
  color: vars.color.text,
})

export const docPreview = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  lineHeight: 1.4,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
})

export const statsBar = style({
  display: 'flex',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  backgroundColor: vars.color.bgElevated,
  borderBottom: `1px solid ${vars.color.border}`,
  overflowX: 'auto',
})

export const statButton = style({
  padding: `${vars.space.xs} ${vars.space.md}`,
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.textDim,
  backgroundColor: 'transparent',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s ease',
  ':hover': {
    color: vars.color.text,
    borderColor: vars.color.accent,
  },
})

export const statButtonActive = style({
  color: vars.color.bg,
  backgroundColor: vars.color.accent,
  borderColor: vars.color.accent,
  ':hover': {
    color: vars.color.bg,
    backgroundColor: vars.color.accent,
    borderColor: vars.color.accent,
  },
})

export const groupIcon = style({
  fontSize: vars.fontSize.base,
})

export const docBadge = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  fontWeight: 600,
  letterSpacing: '0.05em',
  opacity: 0.8,
})

export const footer = style({
  padding: `${vars.space.sm} ${vars.space.xl}`,
  backgroundColor: vars.color.bgElevated,
  borderTop: `1px solid ${vars.color.border}`,
  textAlign: 'center',
})

export const footerText = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
})
