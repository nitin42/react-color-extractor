import React from 'react'
import Vibrant from 'node-vibrant'
import PropTypes from 'prop-types'

// ColorExtractor - A React component which extracts the colors (hex / rgb / hsl) from an image. The image can be a local or served with CORS enabled.
// Uses vibrant to extract the swatches and invokes a callback with colors.

// Example 1 - With image as a children

/**
 * <ColorExtractor name="container-one" style={{ ... }} getColors={({ colors }) => {}}>
 *   <img src="..." width="..." height="..." />
 * </ColorExtractor>
 */

// Example 2 - With image as source prop

/**
 * <ColorExtractor src="..." getColors={({ colors }) => {}} rgb />
 */

// Example 3 - With image somewhere in the DOM tree

/**
 * <div>
 *   <img id="" src="..." />
 *   <ColorExtractor imgId="..." getColors={({ colors }) => {}} rgb />
 * </div>
 */

class ColorExtractor extends React.Component {
	static defaultProps = {
		// Error callback
		onError: err => {},
		// Main callback that recieves the colors from an image
		getColors: ({ colors }) => {},
		// colors in rgb format ?
		rgb: false,
		// colors in hsl format ?
		hsl: false,
		// colors in hex format ?
		hex: true,
		// Get the image by id
		imgId: null,
		// Name of the container. Required if the image which is being processed is direct children of the ColorExtractor component
		name: '',
		// Image source. Use this prop if you don't want to render the image and just need the colors from a local or remote image
		src: null,
	}

	static propTypes = {
		onError: PropTypes.func,
		getColors: PropTypes.func,
		rgb: PropTypes.bool,
		hsl: PropTypes.bool,
		hex: PropTypes.bool,
		imgId: PropTypes.string,
		name: PropTypes.string,
		src: PropTypes.string,
	}

	componentDidMount() {
		let image

		// Check if the src is path or an image element. If it's an image element, directly
		// use Vibrant constructor else if it's an image path, create an hidden image element and extract colors,
		// or, if it's an image element or id or className, get the element ref.

		if (this.props.imgId) {
			image = document.getElementById(this.props.imgId)

			if (!image) {
				throw new Error(`Couldn't find the image with the id "${this.props.imgId}" in the dom tree.`)
			}

			if (image.tagName !== 'IMG') {
				throw new Error(`Expected the element with id "${this.props.imgId}" to be an image.`)
			}
		} else if (this.props.name) {
			// At the moment, we only handle one image inside the container
			image = document.getElementById(this.props.name).children[0]
		} else if (this.props.src) {
			const root = document.getElementById('root')

			image = document.createElement('img')

			image.src = this.props.src
			// We just care about the colors and not the image!
			image.style = 'display: none;'

			root.appendChild(image)
		}

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
			if (this.props.children.type === 'img') {
				return <div id={this.props.name}>{this.props.children}</div>
			} else {
				throw new Error(`Expected children to be an image element but instead got a "${this.props.children.type}"`)
			}
		} else {
			return null
		}
	}
}

export default ColorExtractor
