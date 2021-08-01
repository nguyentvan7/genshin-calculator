import React, { ReactElement } from 'react';
import './App.css';
import BuildForm from './BuildForm';

function App() {
  return (
    <div className="App">
      <h1>Genshin Character Resource Calculator</h1>
      <BuildForm desired={true}></BuildForm>
      <br></br>
      <BuildForm desired={false}></BuildForm>
    </div>
  );
}

export default App;