import React from 'react';
import { BrowserRouter, Routes ,Route,useParams} from 'react-router-dom';
import Dashboard from './components/Dashboard';

const App=()=> {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/potaling' element={<Dashboard window={true} />} />
        <Route path='/potaling/:page' element={<Child />} />
        <Route path="*" element={<div>404 page not found.</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export const Child = (props) => {
  const { page } = useParams()
  return (
    <Dashboard page={page} window={false} />
  )
}

export default App;
