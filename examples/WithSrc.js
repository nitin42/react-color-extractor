import React from "react";

import { ColorExtractor } from "../build/react-color-extractor";

import {
  IMAGE,
  IMAGE_STYLES,
  SWATCHES_STYLES,
  Swatches,
  renderSwatches
} from "./utils";

const Extractor = props => (
  <ColorExtractor src={IMAGE} getColors={props.getColors} />
);

export class WithSource extends React.Component {
  state = { colors: [] };

  getColors = colors =>
    this.setState(state => ({ colors: [...state.colors, ...colors] }));

  render() {
    return (
      <React.Fragment>
        <Extractor getColors={this.getColors} />
        <Swatches colors={this.state.colors} renderSwatches={renderSwatches} />
      </React.Fragment>
    );
  }
}
