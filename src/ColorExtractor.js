// @flow

import * as React from 'react'
import Vibrant from 'node-vibrant'

import type { Image, Props } from './types'

// This component takes a src prop (image source, can be a blob or an image path) or intercepts it's children to get the image element,
// and parses the image using node-vibrant, and finally invokes the prop callback with an array of colors.
class ColorExtractor extends React.Component<Props, void> {
  static defaultProps = {
    onError: (error: Object) => {},
    // Colors can be in vec3 format (rgb or hsl) or in hex format
    getColors: (colors: Array<Array<number> | string>) => {},
    rgb: false,
    hex: true,
    src: null,
    maxColors: 64
  }

  componentDidMount() {
    this.processImage()
  }

  // If the src url is being passed by the parent component, and if it updates later then we need
  // to parse the updated image again!
  componentDidUpdate(props: Props) {
    // Check whether the src image or image element is new. If it's a new url, parse the image again!

    if (
      props.src !== this.props.src &&
      typeof this.props.src === 'string' &&
      this.props.src.length > 0
    ) {
      this.parseImage(this.props.src, this.props)
    } else if (
      this.props.children &&
      // $FlowFixMe
      props.children.props.src !== this.props.children.props.src
    ) {
      // $FlowFixMe
      this.parseImage(this.props.children.props.src, this.props)
    }
  }

  processImage = () => {
    if (this.props.children) {
      // If the image element is direct children of ColorExtractor component, intercept the children and use the `src` property
      // $FlowFixMe
      if (this.props.children.props.src) {
        this.parseImage(this.props.children.props.src, this.props)
      }
    } else if (
      this.props.src &&
      typeof this.props.src === 'string' &&
      this.props.src.length > 0
    ) {
      // if the image is provided via src prop
      this.parseImage(this.props.src, this.props)
    } else {
      console.error(
        "Please provide an image url using the 'src' prop or wrap an image element under the <ColorExtractor /> component. Check out the docs for more info - https://goo.gl/rMZ5L7"
      )
    }
  }

  // Parse the image and extract the colors
  parseImage = (image: Image, props: Props) => {
    Vibrant.from(image)
      .maxColorCount(props.maxColors)
      .getSwatches()
      .then(swatches =>
        props.getColors(this.getColorsFromSwatches(swatches, props))
      )
      .catch(error => {
        if (error) {
          // This error is mainly due to CORS issue. So we retry again by using the default image class. But if still there is any error, we bail out!
          this.useDefaultImageClass(image, props)
        }
      })
  }

  useDefaultImageClass = (image: Image, props: Props) => {
    // If there is any CORS issue, then the default class recreates the image element with crossOrigin set to anonymous.
    new Vibrant.DefaultOpts.ImageClass()
      // $FlowFixMe
      .load(image.src)
      .then(data => {
        if (data.image) {
          Vibrant.from(data.image)
            .getSwatches()
            .then(swatches =>
              props.getColors(this.getColorsFromSwatches(swatches, props))
            )
            .catch(error => {
              if (error) {
                props.onError(error)
              }
            })
        }
      })
      .catch(error => {
        if (error) {
          props.onError(error)
        }
      })
  }

  // Get the array of colors from swatches
  getColorsFromSwatches = (swatches: Object, props: Props) => {
    const colors = []

    for (let swatch in swatches) {
      if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
        if (props.rgb) {
          colors.push(swatches[swatch].getRgb())
        } else {
          colors.push(swatches[swatch].getHex())
        }
      }
    }

    return colors
  }

  render(): ?React.Node {
    const length = React.Children.count(this.props.children)

    // We don't handle multiple images at the moment or custom components, sorry!
    if (length > 1) {
      throw new Error('Expected only one image element.')
    } else if (length === 1) {
      // Children should be an image element
      // $FlowFixMe
      if (this.props.children.type === 'img') {
        return this.props.children
      } else {
        throw new Error(
          `Expected children to be an image element but instead got a "${
            this.props.children.type
          }"`
        )
      }
    } else {
      return null
    }
  }
}

export default ColorExtractor
