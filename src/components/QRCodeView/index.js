import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import Button from '../../core/src/components/Elements/Button'


const dlProductQRImageURL = (name, url) => {
  let downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `${name}.png`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const dlProductQRImage = (name) => {
  const el = document.getElementById(name);
  if (!el) return;
  const imageURL = el.toDataURL("image/png");
  if (!imageURL) return;
  const streamUrl = imageURL.replace("image/png", "image/octet-stream");
  dlProductQRImageURL(name, streamUrl)
};

const QRCodeView = ({ name, url, className }) => (
  <div className={`text-center ${className}`}>
    <div className="w-full flex flex-col items-center bg-white p-4 lg:p-6">
      <div className="mx-auto">
        <QRCode
          id={name}
          value={url}
          size={340}
          level={"H"}
          includeMargin={true}
        />
      </div>

      <Button
        color="transparent"
        variant="outline"
        icon="download"
        // size="icon"
        // iconMargin="0"
        onClickHandler={() => dlProductQRImage(name)}
      >
        Download
      </Button>
    </div>
  </div>
);

QRCodeView.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
};

QRCodeView.defaultProps = {
  className: '',
};

export default QRCodeView;
