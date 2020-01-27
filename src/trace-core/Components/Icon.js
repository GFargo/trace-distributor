import React from 'react';
import PropTypes from 'prop-types';

const Icon = (props) => {
   return(<img alt={`${props.icon} icon`} src={`/icons/${props.icon}.svg`} className="TraceIcon" />);
};

Icon.propTypes = {
  icon: PropTypes.string
}

export default Icon;
