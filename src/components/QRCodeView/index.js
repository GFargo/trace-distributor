import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';


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

const QRCodeView = ({ name, url }) => (
  <div className="text-center" style={{ width: '320px' }}>
    <QRCode
      id={name}
      value={url}
      size={320}
      level={"H"}
      includeMargin={true}
    />
    <a onClick={() => dlProductQRImage(name)}>
      Download QR Code
    </a>
  </div>
);

QRCodeView.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default QRCodeView;