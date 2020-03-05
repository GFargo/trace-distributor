import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../../core/src/components/Elements/Button'

const FileUpload = ({ id, title, placeholder, typesAccepted, onUploadFile }) => {
  const [file, setFile] = useState(undefined)

  const onChooseFile = (e) => {
    //console.log('onChooseFile: ', e) 
    const f = (!!e.target.files[0]?.name) ? e.target.files[0] : undefined
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
    <div className="flex items-center justify-left mb-2">
      <label className="px-4 py-2 cursor-pointer rounded border border-gray-500 hover:border-gray-800 text-gray-500 hover:text-gray-800">
        Browse
        <input 
          type="file" 
          id={"FileUpload-"+id} 
          accept={typesAccepted} 
          className="form-control-file hidden" 
          onChange={onChooseFile}
        />
      </label>

      {!file?.name && (
        <label 
          className="custom-file-label text-gold-500 text-sm font-weight-light opacity-50 pl-2" 
          htmlFor={"FileUpload-"+id}
        >
          {placeholder}
        </label>
      )}

      {!!file && !!file?.name && (
        <label 
        className="custom-file-label text-gray-500 text-sm font-weight-light pl-2" 
        htmlFor={"FileUpload-"+id}
        >
          {file.name}
        </label>
      )}

      {!!file && (
        <Button 
          type="button" 
          value='Upload' 
          variant="outline"
          disabled={!file || !file.name} 
          className="ml-2 px-4"
          onClickHandler={onUploadingFile}
        >
          Upload File
        </Button>
      )}
    </div>
  )
}

FileUpload.defaultProps = {
  placeholder: 'Choose a local file',
  typesAccepted: '',
}

FileUpload.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  typesAccepted: PropTypes.string,
  onUploadFile: PropTypes.func.isRequired,
}

export default FileUpload;
