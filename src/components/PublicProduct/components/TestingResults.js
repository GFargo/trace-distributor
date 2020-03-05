import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '../../core/src/images/svg/icons/download.svg';

const TestingResults = ({ files }) => (
  !!files?.length && (
    <Fragment>
      <div className="grid-row mx-4 mb-4">
        <h4 className="text-xl font-bold text-left">
          Testing Results:
        </h4>
      </div>
      {files.map(file => (
        <a
          key={file.filename}
          className=""
          href={file.url}
          target="_blank"
        >
          <span className="flex mx-4 mb-2 py-2 bg-gray-100">
            <div className="w-1/4">
              <img src={DownloadIcon} alt="DownloadIcon" className="pr-2 mx-auto h-20" />
            </div>
            <div className="w-3/4">
              <div className="h-8 mt-2 text-lg text-left font-bold">
                {file.name}
              </div>
              <div className="h-8 text-lg text-left italic h-8">
                {file.filename}
              </div>
            </div>
          </span>
        </a>
      ))}
    </Fragment>
  )
);

TestingResults.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TestingResults;
