// @flow

import * as React from "react";
import Vibrant from "node-vibrant";

// Image can also be served remotely (CORS enabled server)
type HTTPSLink = string;

// Or it can also be an image element, or null (default)
type Image = HTMLElement | HTTPSLink | null;

// ColorExtractor component props
type Props = {
  // Invoked when there is an error other than CORS or DOM
  onError: (err: Object) => void,
  // Main callback which is invoked with all the colors extracted from the image (hex, rgb or hsl)
  getColors: (colors: Array<string | number>) => {},
  // Color format RGB
  rgb: boolean,
  // Get the image ref through selector id
  imgId: string,
  // Get the image ref through selector className
  cName: string,
  // Directly extract the colors from the src
  src: string,
  // Optional wrap the image from which the colors will be extracted
  children?: React.Node
};

// ColorExtractor - A React component which extracts the colors (hex / rgb / hsl) from an image. The image can be a local or served with CORS enabled.

// Example 1 - With image element as a children

/**
 * <ColorExtractor name="container-one" style={{ ... }} getColors={({ colors }) => {}}>
 *   <img src="..." width="..." height="..." />
 * </ColorExtractor>
 */

// Example 2 - With image as source prop

/**
 * <ColorExtractor src="..." getColors={({ colors }) => {}} rgb />
 */

// Example 3 - With image somewhere in the DOM tree

/**
 * <div>
 *   <img id="" src="..." />
 *   <ColorExtractor imgId="..." getColors={({ colors }) => {}} rgb />
 * </div>
 */

class ColorExtractor extends React.Component<Props, void> {
  static defaultProps = {
    onError: (err: Object) => {},
    getColors: (colors: Array<number | string>) => {},
    rgb: false,
    hex: true,
    imgId: null,
    src: null,
    cName: null
  };

  // Utilities for dealing with color conversions

  static rgbToHex = Vibrant.Util.rgbToHex;

  static hexToRgb = Vibrant.Util.hexToRgb;

  static rgbToHsl = Vibrant.Util.rgbToHsl;

  static hslToRgb = Vibrant.Util.hslToRgb;

  componentDidMount() {
    let image = null;

    // Check if the src is path or an image element. If it's an image element, directly
    // use Vibrant constructor else if it's an image path, create an hidden image element and extract colors,
    // or, if it's an image element or id or className, get the element ref.

    if (this.props.imgId) {
      image = document.getElementById(this.props.imgId);

      if (!image) {
        throw new Error(
          `Couldn't find the image with the id "${
            this.props.imgId
          }" in the dom tree.`
        );
      }

      if (image.tagName !== "IMG") {
        throw new Error(
          `Expected the element with id "${this.props.imgId}" to be an image.`
        );
      }
    } else if (this.props.children) {
      // We assume the children count is one, so we directly access the props
      // $FlowFixMe
      image = this.props.children.props.src;
    } else if (this.props.src) {
      image = this.props.src;
    } else if (this.props.cName) {
      image = document.querySelector(`.${this.props.cName}`);
    }

    this.parseImage(image, this.props);
  }

  // Parse the image and extract the colors
  parseImage = (image: Image, props: Props) => {
    Vibrant.from(image)
      .getSwatches()
      .then(swatches =>
        props.getColors(this.getColorsFromSwatches(swatches, props))
      )
      .catch(error => {
        if (error) {
          // This error is mainly due to CORS issue. So we retry again by using the default image class, but if still there is any error, we bail out there
          this.useDefaultImageClass(image, props);
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

  useDefaultImageClass = (image: Image, props: Props) => {
    // $FlowFixMe
    new Vibrant.DefaultOpts.ImageClass().load(image.src).then(data => {
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
    });
  };

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

export default ColorExtractor;
