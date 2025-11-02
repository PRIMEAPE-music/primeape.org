import React from 'react';
import './Header.css';

/**
 * Header Component
 *
 * Site header with artist name and album title.
 *
 * Phase 1: Simple header with text
 * Phase 9: Will add theme toggle button
 */
const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__logo">
          <span className="header__artist">PRIMEAPE</span>
          <span className="header__divider">|</span>
          <span className="header__album">FOUNDATION</span>
        </h1>
        {/* Theme toggle will be added in Phase 9 */}
      </div>
    </header>
  );
};

export default Header;
