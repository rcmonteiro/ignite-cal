import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  ':root': {
    '--error-color': '#f75a68',
  },

  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },
})
