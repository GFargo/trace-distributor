import React from 'react';
import PropTypes from 'prop-types';
import posed, { PoseGroup } from 'react-pose';
import { Link } from 'gatsby';

import { Layout as CoreLayout } from '../../core/src/layouts';

const RoutesContainer = posed.div({
  enter: { opacity: 1, delay: 75, delayChildren: 125 },
  exit: { opacity: 0 },
});

function Layout({ children }) {
  return (
    <CoreLayout
      isFluid
      isFooterFluid
      headerLinkComponent={Link}
      headerContainerClassName=""
      headerIsFluid
      headerNav={[
        {
          route: '/',
          title: 'Home',
        },
        {
          route: '/about/',
          title: 'About',
        },
        {
          route: '/404/',
          title: '404',
        },
      ].map(link => (
        <Link
          className="block md:inline-block mt-4 md:mt-0 md:ml-6 no-underline text-black"
          key={link.title}
          to={link.route}
        >
          {link.title}
        </Link>
      ))}
      footerIsFluid
    >
      <PoseGroup animateOnMount flipMove={false}>
        <RoutesContainer key="layout_children" className="mx-auto">
          {children}
        </RoutesContainer>
      </PoseGroup>
    </CoreLayout>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
