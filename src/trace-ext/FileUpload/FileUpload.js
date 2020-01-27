import React, { useState } from 'react'
import PropTypes from 'prop-types'

const FileUpload = ({ title, placeholder, typesAccepted, onUploadFile }) => {
  const [file, setFile] = useState(undefined)

  const onChooseFile = (e) => {
    const f = (!!e.target.files[0]?.name) ? e.target.files[0] : undefined
    console.log('onChooseFile: ', f?.name || 'canceled.. f in chat') 
    //if (f?.name?.substring(f?.name?.lastIndexOf('.'))?.toLowerCase() === '.pdf')
    setFile(f)
  }

  const onUploadingFile = (e) => {
    e.preventDefault()
    if(!!file?.name) {
      //console.log('onUploadingFile: ', file)
      if (!!onUploadFile) onUploadFile(file)
      else console.error('FileUpload - Error: No onUploadFile function')
    }
  }

  return (
    <form onSubmit={onUploadingFile}>
      <div className="input-group px-3 mb-5">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputTitle">{title}</span>
        </div>
        <div className="custom-file">
          <input type="file" accept={typesAccepted || ''} id="FileUpload-FileInput" className="custom-file-input" 
            onChange={onChooseFile} />
          <label className="custom-file-label" htmlFor="FileUpload-FileInput">
            {file?.name || placeholder || 'Choose a file'}
          </label>
        </div>
        <div className="input-group-append">
          <input type="submit" value='Upload' disabled={!file || !file.name} className='btn btn-primary btn-block ml-2 px-4' />
        </div>
      </div>
    </form>
  )
}

FileUpload.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  typesAccepted: PropTypes.string,
  onUploadFile: PropTypes.func.isRequired
}

export default FileUpload