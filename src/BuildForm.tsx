import React, { ReactElement } from "react";
import { CharacterAscensionSpecs } from "./genshin/CharacterAscensionSpec";
import { CascaderValueType, CascaderOptionType } from 'antd/lib/cascader';
import { Cascader, Form, Select } from "antd";
import { SelectValue, OptionType } from 'antd/lib/select';
import { OptionData } from "rc-select/lib/interface";

import { CharacterBuild } from "./genshin/CharacterBuild";
import { WeaponBuild } from "./genshin/WeaponBuild";

const { Option } = Select;

let char = new CharacterBuild();
let wep = new WeaponBuild();

export interface BuildFormProps {
    desired: boolean;
}

function BuildForm(props: BuildFormProps): JSX.Element {
    const [characterAscension, setCharacterAscension] = React.useState(0);
    const [characterLevel, setCharacterLevel] = React.useState(1);
    const [normalLevel, setNormalLevel] = React.useState(1);
    const [skillLevel, setSkillLevel] = React.useState(1);
    const [burstLevel, setBurstLevel] = React.useState(1);

    const [weaponAscension, setWeaponAscension] = React.useState(0);
    const [weaponLevel, setWeaponLevel] = React.useState(1);
    const [weaponStars, setWeaponStars] = React.useState(4);

    // ===============================
    // CHARACTER
    // ===============================
    let characterAscensionOptions: CascaderOptionType[] = [];
    let talentLevelOptions: JSX.Element[] = [];
    const changeCharacterAscensionHandler = (values: CascaderValueType) => {
        setCharacterAscension(values[0] as number);
        setCharacterLevel(values[1] as number);
        console.log(normalLevel + " " + CharacterAscensionSpecs[characterAscension].maximumTalentLevel + " " + characterAscension);
        const maxLevel = CharacterAscensionSpecs[values[0] as number].maximumTalentLevel;
        setNormalLevel(Math.min(normalLevel, maxLevel));
        setSkillLevel(Math.min(skillLevel, maxLevel));
        setBurstLevel(Math.min(burstLevel, maxLevel));
        char.characterAscension = values[0] as number;
        char.characterLevel = values[1] as number;
    }
    const changeNormalLevelHandler = (value: SelectValue) => {
        setNormalLevel(value?.valueOf() as number);
        char.normalTalentLevel = value?.valueOf() as number;
    }
    const changeSkillLevelHandler = (value: SelectValue) => {
        setSkillLevel(value?.valueOf() as number);
        char.skillTalentLevel = value?.valueOf() as number;
    }
    const changeBurstLevelHandler = (value: SelectValue) => {
        setBurstLevel(value?.valueOf() as number);
        char.burstTalentLevel = value?.valueOf() as number;
    }
    const maxLevel = CharacterAscensionSpecs[characterAscension].maximumTalentLevel;
    for (let level = 1; level <= maxLevel; level++) {
        talentLevelOptions.push(<Option value={level} key={level}>{level}</Option>);
    }
    CharacterAscensionSpecs.forEach(function (ca) {
        characterAscensionOptions.push(BuildAscensionCascaderOption(ca.ascensionLevel, ca.minimumCharacterLevel, ca.maximumCharacterLevel));
    });

    // ===============================
    // WEAPON
    // ===============================
    let weaponAscensionOptions: CascaderOptionType[] = [];
    const changeWeaponAscensionHandler = (values: CascaderValueType) => {
        setWeaponAscension(values[0] as number);
        setWeaponLevel(values[1] as number);
        wep.weaponAscension = values[0] as number;
        wep.weaponLevel = values[1] as number;
    }
    const changeWeaponStarsHandler = (value: SelectValue) => {
        setWeaponStars(value as number);
        wep.weaponStars = value as number;
    }
    CharacterAscensionSpecs.forEach(function (ca) {
        weaponAscensionOptions.push(BuildAscensionCascaderOption(ca.ascensionLevel, ca.minimumCharacterLevel, ca.maximumCharacterLevel));
    });

    const formType = props.desired ? "desired" : "current";
    return (
        <div>
            <Form id={formType+"Form"}>
                <h2>Input {formType} character build</h2>
                <label>Character Ascension / Character Level: </label>
                <Cascader options={characterAscensionOptions} onChange={changeCharacterAscensionHandler}></Cascader>
                <br></br>
                <label>Normal Attack Talent Level: </label>
                <Select value={normalLevel} onChange={changeNormalLevelHandler}>{talentLevelOptions}</Select>
                <br></br>
                <label>Elemental Skill Talent Level: </label>
                <Select value={skillLevel} onChange={changeSkillLevelHandler}>{talentLevelOptions}</Select>
                <br></br>
                <label>Elemental Burst Talent Level: </label>
                <Select value={burstLevel} onChange={changeBurstLevelHandler}>{talentLevelOptions}</Select>

                <h2>Input {formType} weapon build</h2>
                <label>Weapon Ascension / Weapon Level: </label>
                <Cascader options={weaponAscensionOptions} onChange={changeWeaponAscensionHandler}></Cascader>
                <br></br>
                <label>Weapon Stars: </label>
                <Select value={weaponStars} onChange={changeWeaponStarsHandler}>
                    <Option value={3} key={3}>3</Option>
                    <Option value={4} key={4}>4</Option>
                    <Option value={5} key={5}>5</Option>
                </Select>
            </Form>
        </div>
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

export default BuildForm