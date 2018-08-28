import React from 'react'

import { ColorExtractor } from '../../src'

export const Image = props =>
  props.error ? (
    <div className="error-message">
      An error occurred while processing the image.
    </div>
  ) : (
    <div className="image-container">
      <ColorExtractor getColors={props.getColors} onError={props.onError}>
        <img src={props.image} />
      </ColorExtractor>
    </div>
  )
