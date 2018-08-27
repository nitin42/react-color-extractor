import React from "react";
import ReactDOM from "react-dom";
import { css } from "emotion";

import { ColorExtractor } from "../src/";

const IMAGE =
  "https://images.unsplash.com/photo-1535089894977-83d4c8854f62?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0e70b451b32ef8730ad0620338ff4e49&auto=format&fit=crop&w=754&q=80";

const IMAGE_STYLES = {
  width: 700,
  height: 500
};

const Image = props => (
  <div
    className={css`
      -webkit-box-shadow: 10px 10px 9px -11px rgba(122, 121, 122, 1);
      -moz-box-shadow: 10px 10px 9px -11px rgba(122, 121, 122, 1);
      box-shadow: 10px 10px 9px -11px rgba(122, 121, 122, 1);
    `}
  >
    {props.error ? (
      <div>Invalid image path</div>
    ) : (
      <img id="image-rce" src={props.image} style={IMAGE_STYLES} />
    )}
  </div>
);

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
          className={css`
            background-color: ${normalizeColorValue};
            width: 100px;
            height: 100px;
            margin: 10px;
            border-radius: 10px;
            color: ${normalizeColorValue};
          `}
        />
        <div
          className={css`
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          {color}
        </div>
      </div>
    );
  });
};

const Swatches = props => (
  <div style={SWATCHES_STYLES}>{props.renderSwatches("hex", props.colors)}</div>
);

const Input = props => (
  <React.Fragment>
    <input
      className={css`
        padding: 15px;
        margin-top: 40px;
        width: 600px;
        font-size: 16px;
        border: 0.5px solid #4f4f4f;
        border-radius: 5px;

        &:focus {
          outline: none;
        }
      `}
      type="text"
      value={props.imagePath}
      placeholder="Enter an image url"
      onInput={props.handleImage}
    />
  </React.Fragment>
);

const FileInput = props => (
  <div style={{ marginTop: 20 }}>
    <input
      id="uploader"
      style={{ display: "none" }}
      type="file"
      accept="image/*"
      onChange={props.uploadFiles}
    />
    <button
      className={css`
        padding: 10px;
        font-size: 12px;
        border: 0.5px solid black;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
          background: black;
          color: white;
        }

        &:focus {
          outline: none;
        }
      `}
      id="file-upload"
    >
      Upload
    </button>
  </div>
);

class App extends React.Component {
  state = {
    image: IMAGE,
    colors: [],
    hasError: true
  };

  componentDidMount() {
    const uploader = document.getElementById("uploader");
    const button = document.getElementById("file-upload");

    button.addEventListener("click", e => {
      if (uploader) {
        uploader.click();
      }

      e.preventDefault();
    });
  }

  uploadFiles = e => {
    this.setState({ image: window.URL.createObjectURL(e.target.files[0]) });
  };

  getColors = colors => {
    this.setState(state => ({ colors: [...colors], hasError: false }));
  };

  handleImage = e => {
    this.setState({
      image: e.target.value
    });
  };

  render() {
    return (
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-top: 40px;
        `}
      >
        <Image
          error={this.state.hasError}
          image={this.state.image}
          getColors={this.getColors}
        />
        <ColorExtractor
          src={this.state.image}
          getColors={this.getColors}
          onError={error => this.setState({ hasError: true })}
        />
        <Input
          imagePath={this.state.image === IMAGE ? "" : this.state.image}
          handleImage={this.handleImage}
          getColors={this.getColors}
        />
        <FileInput uploadFiles={this.uploadFiles} />
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
