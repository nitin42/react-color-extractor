import React from 'react'
import ReactDOM from 'react-dom'

import ColorExtractor from './ColorExtractor'

const IMAGE =
	'https://images.unsplash.com/photo-1534971119865-7210cc8b6872?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fa639905b4d8049d11e83479c0ed6720&auto=format&fit=crop&w=1050&q=80'

class App extends React.Component {
	state = { colors: [] }

	renderSwatches = () => {
		const { colors } = this.state

		return colors.map((color, id) => {
			return <div id={id++} style={{ backgroundColor: color, width: 100, height: 100 }} />
		})
	}

	render() {
		return (
			<React.Fragment>
				<ColorExtractor
					src="image"
					getColors={({ colors }) => this.setState(state => ({ colors: [...state.colors, ...colors] }))}
				>
					<img id="image" src={IMAGE} crossOrigin="anonymous" style={{ width: 500, height: 500 }} />
				</ColorExtractor>
				<div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridGap: '2px' }}>
					{this.renderSwatches()}
				</div>
			</React.Fragment>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
