import React from 'react'

export const SearchInput = props => (
  <input
    id="s-input"
    className="search-input"
    type="text"
    value={props.imagePath}
    placeholder="Enter a local or remote image url, or a blob url"
    onChange={props.handleImage}
  />
)
