import React from 'react'
import ReactDOM from 'react-dom'

import ColorExtractor from './ColorExtractor'

const IMAGE =
	'https://images.unsplash.com/photo-1535014973233-20466f8cad6d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e6270104c4af68bd24506060398728de&auto=format&fit=crop&w=634&q=80'

const IMAGE_STYLES = { width: 500, height: 500 }

const SWATCHES_STYLES = { marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridGap: '2px' }

const Swatches = props => <div style={SWATCHES_STYLES}>{props.renderSwatches('rgb')}</div>

class App extends React.Component {
	state = { colors: [] }

	renderSwatches = type => {
		const { colors } = this.state

		return colors.map((color, id) => {
			return (
				<div
					key={id++}
					style={{
						backgroundColor:
							Array.isArray(color) && type === 'rgb' ? `rgb(${color[0]}, ${color[1]}, ${color[2]})` : color,
						width: 100,
						height: 100,
					}}
				/>
			)
		})
	}

	getColors = ({ colors }) => this.setState(state => ({ colors: [...state.colors, ...colors] }))

	render() {
		return (
			<React.Fragment>
				{/* <img id="image" src={IMAGE} style={IMAGE_STYLES} />
				<ColorExtractor imgId="image" rgb getColors={this.getColors} /> */}

				<ColorExtractor name="container" src="image" rgb getColors={this.getColors}>
					<img id="image" src={IMAGE} style={IMAGE_STYLES} />
				</ColorExtractor>
				{/* <ColorExtractor
					src="https://images.unsplash.com/photo-1534807265563-59a97c3a35a0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=477cc8cf0c5fbcf9faab2c6523e4f508&auto=format&fit=crop&w=1576&q=80"
					rgb
					getColors={this.getColors}
				/> */}
				<Swatches renderSwatches={this.renderSwatches} />
			</React.Fragment>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
