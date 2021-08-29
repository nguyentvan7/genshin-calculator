import React from 'react';
import './App.css';
import BuildForm from './BuildForm';
import { DesiredTable, generateBlankData, InventoryTable, MaterialTableData } from './MaterialTable';
import { Divider } from 'antd';
import { CharacterBuild } from './genshin/CharacterBuild';
import { WeaponBuild } from './genshin/WeaponBuild';

// Used to store and load state from localstorage.
function useStoredState<Type>(defaultValue: Type, key: string): [Type, React.Dispatch<React.SetStateAction<Type>>] {
  const [state, setState] = React.useState<Type>(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) as Type : defaultValue;
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

function App() {
  // Generate or load state from localstorage.
  const [desiredChar, setDesiredChar] = useStoredState<CharacterBuild>(new CharacterBuild(), "desiredChar");
  const [desiredWep, setDesiredWep] = useStoredState<WeaponBuild>(new WeaponBuild(), "desiredWep");
  const [currentChar, setCurrentChar] = useStoredState<CharacterBuild>(new CharacterBuild(), "currentChar");
  const [currentWep, setCurrentWep] = useStoredState<WeaponBuild>(new WeaponBuild(), "currentWep");
  const [currentInv, setCurrentInv] = useStoredState<MaterialTableData[]>(generateBlankData() as MaterialTableData[], "currentInv");

  return (
    <div className="App">
      <h1>Genshin Character Resource Calculator</h1>
      <BuildForm desired={true} char={desiredChar} setChar={setDesiredChar} wep={desiredWep} setWep={setDesiredWep}></BuildForm>
      <br></br>
      <Divider></Divider>
      <br></br>
      <BuildForm desired={false} char={currentChar} setChar={setCurrentChar} wep={currentWep} setWep={setCurrentWep}></BuildForm>
      <br></br>
      <Divider></Divider>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ margin: "10px", flex: '0 0 900px', width: "900px" }}><DesiredTable desiredChar={desiredChar} desiredWep={desiredWep}></DesiredTable></div>
        <div style={{ margin: "10px", flex: '0 0 900px', width: "900px" }}><InventoryTable currentInv={currentInv} setCurrentInv={setCurrentInv}></InventoryTable></div>
      </div>
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