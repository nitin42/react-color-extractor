import React from "react";

export const IMAGE =
  "https://images.unsplash.com/photo-1525489196064-0752fa4e16f2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d39007f42b1568e412a65313cdfdc63b&auto=format&fit=crop&w=1350&q=80";

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
