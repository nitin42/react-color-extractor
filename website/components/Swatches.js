import React from "react";

const SWATCHES_STYLES = {
  marginTop: 20,
  display: "flex",
  justifyContent: "center",
  overflowX: "auto"
};

const renderSwatches = (type, colors) => {
  return colors.map((color, id) => {
    const normalizeColorValue =
      Array.isArray(color) && type === "rgb"
        ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        : color;

    return (
      <div key={id++} style={{ color }}>
        <div
          className="swatches"
          style={{
            backgroundColor: normalizeColorValue,
            color: normalizeColorValue
          }}
        />
        <div className="center-content">{color}</div>
      </div>
    );
  });
};

export const Swatches = props => (
  <div style={SWATCHES_STYLES}>{renderSwatches("hex", props.colors)}</div>
);
