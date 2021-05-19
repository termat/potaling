import React from 'react';
import Dashboard from './components/Dashboard';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>ポタリングの記録（実験版）</title>
      </Helmet>
      <Dashboard />
    </HelmetProvider>
  );
}

export default App;
