import React from "react";

const IMAGE_ONE =
  "https://images.unsplash.com/photo-1535089894977-83d4c8854f62?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0e70b451b32ef8730ad0620338ff4e49&auto=format&fit=crop&w=754&q=80";

const IMAGE_TWO =
  "https://images.unsplash.com/photo-1525489196064-0752fa4e16f2?ixlib=rb-0.3.5&s=6b968b29fbc68a6de72743d406bc2dea&auto=format&fit=crop&w=1350&q=80";

const IMAGE_THREE =
  "https://images.unsplash.com/photo-1520633946251-dcf52b0276b9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=686e5ce82ff415317e8cc11989728517&auto=format&fit=crop&w=1350&q=80";

export const IMAGE = IMAGE_ONE;

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
