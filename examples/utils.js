import React from "react";

export const IMAGE =
  "https://images.unsplash.com/photo-1535089894977-83d4c8854f62?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0e70b451b32ef8730ad0620338ff4e49&auto=format&fit=crop&w=754&q=80";

export const IMAGE_STYLES = { width: 500, height: 500 };

export const SWATCHES_STYLES = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gridGap: "2px"
};

export const Swatches = props => (
  <div style={SWATCHES_STYLES}>{props.renderSwatches("rgb")}</div>
);
