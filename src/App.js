import React from 'react';
import Dashboard from './components/Dashboard';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>ポタリングの記録（実験版）</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@t_mat" />
        <meta property="og:url" content="https://termat.github.io/potaling/" />
        <meta property="og:title" content="ポタリングの記録（実験版）" />
        <meta property="og:description" content="ポタリングした地域を3D地図上で俯瞰するWebアプリです。" /> 
        <meta property="og:image" content={`${window.location.origin}/images/back.jpg`} />
      </Helmet>
      <Dashboard />
    </HelmetProvider>
  );
}

export default App;
