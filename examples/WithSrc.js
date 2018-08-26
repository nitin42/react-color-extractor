import React from "react";
import ColorExtractor from "../src/ColorExtractor";

const IMAGE =
  "https://images.unsplash.com/photo-1525489196064-0752fa4e16f2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d39007f42b1568e412a65313cdfdc63b&auto=format&fit=crop&w=1350&q=80";

const IMAGE_STYLES = { width: 500, height: 500 };

const SWATCHES_STYLES = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gridGap: "2px"
};

const Swatches = props => (
  <div style={SWATCHES_STYLES}>{props.renderSwatches("rgb")}</div>
);

const WithSource = props => (
  <ColorExtractor src={IMAGE} getColors={props.getColors} />
);

class App extends React.Component {
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
        <WithSource getColors={this.getColors} />
        <Swatches renderSwatches={this.renderSwatches} />
      </React.Fragment>
    );
  }
}
