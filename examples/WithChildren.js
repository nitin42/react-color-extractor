import React from "react";

import { ColorExtractor } from "../build/react-color-extractor";

import { IMAGE, IMAGE_STYLES, SWATCHES_STYLES, Swatches } from "./utils";

const Extractor = props => (
  <ColorExtractor getColors={props.getColors}>
    <img src={IMAGE} style={IMAGE_STYLES} />
  </ColorExtractor>
);

export class WithChildren extends React.Component {
  state = { colors: [] };

  renderSwatches = type => {
    const { colors } = this.state;

    return colors.map((color, id) => {
      return (
        <div
          key={id++}
          style={{
            backgroundColor:
              Array.isArray(color) && type === "rgb"
                ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                : color,
            width: 100,
            height: 100
          }}
        />
      );
    });
  };

  getColors = ({ colors }) =>
    this.setState(state => ({ colors: [...state.colors, ...colors] }));

  render() {
    return (
      <React.Fragment>
        <Extractor getColors={this.getColors} />
        <Swatches renderSwatches={this.renderSwatches} />
      </React.Fragment>
    );
  }
}
