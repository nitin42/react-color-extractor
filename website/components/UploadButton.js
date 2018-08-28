import React from 'react'

export const FileInput = props => (
  <div style={{ marginTop: 20 }}>
    <input
      id="uploader"
      style={{ display: 'none' }}
      type="file"
      accept="image/*"
      onChange={props.uploadFiles}
    />
    <button className="button" id="file-upload">
      Upload image
    </button>
  </div>
)
