import React, { ReactElement } from "react";
import { CharacterAscensionSpecs } from "./genshin/CharacterAscensionSpec";
import { CascaderValueType, CascaderOptionType } from 'antd/lib/cascader';
import { Cascader, Form, Select } from "antd";
import { SelectValue, OptionType } from 'antd/lib/select';
import { OptionData } from "rc-select/lib/interface";

import { CharacterBuild } from "./genshin/CharacterBuild";
import { WeaponBuild } from "./genshin/WeaponBuild";

const { Option } = Select;
//let char: CharacterBuild;
//let setChar: React.Dispatch<React.SetStateAction<CharacterBuild>>;
//let wep:WeaponBuild;
//let setWep: React.Dispatch<React.SetStateAction<WeaponBuild>>;

export interface BuildFormProps {
    desired: boolean;
    char: CharacterBuild;
    setChar: React.Dispatch<React.SetStateAction<CharacterBuild>>;
    wep:WeaponBuild;
    setWep: React.Dispatch<React.SetStateAction<WeaponBuild>>;
}
//export interface BuildFormProps {
//    desired: boolean;
//    char: CharacterBuild;
//    test(a: CharacterBuild): void;
//    test2: React.Dispatch<React.SetStateAction<CharacterBuild>>;
//}

function BuildForm(props: BuildFormProps): JSX.Element {
    const char = props.char;
    const setChar = props.setChar;
    const wep = props.wep;
    const setWep = props.setWep;

    // ===============================
    // CHARACTER
    // ===============================
    let characterAscensionOptions: CascaderOptionType[] = [];
    let talentLevelOptions: JSX.Element[] = [];
    const changeCharacterAscensionHandler = (values: CascaderValueType) => {
        const maxLevel = CharacterAscensionSpecs[values[0] as number].maximumTalentLevel;
        char.normalTalentLevel = Math.min(char.normalTalentLevel, maxLevel);
        char.skillTalentLevel = Math.min(char.skillTalentLevel, maxLevel);
        char.burstTalentLevel = Math.min(char.burstTalentLevel, maxLevel);
        char.characterAscension = values[0] as number;
        char.characterLevel = values[1] as number;
        setChar((char: CharacterBuild) => ({...char}));
    }
    const changeNormalLevelHandler = (value: SelectValue) => {
        char.normalTalentLevel = value?.valueOf() as number;
        setChar((char: CharacterBuild) => ({...char}));
    }
    const changeSkillLevelHandler = (value: SelectValue) => {
        char.skillTalentLevel = value?.valueOf() as number;
        setChar((char: CharacterBuild) => ({...char}));
    }
    const changeBurstLevelHandler = (value: SelectValue) => {
        char.burstTalentLevel = value?.valueOf() as number;
        setChar((char: CharacterBuild) => ({...char}));
    }
    const maxLevel = CharacterAscensionSpecs[char.characterAscension].maximumTalentLevel;
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
        wep.weaponAscension = values[0] as number;
        wep.weaponLevel = values[1] as number;
        setWep((wep: WeaponBuild) => ({...wep}));
    }
    const changeWeaponStarsHandler = (value: SelectValue) => {
        wep.weaponStars = value as number;
        setWep((wep: WeaponBuild) => ({...wep}));
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
                <Cascader allowClear={false} options={characterAscensionOptions} onChange={changeCharacterAscensionHandler}></Cascader>
                <br></br>
                <label>Normal Attack Talent Level: </label>
                <Select value={char.normalTalentLevel} onChange={changeNormalLevelHandler}>{talentLevelOptions}</Select>
                <br></br>
                <label>Elemental Skill Talent Level: </label>
                <Select value={char.skillTalentLevel} onChange={changeSkillLevelHandler}>{talentLevelOptions}</Select>
                <br></br>
                <label>Elemental Burst Talent Level: </label>
                <Select value={char.burstTalentLevel} onChange={changeBurstLevelHandler}>{talentLevelOptions}</Select>

                <h2>Input {formType} weapon build</h2>
                <label>Weapon Ascension / Weapon Level: </label>
                <Cascader allowClear={false} options={weaponAscensionOptions} onChange={changeWeaponAscensionHandler}></Cascader>
                <br></br>
                <label>Weapon Stars: </label>
                <Select value={wep.weaponStars} onChange={changeWeaponStarsHandler}>
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