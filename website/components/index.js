import React from 'react'
import { Image } from './Image'
import { Swatches } from './Swatches'
import { SearchInput } from './SearchInput'
import { FileInput } from './UploadButton'
import { Footer } from './Footer'

const IMAGE = 'https://i.imgur.com/OCyjHNF.jpg'

const GitHubLink = props => (
  <div style={{ marginTop: 20 }}>
    <a
      className="github-button"
      href="https://github.com/nitin42/react-color-extractor"
      data-size="large"
      data-show-count="true"
      aria-label="Star nitin42/react-color-extractor on GitHub"
    >
      Star
    </a>
  </div>
)

const Heading = props => <h1 className="heading">React Color Extractor</h1>

export class App extends React.Component {
  state = {
    image: IMAGE,
    colors: [],
    hasError: false
  }

  componentDidMount() {
    const searchInput = document.getElementById('s-input')

    searchInput.focus()

    const uploader = document.getElementById('uploader')
    const button = document.getElementById('file-upload')

    button.addEventListener('click', e => {
      if (uploader) {
        uploader.click()
      }

      e.preventDefault()
    })
  }

  uploadFiles = e => {
    this.setState({
      image: window.URL.createObjectURL(e.target.files[0]),
      hasError: false
    })
  }

  getColors = colors => {
    this.setState(state => ({ colors: [...colors], hasError: false }))
  }

  handleImage = e => {
    this.isResponseOk(e.target.value)
    this.setState({ image: e.target.value })
  }

  isResponseOk = path =>
    fetch(path)
      .then(
        res => (res.status === 200 ? this.setState({ hasError: false }) : null)
      )
      .catch(err => (err ? this.setState({ hasError: true }) : null))

  render() {
    return (
      <div
        className="center-content"
        style={{
          flexDirection: 'column'
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
          imagePath={this.state.image === IMAGE ? '' : this.state.image}
          handleImage={this.handleImage}
          getColors={this.getColors}
        />
        <FileInput uploadFiles={this.uploadFiles} />
        {this.state.colors.length > 0 ? (
          <Swatches colors={this.state.colors} />
        ) : null}
        <GitHubLink />
        <Footer />
      </div>
    )
  }
}
