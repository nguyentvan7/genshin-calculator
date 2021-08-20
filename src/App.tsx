import React from 'react';
import './App.css';
import BuildForm from './BuildForm';
import { Divider } from 'antd';
import { CharacterBuild } from './genshin/CharacterBuild';
import { WeaponBuild } from './genshin/WeaponBuild';

function App() {
  const [desiredChar, setDesiredChar] = React.useState<CharacterBuild>(new CharacterBuild());
  let [desiredWep, setDesiredWep] = React.useState<WeaponBuild>(new WeaponBuild());
  let [currentChar, setCurrentChar] = React.useState<CharacterBuild>(new CharacterBuild());
  let [currentWep, setCurrentWep] = React.useState<WeaponBuild>(new WeaponBuild());

  return (
    <div className="App">
      <h1>Genshin Character Resource Calculator</h1>
      <BuildForm desired={true} char={desiredChar} setChar={setDesiredChar} wep={desiredWep} setWep={setDesiredWep}></BuildForm>
      <br></br>
      <Divider></Divider>
      <br></br>
      <BuildForm desired={false} char={currentChar} setChar={setCurrentChar} wep={currentWep} setWep={setCurrentWep}></BuildForm>
      <br></br>
      <br></br>
      {JSON.stringify(desiredChar)}
      {JSON.stringify(desiredWep)}
      <Divider></Divider>
      {JSON.stringify(currentChar)}
      {JSON.stringify(currentWep)}
    </div>
  );
}

export default App;