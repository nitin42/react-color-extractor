import React from 'react'
import Vibrant from 'node-vibrant'

// ColorExtractor - A React component which extracts the colors (hex / rgb / hsl) from an image. The image can be a local or served with CORS enabled.
// Uses vibrant to extract the swatches and invokes a callback with colors. It can be passed an id for the image element or it can also
// intercept the image as its children
class ColorExtractor extends React.Component {
	ref = null

	static defaultProps = {
		onError: err => {},
		getColors: ({ colors }) => {},
		rgb: false,
		hsl: false,
		hex: true,
		src: null,
	}

	componentDidMount() {
		const hexCodes = []

		const image = document.getElementById(this.ref)

		// Check if the src is path or an image element. If it's an image element, directly
		// use Vibrant constructor else if it's an image path, create an hidden image element and extract colors,
		// or, if it's an image element or id or className, use the DOM API to get the element ref.
		// Assuming it's a ref,
		this.parseImage(image, this.props)
	}

	// Parses the image element using node vibrant
	parseImage = (image, props) => {
		Vibrant.from(image)
			.getSwatches()
			.then(swatches => props.getColors({ colors: this.getColorsFromSwatches(swatches, props) }))
			.catch(error => {
				if (error) {
					this.useImageClass(image, props)
				}
			})
	}

	getColorsFromSwatches = (swatches, props) => {
		const buffer = []

		for (let swatch in swatches) {
			if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
				if (props.rgb) {
					buffer.push(swatches[swatch].getRgb())
				} else if (props.hsl) {
					buffer.push(swatches[swatch].getHsl())
				} else {
					buffer.push(swatches[swatch].getHex())
				}
			}
		}

		return buffer
	}

	// If there is any error parsing the image (may be due to invalid format or CORS issue, use this method to call
	// default image class and then parse the image again)
	useImageClass = (image, props) => {
		const colors = []

		new Vibrant.DefaultOpts.ImageClass().load(image.src).then(data => {
			if (data.image) {
				Vibrant.from(data.image)
					.getSwatches()
					.then(swatches => props.getColors({ colors: this.getColorsFromSwatches(swatches, props) }))
					.catch(error => {
						if (error) {
							props.onError(error)
						}
					})
			}
		})
	}

	render() {
		// We don't handle multiple images at the moment, sorry!
		if (React.Children.count(this.props.children) > 1) {
			throw new Error('Expected only one image element')
		} else if (React.Children.count(this.props.children) === 1) {
			this.ref = this.props.children
			return this.props.children
		}
	}
}

export default ColorExtractor
