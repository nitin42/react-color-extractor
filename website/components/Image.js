import React from "react";

import { ColorExtractor } from "../../src";

const IMAGE_STYLES = {
  width: 700,
  height: 500
};

export const Image = props =>
  props.error ? (
    <div>An error occurred while processing the image.</div>
  ) : (
    <div className="image-container">
      <ColorExtractor getColors={props.getColors} onError={props.onError}>
        <img src={props.image} style={IMAGE_STYLES} />
      </ColorExtractor>
    </div>
  );
