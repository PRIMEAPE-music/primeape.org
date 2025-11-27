import React from 'react';
import './Footer.css';

/**
 * Footer Component
 *
 * Site footer with copyright information and credits.
 *
 * Phase 1: Basic copyright info
 * Phase 6: Will add social links
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__copyright">
          © {currentYear} PRIMEAPE. All rights reserved.
        </p>
        <p className="footer__credits">This site uses analytics</p>
      </div>
    </footer>
  );
};

export default Footer;
