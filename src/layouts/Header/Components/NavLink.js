import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useRouteMatch } from "react-router-dom";

const NavLink = ({ label, to, activeOnlyWhenExact = true, className }) => {
  const match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  });

  const borders = `border-b-4 border-transparent hover:border-gold-500 ${match ? 'border-gold-500' : ''}`;
  const colors = `hover:text-gold-500 ${match ? 'text-gold-500' : ''}`; 

  return (
    <ListElement className={`mx-3 ${colors} ${borders} ${className}`}>
      <Link className="p-3 inline-block" to={to}>{label}</Link>
    </ListElement>
  );
};

const ListElement = styled.li`
  transition: color 225ms ease, border 185ms ease-out;
`;

NavLink.propTypes = {
  label: PropTypes.string,
  to: PropTypes.string,
  className: PropTypes.string,
  activeOnlyWhenExact: PropTypes.bool
}

export default NavLink;