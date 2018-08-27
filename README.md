WORK IN PROGRESS

# react-color-extractor

![size](https://img.shields.io/badge/size-2.7KB-green.svg)
![version](https://img.shields.io/badge/version-1.0.0-green.svg)

<p align="center">
  <img src="./assets/color-extractor.gif" />
</p>

> The images were taken from [Unsplash](https://unsplash.com/) ❤️

## What

`react-color-extractor` is a React component that extracts colors from an image.

## Motivation

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

Check out the [`examples`](./examples) folder.

## Usage

`react-color-extractor` can be used in two different ways.

- **With image element as children**

```js
<ColorExtractor getColors={colors => console.log(colors)}>
  <img src="..." alt="..." style={{...}} />
</ColorExtractor>
```

- **Passing a local or remote image, or a blob url via `src` prop**

```js
<ColorExtractor
  src="<image-url-or-blob>"
  getColors={colors => console.log(colors)}
/>
```

## API

### `<ColorExtractor />` props

#### `getColors`

**`(colors: Array<number | string>) => void`**

`getColors` callback is invoked with an array of colors, either in hex or rgb format once the image is done processing. Use this callback to update the state with the colors array

```js
<ColorExtractor getColors={colors => console.log(colors)} />
```

#### `rgb`

**`type: boolean`**

When set to `true`, produces the color in `rgb` format. By default, colors produced are in hex format

```js
<ColorExtractor rgb getColors={colors => console.log(colors)} />
```

This will log colors in `rgb` format

#### `onError`

**`(error: Object) => void`**

`onError` callback is invoked if there is any issue with processing the image.

```js
<ColorExtractor onError={error => this.setState({ hasError: true , msg: error })}>
```

#### `src`

**`type: string`**

`src` prop accepts a remote image url or a local image path.

```js
<ColorExtractor
  src="https://i.imgur.com/OCyjHNF.jpg"
  getColors={colors => console.log(colors)}
/>
```

## Contributing

If you like to contribute to this project, then follow the below instructions to setup the project locally on your machine.

```
git clone https://github.com/<your_username_here>/react-color-extractor

cd react-color-extractor

yarn
```

### Type checking

Run flow type checker using `yarn flow`

### Start local server

Use command `yarn start` to start the development server.

### Building the source code

Run `yarn build` to build the source code.
