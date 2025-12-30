import { style, keyframes } from '@vanilla-extract/css'

export const treeContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const nodeContainer = style({
  display: 'flex',
  flexDirection: 'column',
})

export const nodeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  cursor: 'pointer',
  borderRadius: '4px',
  transition: 'background-color 0.15s ease',
  ':hover': {
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
  },
})

export const toggleButton = style({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  color: '#666',
  cursor: 'pointer',
  fontSize: '10px',
  padding: 0,
  flexShrink: 0,
  ':hover': {
    color: '#00d4ff',
  },
  ':disabled': {
    cursor: 'default',
    opacity: 0.5,
  },
})

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
})

export const spinner = style({
  display: 'inline-block',
  animation: `${spin} 1s linear infinite`,
})

export const noChildren = style({
  color: '#444',
  fontSize: '8px',
})

export const badge = style({
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.5px',
  flexShrink: 0,
  width: '50px',
})

export const citation = style({
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '12px',
  color: '#00d4ff',
  flexShrink: 0,
  minWidth: '120px',
  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const heading = style({
  fontSize: '13px',
  color: '#ccc',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
})

export const childrenContainer = style({
  overflow: 'hidden',
  borderLeft: '1px solid rgba(0, 212, 255, 0.1)',
  marginLeft: '10px',
})
