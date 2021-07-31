import React, { ReactElement } from 'react';
import { Cascader, Form, Select } from "antd";
import { CascaderValueType, CascaderOptionType } from 'antd/lib/cascader';
import './App.css';

import { OptionData } from "rc-select/lib/interface";
import { CharacterAscensionSpecs } from "./genshin/CharacterAscensionSpec";
import { CharacterBuild } from "./genshin/CharacterBuild";
import { WeaponBuild } from "./genshin/WeaponBuild";
import { SelectValue, OptionType } from 'antd/lib/select';

const { Option } = Select;

let char = new CharacterBuild();
let wep = new WeaponBuild();

function App() {
  return (
    <div className="App">
      <h1>Genshin Character Resource Calculator</h1>
      <h2>Input desired character build</h2>
      {BuildCharacterForm()}
      <h2>Input desired weapon build</h2>
      {BuildWeaponForm()}
    </div>
  );
}

function BuildCharacterForm() {
  const [characterAscension, setCharacterAscension] = React.useState(0);
  const [characterLevel, setCharacterLevel] = React.useState(1);
  const [maximumTalentLevel, setMaximumTalentLevel] = React.useState(1);
  const [normalLevel, setNormalLevel] = React.useState(1);
  const [skillLevel, setSkillLevel] = React.useState(1);
  const [burstLevel, setBurstLevel] = React.useState(1);
  let characterAscensionOptions: CascaderOptionType[] = [];
  let talentLevelOptions: JSX.Element[] = [];

  const changeCharacterAscensionHandler = (values: CascaderValueType) => {
    setCharacterAscension(values[0] as number);
    setCharacterLevel(values[1] as number);
    console.log(normalLevel + " " + CharacterAscensionSpecs[characterAscension].maximumTalentLevel + " " + characterAscension);
    const maxLevel = CharacterAscensionSpecs[values[0] as number].maximumTalentLevel;
    setMaximumTalentLevel(maxLevel)
    setNormalLevel(Math.min(normalLevel, maxLevel));
    setSkillLevel(Math.min(skillLevel, maxLevel));
    setBurstLevel(Math.min(burstLevel, maxLevel));
  }
  const changeNormalLevelHandler = (value: SelectValue) => {
    setNormalLevel(value?.valueOf() as number);
  }
  for (let level = 1; level <= maximumTalentLevel; level++) {
    talentLevelOptions.push(<Option value={level} key={level}>{level}</Option>);
  }
  CharacterAscensionSpecs.forEach(function(ca) {
    characterAscensionOptions.push(BuildAscensionCascaderOption(ca.ascensionLevel, ca.minimumCharacterLevel, ca.maximumCharacterLevel));
  });
  return (
    <Form id="characterForm">
      <label>Character Ascension / Character Level: </label>
      <Cascader options={characterAscensionOptions} onChange={changeCharacterAscensionHandler}></Cascader>
      <br></br>
      <label>Normal Attack Talent Level: </label>
      <Select value={normalLevel} onChange={changeNormalLevelHandler}>{talentLevelOptions}</Select>
      <label>Elemental Skill Talent Level: </label>
      <Select>{talentLevelOptions}</Select>
      <label>Elemental Burst Talent Level: </label>
      <Select>{talentLevelOptions}</Select>
    </Form>
  );
}

function BuildAscensionCascaderOption(ascension: number, min_level: number, max_level: number): CascaderOptionType {
  return {
      value: ascension,
      label: "Ascension " + ascension,
      children: [
        {
          value: min_level,
          label: "Level " + min_level
        },
        {
          value: max_level,
          label: "Level " + max_level
        }
      ]
    };
}

function BuildWeaponForm() {
  const [weaponAscension, setWeaponAscension] = React.useState(0);
  const [wearponLevel, setWeaponLevel] = React.useState(1);
  let weaponAscensionOptions: CascaderOptionType[] = [];

  const changeWeaponAscensionHandler = (values: CascaderValueType) => {
    setWeaponAscension(values[0] as number);
    setWeaponLevel(values[1] as number);
  }
  CharacterAscensionSpecs.forEach(function(ca) {
    weaponAscensionOptions.push(BuildAscensionCascaderOption(ca.ascensionLevel, ca.minimumCharacterLevel, ca.maximumCharacterLevel));
  });

  return (
    <Form id="weaponForm">
      <label>Character Ascension / Character Level: </label>
      <Cascader options={weaponAscensionOptions}></Cascader>
    </Form>
  )
}

export default App;
