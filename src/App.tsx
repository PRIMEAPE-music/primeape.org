import React from 'react';
import Layout from './components/Layout/Layout';
import './styles/global.css';

/**
 * App Component
 *
 * Root component of the application.
 *
 * Phase 1: Basic layout structure with placeholder content
 * Phase 2+: Will add Player and other sections
 */
const App: React.FC = () => {
  return (
    <Layout>
      <div
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--font-size-4xl)',
            marginBottom: 'var(--space-lg)',
            color: 'var(--color-text-primary)',
          }}
        >
          PRIMEAPE - FOUNDATION
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--line-height-relaxed)',
          }}
        >
          Music player coming soon...
        </p>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--space-lg)',
          }}
        >
          Phase 1: Project foundation complete ✓
        </p>
      </div>
    </Layout>
  );
};

export default App;
