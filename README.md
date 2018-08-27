**Work in progress**

# react-color-extractor

<p align="center">
  <img src="./assets/color-extractor.gif" />
</p>

> The images were taken from [Unsplash](https://unsplash.com/) ❤️

## What ?

`react-color-extractor` is a React component that extracts colors from an image.

## Motivation ?

This is one of the tools that I am using in creative coding. I was learning color theory and wanted a React based library to extract a collection of swatches from an image. The extracted colors then can be used to create interesting gradient patterns, [loading designs](https://generative-design.surge.sh) or crafting a symmetric color scheme across a system.

## Install

```
npm install react-color-extractor
```

or if you use `yarn`

```
yarn add react-color-extractor
```

**This package also depends on React, so make sure you've it installed.**

## Example

```js
import React from "react";

import { ColorExtractor } from "react-color-extractor";

const IMAGE = "https://i.imgur.com/OCyjHNF.jpg";

const IMAGE_STYLES = { width: 700, height: 500 };

const SWATCHES_STYLES = {
  marginTop: 20,
  display: "flex",
  justifyContent: "center"
};

class App extends React.Component {
  state = { colors: [] };

  renderSwatches = () => {
    const { colors } = this.state;

    return colors.map((color, id) => {
      return (
        <div
          key={id}
          style={{
            backgroundColor: color,
            width: 100,
            height: 100
          }}
        />
      );
    });
  };

  getColors = colors =>
    this.setState(state => ({ colors: [...state.colors, ...colors] }));

  render() {
    return (
      <div>
        <ColorExtractor getColors={this.getColors}>
          <img src={IMAGE} style={IMAGE_STYLES} />
        </ColorExtractor>
        <div style={SWATCHES_STYLES}>{this.renderSwatches()}</div>
      </div>
    );
  }
}
```

Checkout the demo on CodeSandbox

[![Edit k3wj33kzw3](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/k3wj33kzw3)

## Examples

- [Basic example](./examples/Basic.js)

- [Image element as children](./examples/WithChildren.js)

- [Passing image using `src` prop](./examples/WithSrc.js)

## Usage

`react-color-extractor` can be used in three different ways.

- **With image element as children**

```js
<ColorExtractor getColors={colors => console.log(colors)}>
  <img src="..." alt="..." style={{...}} />
</ColorExtractor>
```

- **Passing a local or remote image via `src` prop**

```js
<ColorExtractor src="https://..." getColors={colors => console.log(colors)} />
```

- **With image element somewhere in the DOM tree**

Specify the selector (id or class) of the image element present somewhere in the DOM tree.

```js
render() {
  return (
    <div>
      <h1>React Color Extractor</h1>
      <p>Color extractor components</p>
      <img id="some-image-id" src="https://..." alt="..." style={{ ... }} />
      <ColorExtractor imgId="some-image-id" getColors={colors => console.log(colors)} />
    </div>
  )
}
```
