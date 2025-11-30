import React from 'react';
import Footer from './Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component
 *
 * Main layout wrapper that provides consistent structure across the site.
 * Includes Footer, with children rendered in the main content area.
 *
 * @param children - Page content to be rendered between Header and Footer
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <main className="layout__main">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
