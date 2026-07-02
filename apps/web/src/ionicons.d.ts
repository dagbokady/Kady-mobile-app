import type { DetailedHTMLProps, HTMLAttributes } from 'react'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'ion-icon': DetailedHTMLProps<HTMLAttributes<HTMLElement> & { name?: string }, HTMLElement>
      }
    }
  }
}

export {}
