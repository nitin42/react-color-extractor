import React from "react";

export const IMAGE = "https://i.imgur.com/OCyjHNF.jpg";

export const IMAGE_STYLES = { width: 500, height: 500 };

export const SWATCHES_STYLES = {
  marginTop: 20,
  display: "flex",
  justifyContent: "center"
};

export const renderSwatches = (type, colors) => {
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

export const Swatches = props => (
  <div style={SWATCHES_STYLES}>{props.renderSwatches("rgb", props.colors)}</div>
);
