import React from 'react';
import './App.css';
import BuildForm from './BuildForm';
import { DesiredTable, generateBlankData, InventoryTable, MaterialTableData, ConverterTable } from './MaterialTable';
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
  const [desiredInv, setDesiredInv] = React.useState<MaterialTableData[]>(generateBlankData());
  const [currentInv, setCurrentInv] = useStoredState<MaterialTableData[]>(generateBlankData() as MaterialTableData[], "currentInv");

  return (
    <div className="App">
      <h1>Genshin Character Resource Calculator</h1>
      <BuildForm desired={true} char={desiredChar} setChar={setDesiredChar}
        wep={desiredWep} setWep={setDesiredWep}
        inventory={desiredInv} setInventory={setDesiredInv}
      />
      <br/>
      <Divider/>
      <br/>
      <BuildForm desired={false} char={currentChar} setChar={setCurrentChar} wep={currentWep} setWep={setCurrentWep}/>
      <br/>
      <Divider/>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div className="table-div"><DesiredTable desiredInv={desiredInv}/></div>
        <div className="table-div"><InventoryTable currentInv={currentInv} setCurrentInv={setCurrentInv}/></div>
      </div>
      <div className="table-div"><ConverterTable desiredInv={desiredInv} currentInv={currentInv}/></div>
    </div>
  );
}

export default App;