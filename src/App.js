import React from 'react';
import { BrowserRouter, Routes ,Route,useParams,useLocation} from 'react-router-dom';
import Dashboard from './components/Dashboard';

const App=()=> {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/potaling' element={<Child />} />
        <Route path="*" element={<div>404 page not found.</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export const Child = () => {
  const location = useLocation();
  const arg=getArg(location.search);
  if(arg["page"]){
    return (
      <Dashboard page={arg["page"]} window={false} />
    )
  }else{
    return (
      <Dashboard window={true} />
    )
  }
}

const getArg=(search)=>{
  var arg = new Object;
  var pair=search.substring(1).split('&');
  for(var i=0;pair[i];i++) {
      var kv = pair[i].split('=');
      arg[kv[0]]=kv[1];
  }
  return arg;
}

export default App;
