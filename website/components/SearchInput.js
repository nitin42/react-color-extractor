import React from "react";

export const SearchInput = props => (
  <input
    className="search-input"
    type="text"
    value={props.imagePath}
    placeholder="Enter an image url"
    onChange={props.handleImage}
  />
);
