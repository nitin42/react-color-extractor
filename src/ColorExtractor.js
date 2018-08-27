// @flow

import * as React from "react";
import Vibrant from "node-vibrant";

// Image input can be a html element (image tag), an image path (remote or local) or a blob url
type Image = HTMLElement | string | Blob;

// ColorExtractor component props
type Props = {
  // Invoked when there is an error other than CORS or DOM
  onError: (err: Object) => void,
  // Main callback which is invoked with all the colors extracted from the image (hex, rgb or hsl)
  getColors: (colors: Array<string | number>) => {},
  // Output colors in format RGB
  rgb: boolean,
  // Extract colors from the image provided via `src` prop
  src: string,
  children?: React.Node
};

// This component takes a src prop (image source, can be a blob or CORS enabled image path) or intercepts it's children to get image element,
// and parses the image using node-vibrant and invokes the prop callback with an array of colors.
class ColorExtractor extends React.Component<Props, void> {
  static defaultProps = {
    onError: (err: Object) => {},
    getColors: (colors: Array<number | string>) => {},
    rgb: false,
    hex: true,
    src: null
  };

  componentDidMount() {
    this.processImage();
  }

  componentDidUpdate(props: Props) {
    // Check whether the src image or image element is new. If it's a new url, parse the image again!

    if (
      props.src !== this.props.src &&
      typeof this.props.src === "string" &&
      this.props.src.length > 0
    ) {
      this.parseImage(this.props.src, this.props);
    } else if (
      this.props.children &&
      // $FlowFixMe
      props.children.props.src !== this.props.children.props.src
    ) {
      // $FlowFixMe
      this.parseImage(this.props.children.props.src, this.props);
    }
  }

  processImage = () => {
    const { props } = this;

    if (props.children) {
      // If the image element is direct children of ColorExtractor component, intercept the children and use the `src` property
      // $FlowFixMe
      this.parseImage(props.children.props.src, props);
    } else if (
      props.src &&
      typeof props.src === "string" &&
      props.src.length > 0
    ) {
      // if the image is provided via src prop
      this.parseImage(props.src, props);
    }
  };

  // Parse the image and extract the colors
  parseImage = (image: Image, props: Props) => {
    Vibrant.from(image)
      .getSwatches()
      .then(swatches =>
        props.getColors(this.getColorsFromSwatches(swatches, props))
      )
      .catch(error => {
        if (error) {
          // This error is mainly due to CORS issue. So we retry again by using the default image class. But if still there is any error, we bail out!
          this.useDefaultImageClass(image, props);
        }
      });
  };

  useDefaultImageClass = (image: Image, props: Props) => {
    new Vibrant.DefaultOpts.ImageClass()
      // $FlowFixMe
      .load(image.src)
      .then(data => {
        if (data.image) {
          const colors = [];

          Vibrant.from(data.image)
            .getSwatches()
            .then(swatches =>
              props.getColors(this.getColorsFromSwatches(swatches, props))
            )
            .catch(error => {
              if (error) {
                props.onError(error);
              }
            });
        }
      })
      .catch(error => {
        if (error) {
          props.onError(error);
        }
      });
  };

  // Get the array of colors from swatches
  getColorsFromSwatches = (swatches: Object, props: Props) => {
    const buffer = [];

    for (let swatch in swatches) {
      if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
        if (props.rgb) {
          buffer.push(swatches[swatch].getRgb());
        } else {
          buffer.push(swatches[swatch].getHex());
        }
      }
    }

    return buffer;
  };

  render(): ?React.Node {
    const length = React.Children.count(this.props.children);

    // We don't handle multiple images at the moment or custom components, sorry!
    if (length > 1) {
      throw new Error("Expected only one image element.");
    } else if (length === 1) {
      // Children should be an image element
      // $FlowFixMe
      if (this.props.children.type === "img") {
        return this.props.children;
      } else {
        throw new Error(
          `Expected children to be an image element but instead got a "${
            this.props.children.type
          }"`
        );
      }
    } else {
      return null;
    }
  }
}

// Utilities for color conversions

// Convert RGB to HEX format
export const rgbToHex = Vibrant.Util.rgbToHex;
// Convert HEX to RGB
export const hexToRgb = Vibrant.Util.hexToRgb;
// Convert RGB to HSL
export const rgbToHsl = Vibrant.Util.rgbToHsl;
// Convert HSL to RGB
export const hslToRgb = Vibrant.Util.hslToRgb;

export default ColorExtractor;
