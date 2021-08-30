import React, { ReactElement } from "react";
import { CharacterAscensionSpecs } from "./genshin/CharacterAscensionSpec";
import { CascaderValueType, CascaderOptionType } from 'antd/lib/cascader';
import { Cascader, Form, Select } from "antd";
import { SelectValue } from 'antd/lib/select';

import { CharacterBuild } from "./genshin/CharacterBuild";
import { WeaponBuild } from "./genshin/WeaponBuild";
import { MaterialTableData } from "./MaterialTable";
import MaterialData from "./Data.json";

type MaterialDataKey = keyof typeof MaterialData;

const { Option } = Select;

export interface BuildFormProps {
    desired: boolean;
    char: CharacterBuild;
    setChar: React.Dispatch<React.SetStateAction<CharacterBuild>>;
    wep:WeaponBuild;
    setWep: React.Dispatch<React.SetStateAction<WeaponBuild>>;
    inventory?: MaterialTableData[];
    setInventory?: React.Dispatch<React.SetStateAction<MaterialTableData[]>>;
}


function BuildForm(props: BuildFormProps): ReactElement {
    const char = props.char;
    const setChar = props.setChar;
    const wep = props.wep;
    const setWep = props.setWep;
    const inv = props.inventory;

    // ===============================
    // CHARACTER
    // ===============================
    let characterAscensionOptions: CascaderOptionType[] = [];
    let talentLevelOptions: JSX.Element[] = [];
    function updateInventory(newLevel: number, oldLevel: number, property: MaterialDataKey) {
        // Check if inventory was passed in.
        if (inv && props.setInventory) {
            const isDecreasing: boolean = oldLevel > newLevel;
            const min = isDecreasing ? newLevel : oldLevel;
            const max = isDecreasing ? oldLevel : newLevel;
            const propertyData = MaterialData[property];
            type levelKeyType = keyof typeof propertyData;
            // Iterate over the range of levels to add or subtract to current inventory.
            for (let level in propertyData) {
                if (+level > min && +level <= max) {
                    const levelMaterials: MaterialTableData[] = propertyData[level as levelKeyType];
                    levelMaterials.forEach(material => {
                        // If-statements to not insert 0's into the table.
                        if (material.tier1) inv[Number(material.material)].tier1! += material.tier1 * (isDecreasing ? -1 : 1);
                        if (!inv[Number(material.material)].tier2 && material.tier2) inv[Number(material.material)].tier2 = 0;
                        if (material.tier2) inv[Number(material.material)].tier2! += material.tier2 * (isDecreasing ? -1 : 1);
                        if (!inv[Number(material.material)].tier3 && material.tier3) inv[Number(material.material)].tier3 = 0;
                        if (material.tier3) inv[Number(material.material)].tier3! += material.tier3 * (isDecreasing ? -1 : 1);
                        if (!inv[Number(material.material)].tier4 && material.tier4) inv[Number(material.material)].tier4 = 0;
                        if (material.tier4) inv[Number(material.material)].tier4! += material.tier4 * (isDecreasing ? -1 : 1);
                    })
                }
            }
            props.setInventory(inv);
        }
    }
    function changeMaxTalentLevel(oldLevel: number, maxLevel: number): number {
        let newLevel = Math.min(oldLevel, maxLevel);
        if (oldLevel !== newLevel) {
            updateInventory(newLevel, oldLevel, "talentLevel");
        }
        return newLevel;
    }
    const changeCharacterAscensionHandler = (values: CascaderValueType) => {
        const characterAscension = values[0] as number;
        updateInventory(characterAscension, char.characterAscension, "characterAscension");

        const characterLevel = values[1] as number;
        updateInventory(characterLevel, char.characterLevel, "characterLevel");

        const maxLevel = CharacterAscensionSpecs[characterAscension].maximumTalentLevel;
        char.normalTalentLevel = changeMaxTalentLevel(char.normalTalentLevel, maxLevel);
        char.skillTalentLevel = changeMaxTalentLevel(char.skillTalentLevel, maxLevel);
        char.burstTalentLevel = changeMaxTalentLevel(char.burstTalentLevel, maxLevel);
        
        char.characterAscension = values[0] as number;
        char.characterLevel = values[1] as number;
        setChar((char: CharacterBuild) => ({...char}));
    }
    const changeNormalLevelHandler = (value: SelectValue) => {
        const level = value?.valueOf() as number;
        updateInventory(level, char.normalTalentLevel, "talentLevel");
        char.normalTalentLevel = level;
        setChar((char: CharacterBuild) => ({...char}));
    }
    const changeSkillLevelHandler = (value: SelectValue) => {
        const level = value?.valueOf() as number;
        updateInventory(level, char.skillTalentLevel, "talentLevel");
        char.skillTalentLevel = level;
        setChar((char: CharacterBuild) => ({...char}));
    }
    const changeBurstLevelHandler = (value: SelectValue) => {
        const level = value?.valueOf() as number;
        updateInventory(level, char.burstTalentLevel, "talentLevel");
        char.burstTalentLevel = level;
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
        const weaponAscension = values[0] as number;
        let property: MaterialDataKey = "weaponAscension" + wep.weaponStars as MaterialDataKey;
        updateInventory(weaponAscension, wep.weaponAscension, property);

        const weaponLevel = values[1] as number;
        property = "weaponLevel" + wep.weaponStars as MaterialDataKey;
        updateInventory(weaponLevel, wep.weaponLevel, property);

        wep.weaponAscension = weaponAscension;
        wep.weaponLevel = weaponLevel;
        setWep((wep: WeaponBuild) => ({...wep}));
    }
    const changeWeaponStarsHandler = (value: SelectValue) => {
        const weaponStars = value as number;
        // Reset back to 0, then recalculate with new star data.
        let property: MaterialDataKey = "weaponAscension" + wep.weaponStars as MaterialDataKey;
        updateInventory(0, wep.weaponAscension, property);
        property = "weaponAscension" + weaponStars as MaterialDataKey;
        updateInventory(wep.weaponAscension, 0, property);

        property = "weaponLevel" + wep.weaponStars as MaterialDataKey;
        updateInventory(0, wep.weaponLevel, property);
        property = "weaponLevel" + weaponStars as MaterialDataKey;
        updateInventory(wep.weaponLevel, 0, property);

        wep.weaponStars = weaponStars;
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
                <Cascader value={[char.characterAscension, char.characterLevel]} allowClear={false} options={characterAscensionOptions} onChange={changeCharacterAscensionHandler}/>
                <br/>
                <label>Normal Attack Talent Level: </label>
                <Select listHeight={320} value={char.normalTalentLevel} onChange={changeNormalLevelHandler}>{talentLevelOptions}</Select>
                <br/>
                <label>Elemental Skill Talent Level: </label>
                <Select listHeight={320} value={char.skillTalentLevel} onChange={changeSkillLevelHandler}>{talentLevelOptions}</Select>
                <br/>
                <label>Elemental Burst Talent Level: </label>
                <Select listHeight={320} value={char.burstTalentLevel} onChange={changeBurstLevelHandler}>{talentLevelOptions}</Select>

                <h2>Input {formType} weapon build</h2>
                <label>Weapon Ascension / Weapon Level: </label>
                <Cascader value={[wep.weaponAscension, wep.weaponLevel]} allowClear={false} options={weaponAscensionOptions} onChange={changeWeaponAscensionHandler}/>
                <br/>
                <label>Weapon Stars: </label>
                <Select value={wep.weaponStars} onChange={changeWeaponStarsHandler}>
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