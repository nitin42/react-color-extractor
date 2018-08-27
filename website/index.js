import React from "react";
import ReactDOM from "react-dom";
import { css } from "emotion";

import { ColorExtractor } from "../src/";

const CAT_IMAGE =
  "https://images.unsplash.com/photo-1535089894977-83d4c8854f62?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0e70b451b32ef8730ad0620338ff4e49&auto=format&fit=crop&w=754&q=80";

const IMAGE_STYLES = {
  width: 700,
  height: 500
};

const CONTAINER_STYLES = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  marginTop: 40
};

const Image = props => (
  <div
    className={css`
      -webkit-box-shadow: 10px 10px 9px -11px rgba(122, 121, 122, 1);
      -moz-box-shadow: 10px 10px 9px -11px rgba(122, 121, 122, 1);
      box-shadow: 10px 10px 9px -11px rgba(122, 121, 122, 1);
    `}
  >
    <img id="image-rce" src={props.image} alt="image" style={IMAGE_STYLES} />
  </div>
);

const SWATCHES_STYLES = {
  marginTop: 20,
  display: "flex",
  justifyContent: "center"
};

const renderSwatches = (type, colors) => {
  return colors.map((color, id) => {
    return (
      <div key={id++} style={{ color }}>
        <div
          style={{
            backgroundColor:
              Array.isArray(color) && type === "rgb"
                ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                : color,
            width: 100,
            height: 100,
            margin: 10,
            borderRadius: 10,
            color:
              Array.isArray(color) && type === "rgb"
                ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                : color
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {color}
        </div>
      </div>
    );
  });
};

const Swatches = props => (
  <div className="animated slideInUp 0.5s" style={SWATCHES_STYLES}>
    {props.renderSwatches("hex", props.colors)}
  </div>
);

const Input = props => (
  <React.Fragment>
    <input
      className={css`
        padding: 10px;
        margin-top: 40px;
        width: 600px;
        border: 0.5px solid #4f4f4f;
        border-radius: 10px;

        &:focus {
          outline: none;
        }
      `}
      type="text"
      value={props.imagePath}
      placeholder="enter an image url"
      onChange={props.handleImage}
    />
  </React.Fragment>
);

class App extends React.Component {
  state = {
    image: CAT_IMAGE,
    colors: []
  };

  getColors = colors => {
    this.setState(state => ({ colors: [...colors] }));
  };

  handleImage = e => {
    this.setState({
      image: e.target.value
    });
  };

  render() {
    return (
      <div style={CONTAINER_STYLES}>
        <Image image={this.state.image} getColors={this.getColors} />
        <ColorExtractor src={this.state.image} getColors={this.getColors} />
        <Input
          imagePath={this.state.image}
          handleImage={this.handleImage}
          getColors={this.getColors}
        />
        {this.state.colors.length > 0 ? (
          <Swatches
            colors={this.state.colors}
            renderSwatches={renderSwatches}
          />
        ) : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
