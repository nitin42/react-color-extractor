import React from 'react'

const renderSwatches = (type, colors) => {
  return colors.map((color, id) => {
    const normalizeColorValue =
      Array.isArray(color) && type === 'rgb'
        ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        : color

    return (
      <div key={id++} style={{ color }}>
        <div
          className="swatches"
          style={{
            backgroundColor: normalizeColorValue,
            color: normalizeColorValue
          }}
        />
        <div className="center-content hex-codes">{color}</div>
      </div>
    )
  })
}

export const Swatches = props => (
  <div className="display-swatches" style={{ marginTop: 20 }}>
    {renderSwatches('hex', props.colors)}
  </div>
)
