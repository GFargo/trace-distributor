import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop'
import Button from '../../core/src/components/Elements/Button'
import './index.css'

const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const maxSize = Math.max(image.width, image.height)
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea
  canvas.height = safeArea

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate(getRadianAngle(rotation))
  ctx.translate(-safeArea / 2, -safeArea / 2)

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  )
  const data = ctx.getImageData(0, 0, safeArea, safeArea)

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  )

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise(resolve => {
    canvas.toBlob(file => resolve(file), 'image/jpeg')
  })
}

const ImageCropper = ({ image, onCroppedInage }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const exportCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      )
      //console.log('exportCroppedImage', croppedImage)
      onCroppedInage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation, image, onCroppedInage])

  return (
    <div className="top-container">
      <div className="crop-container">
        <Cropper
          image={image}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={1}
          showGrid
          cropShape="round"
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="crop-controls">
        <Button 
          type="button"
          value='Cancel'
          variant="outline"
          className="mx-10 mt-1 px-4"
          onClickHandler={(e) => { e.preventDefault(); onCroppedInage(null); } }
        >
          Cancel
        </Button>
        <label htmlFor="customRange1" className="mt-2 mr-4">
          Zoom
        </label>
        <input 
          type="range" 
          className="custom-range mt-4 px-10 bg-gold-500" 
          id="customRange1"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          aria-labelledby="Zoom"
          onChange={(event) => setZoom(event.target.value)}
        />
        <Button 
          type="button"
          value='Save'
          variant="outline"
          className="ml-10 mt-1 px-4"
          onClickHandler={(e) => { e.preventDefault(); exportCroppedImage(e); } }
        >
          Save
        </Button>
      </div>
      
    </div>
  )
}

ImageCropper.propTypes = {
  image: PropTypes.string.isRequired,
  onCroppedInage: PropTypes.func.isRequired,
}

export default ImageCropper;
