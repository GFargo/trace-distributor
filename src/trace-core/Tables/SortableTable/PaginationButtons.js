import React from 'react';
import PropTypes from 'prop-types';

const PaginationButtons = ({dataLength, pageSize, currentPage, onClick}) => {
  var minPage = 0;
  var maxPage;

  if (dataLength % pageSize === 0) {
    maxPage = dataLength / pageSize
  } else {
    maxPage = Math.floor(dataLength / pageSize)
  }

  let leftIconClass = minPage < currentPage ? "fas fa-chevron-left" : "disabled fas fa-chevron-left";
  let rightIconClass = maxPage > currentPage ? "fas fa-chevron-right" : "disabled fas fa-chevron-right";

  let pageLowerLimit = (currentPage * pageSize) + 1;
  let pageUpperLimit = pageSize > dataLength ? dataLength : (currentPage * pageSize) + pageSize

  return(<p className='float-right pagination-buttons'>
      <strong>{pageLowerLimit}-{pageUpperLimit}</strong> of <strong>{dataLength}</strong>
      <i onClick={() => { minPage < currentPage && onClick(-1)}} className={leftIconClass}></i>
      <i onClick={() => { maxPage > currentPage && onClick(1)}} className={rightIconClass}></i>
    </p>);
}

PaginationButtons.propTypes = {
  dataLength: PropTypes.number,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  onClick: PropTypes.func
};

export default PaginationButtons;
