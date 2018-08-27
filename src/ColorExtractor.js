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
  // Color format RGB
  rgb: boolean,
  // Directly extract the colors from the image provided via `src` prop
  src: string,
  // If the image element is the direct children of <ColorExtractor />
  children?: React.Node
};

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
    if (props.src !== this.props.src && this.props.src.length > 0) {
      this.handleImgSrc(this.props);
      // $FlowFixMe
    } else if (
      this.props.children &&
      props.children.props.src !== this.props.children.props.src
    ) {
      this.handleChildren(this.props);
    }
  }

  processImage = () => {
    const { props } = this;

    if (props.children) {
      // If the image element is direct children of ColorExtractor component, intercept the children and use the `src` property
      this.handleChildren(props);
    } else if (
      props.src &&
      typeof props.src === "string" &&
      props.src.length > 0
    ) {
      // if the image is provided via src prop
      this.handleImgSrc(props);
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

  // Handler for parsing the image given the image url via `src` prop
  handleImgSrc = (props: Props) => this.parseImage(props.src, props);

  // Handler for parsing the image given the image as direct children of ColorExtractor component
  // $FlowFixMe
  handleChildren = (props: Props) =>
    this.parseImage(props.children.props.src, props);

  render(): ?React.Node {
    const length = React.Children.count(this.props.children);

    // We don't handle multiple images at the moment, sorry!
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
