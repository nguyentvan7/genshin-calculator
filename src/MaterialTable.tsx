import { Table } from "antd";
import React, { ReactElement } from "react";
import { CharacterBuild } from "./genshin/CharacterBuild";
import { WeaponBuild } from "./genshin/WeaponBuild";
//const MaterialData = require("./Data.json");
import MaterialData from "./Data.json";
import { ColumnsType } from "antd/lib/table";

type MaterialDataKey = keyof typeof MaterialData;
type CharacterBuildKey = keyof CharacterBuild;
type WeaponBuildKey = keyof WeaponBuild;

export interface DesiredTableProps {
    desiredChar: CharacterBuild;
    desiredWep: WeaponBuild;
}

export interface InventoryTableProps {
}

interface MaterialTableData {
    key?: number;
    material: string;
    tier1: number;
    tier2?: number;
    tier3?: number;
    tier4?: number;
}

enum Material {
    Gem,
    Boss,
    EXPBook,
    Local,
    CommonChar,
    TalentBook,
    Weekly,
    Crown,
    Ore,
    Weapon,
    CommonWep1,
    CommonWep2,
    Mora
}

const columns: ColumnsType<object> = [
    {
        title: "Material",
        dataIndex: "material",
        key: "material",
        //todo: change render option to adjust based on if what is in the inventory is enough to cover what is needed.
    },
    {
        title: "Tier 1",
        dataIndex: "tier1",
        key: "tier 1",
        render: value => <p>{value.toLocaleString()}</p>
    },
    {
        title: "Tier 2",
        dataIndex: "tier2",
        key: "tier 2"
    },
    {
        title: "Tier 3",
        dataIndex: "tier3",
        key: "tier 3"
    },
    {
        title: "Tier 4",
        dataIndex: "tier4",
        key: "tier 4"
    },
]

function generateBlankData(): MaterialTableData[] {
    return Object.keys(Material).filter(key => !isNaN(Number(key))).map(val => {
        return { key: Number(val), material: Material[Number(val)], tier1: 0 }
    });
}

function DesiredTable(props: DesiredTableProps): ReactElement {
    let data: MaterialTableData[] = generateBlankData();
    console.log(Object.keys(props.desiredChar));
    console.log(Object.keys(props.desiredWep));

    // Iterate over each character property.
    const charKeys: CharacterBuildKey[] = Object.keys(props.desiredChar) as CharacterBuildKey[];
    for (let index in charKeys) {
        let matKey: MaterialDataKey;
        if (charKeys[index].includes("TalentLevel")) matKey = "talentLevel" as MaterialDataKey;
        else matKey = charKeys[index] as MaterialDataKey;
        let desiredLevel = props.desiredChar[charKeys[index]];
        let levelData = MaterialData[matKey];
        type key = keyof typeof levelData;
        // Iterate over each level.
        for (let level in levelData) {
            if (Number(level) > desiredLevel) break;
            // Iterate over each material.
            const mats: MaterialTableData[] = levelData[level as key];
            mats.forEach(mat => {
                if (mat.tier1) data[Number(mat.material)].tier1 += mat.tier1;
                if (!data[Number(mat.material)].tier2 && mat.tier2) data[Number(mat.material)].tier2 = 0;
                if (mat.tier2) data[Number(mat.material)].tier2! += mat.tier2;
                if (!data[Number(mat.material)].tier3 && mat.tier3) data[Number(mat.material)].tier3 = 0;
                if (mat.tier3) data[Number(mat.material)].tier3! += mat.tier3;
                if (!data[Number(mat.material)].tier4 && mat.tier4) data[Number(mat.material)].tier4 = 0;
                if (mat.tier4) data[Number(mat.material)].tier4! += mat.tier4;
            });
        }
    }

    // Iterate over each weapon property.
    const wepKeys: WeaponBuildKey[] = Object.keys(props.desiredWep) as WeaponBuildKey[];
    for (let index in wepKeys) {
        let matKey: MaterialDataKey;
        if (wepKeys[index] === "weaponStars") continue;
        matKey = wepKeys[index] + props.desiredWep.weaponStars as MaterialDataKey;
        let desiredLevel = props.desiredWep[wepKeys[index]];
        let levelData = MaterialData[matKey];
        type key = keyof typeof levelData;
        // Iterate over each level.
        for (let level in levelData) {
            if (Number(level) > desiredLevel) break;
            // Iterate over each material.
            const mats: MaterialTableData[] = levelData[level as key];
            mats.forEach(mat => {
                if (mat.tier1) data[Number(mat.material)].tier1 += mat.tier1;
                if (!data[Number(mat.material)].tier2 && mat.tier2) data[Number(mat.material)].tier2 = 0;
                if (mat.tier2) data[Number(mat.material)].tier2! += mat.tier2;
                if (!data[Number(mat.material)].tier3 && mat.tier3) data[Number(mat.material)].tier3 = 0;
                if (mat.tier3) data[Number(mat.material)].tier3! += mat.tier3;
                if (!data[Number(mat.material)].tier4 && mat.tier4) data[Number(mat.material)].tier4 = 0;
                if (mat.tier4) data[Number(mat.material)].tier4! += mat.tier4;
            });
        }
    }

    return (
        <div>
            <Table columns={columns} dataSource={data} pagination={false}></Table>
        </div>
    );
}

function InventoryTable(props: InventoryTableProps): ReactElement {
    //const datum = generateDatum(Materials.Boss);
    //let data = [datum];
    //return (
    //    <div>
    //        <Table columns={columns} dataSource={data} pagination={false}></Table>
    //    </div>
    //);
    //for (var k in MaterialData.CharacterLevel) {
    //    console.log(k); //prints 20,40,50,60,70,80,90
    //}
    return(<div>{JSON.stringify(generateBlankData())}</div>);
}

export {DesiredTable, InventoryTable};