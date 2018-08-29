// @flow

import * as React from 'react'

// Image input can be a html element (image tag), an image path (remote or local) or a blob url
export type Image = HTMLElement | string | Blob

// ColorExtractor component props
export type Props = {
  // Invoked when there is an error other than CORS or DOM
  onError: (err: Object) => void,
  // Main callback which is invoked with all the colors extracted from the image (hex, rgb or hsl)
  getColors: (colors: Array<string | number>) => {},
  // Output colors in format RGB
  rgb: boolean,
  // Extract colors from the image provided via `src` prop
  src: string,
  // Max color count for amount of colors from which swatches will be generated
  maxColors: number,
  children?: React.Node
}
