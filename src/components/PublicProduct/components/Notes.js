import React from 'react';
import PropTypes from 'prop-types';

const Notes = ({ title, text }) => (
  !!text && (
    <div className="grid-row mx-4 mb-12 text-left">
      <div className="grid-col-12">
        <h4 className="text-xl font-bold mb-2">
          {title}
        </h4>
        <p className="text-lg">
          {text}
        </p>
      </div>
    </div>
  )
);

Notes.defaultProps = {
  text: '',
};

Notes.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
};

export default Notes;
