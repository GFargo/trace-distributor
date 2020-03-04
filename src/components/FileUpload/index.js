import React, { useState } from 'react'
import PropTypes from 'prop-types'

const FileUpload = ({ id, title, placeholder, typesAccepted, onUploadFile }) => {
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
      onUploadFile(file)
    }
  }

  return (
    <form onSubmit={onUploadingFile}>
      <div className="input-group mb-2">
        {!!title &&
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputTitle">{title}</span>
          </div>}
        <div className="custom-file">
          <input type="file" accept={typesAccepted || ''} id={"FileUpload-"+id} className="custom-file-input" 
            onChange={onChooseFile} />
          <label 
            className="custom-file-label text-gold-500 text-sm font-weight-light opacity-50" 
            htmlFor={"FileUpload-"+id}
          >
            {file?.name || placeholder || 'Choose a local file'}
          </label>
        </div>
        {!!file && (
        <div className="input-group-append">
          <input 
            type="submit" 
            value='Upload' 
            disabled={!file || !file.name} 
            className={'btn btn-block ml-2 px-4 '+((!file || !file.name) ? 'btn-disabled' : 'btn-success')}
          />
        </div>
        )}
      </div>
    </form>
  )
}

FileUpload.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  typesAccepted: PropTypes.string,
  onUploadFile: PropTypes.func.isRequired
}

export default FileUpload
