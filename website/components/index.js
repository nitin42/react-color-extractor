import React from "react";
import { Image } from "./Image";
import { Swatches } from "./Swatches";
import { SearchInput } from "./SearchInput";
import { FileInput } from "./UploadButton";

const IMAGE =
  "https://images.unsplash.com/photo-1535089894977-83d4c8854f62?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0e70b451b32ef8730ad0620338ff4e49&auto=format&fit=crop&w=754&q=80";

const GitHubLink = props => (
  <div style={{ marginTop: 20 }}>
    <a
      className="link"
      href="https://github.com/nitin42/react-color-extractor"
      target="_blank"
    >
      View on GitHub
    </a>
  </div>
);

const Heading = props => <h1 className="heading">React Color Extractor</h1>;

export class App extends React.Component {
  state = {
    image: IMAGE,
    colors: [],
    hasError: false
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
    this.setState({
      image: window.URL.createObjectURL(e.target.files[0]),
      hasError: false
    });
  };

  getColors = colors => {
    this.setState(state => ({ colors: [...colors], hasError: false }));
  };

  handleImage = e => {
    this.isResponseOk(e.target.value);
    this.setState({ image: e.target.value });
  };

  isResponseOk = path =>
    fetch(path)
      .then(
        res => (res.status === 200 ? this.setState({ hasError: false }) : null)
      )
      .catch(err => (err ? this.setState({ hasError: true }) : null));

  render() {
    return (
      <div
        className="center-content"
        style={{
          flexDirection: "column"
        }}
      >
        <Heading />
        <Image
          error={this.state.hasError}
          image={this.state.image}
          getColors={this.getColors}
          onError={error => this.setState({ hasError: true })}
        />
        <SearchInput
          imagePath={this.state.image === IMAGE ? "" : this.state.image}
          handleImage={this.handleImage}
          getColors={this.getColors}
        />
        <FileInput uploadFiles={this.uploadFiles} />
        {this.state.colors.length > 0 ? (
          <Swatches colors={this.state.colors} />
        ) : null}
        <GitHubLink />
      </div>
    );
  }
}
