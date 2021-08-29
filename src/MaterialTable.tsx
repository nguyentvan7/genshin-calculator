import { Form, FormInstance, InputNumber, Table } from "antd";
import React, { ReactElement, useContext, useEffect, useRef } from "react";
import { CharacterBuild } from "./genshin/CharacterBuild";
import { WeaponBuild } from "./genshin/WeaponBuild";
import MaterialData from "./Data.json";

type MaterialDataKey = keyof typeof MaterialData;
type CharacterBuildKey = keyof CharacterBuild;
type WeaponBuildKey = keyof WeaponBuild;

export interface DesiredTableProps {
    desiredChar: CharacterBuild;
    desiredWep: WeaponBuild;
}

export interface InventoryTableProps {
    currentInv: MaterialTableData[];
    setCurrentInv: React.Dispatch<React.SetStateAction<MaterialTableData[]>>;
}

export interface MaterialTableData {
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

const columns = [
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
        editable: true,
        render: (value:any) => value ? value.toLocaleString(): ""
    },
    {
        title: "Tier 2",
        dataIndex: "tier2",
        key: "tier 2",
        editable: true,
    },
    {
        title: "Tier 3",
        dataIndex: "tier3",
        key: "tier 3",
        editable: true,
    },
    {
        title: "Tier 4",
        dataIndex: "tier4",
        key: "tier 4",
        editable: true,
    },
]

export function generateBlankData(): MaterialTableData[] {
    return Object.keys(Material).filter(key => !isNaN(Number(key))).map(val => {
        return { key: Number(val), material: Material[Number(val)], tier1: 0 }
    });
}

function DesiredTable(props: DesiredTableProps): ReactElement {
    let data: MaterialTableData[] = generateBlankData();

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

    // TODO: modularize this with above.
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

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr className="editable-row" {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof MaterialTableData;
    material: MaterialTableData;
    saveHandler: (record: MaterialTableData) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    material,
    saveHandler,
    ...restProps
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const form = useContext(EditableContext)!;
    const firstLoad = useRef<boolean>(true);

    useEffect(() => {
        if (firstLoad.current) {
            if (dataIndex && material[dataIndex]) {
                form.setFieldsValue({ [dataIndex]: material[dataIndex] });
            }
            firstLoad.current = false;
        }
    }, [dataIndex, material, form]);

    const save = async () => {
        try {
            const values = await form.validateFields();
            saveHandler({ ...material, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;
    if (editable) {
        childNode = (
            <Form.Item className="editable-input" name={dataIndex}>
                <InputNumber id={dataIndex + material.material}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value ? value.replace(/\$\s?|(,*)/g, ''): ""}
                    ref={inputRef} onChange={save} bordered={true} autoComplete="off"/>
            </Form.Item>
        );
    }
    return <td id="editable-cell" {...restProps}>{childNode}</td>;
};

function InventoryTable(props: InventoryTableProps): ReactElement {
    const saveHandler = (row: MaterialTableData) => {
        const newInv = [...props.currentInv];
        const index = newInv.findIndex(item => row.key === item.key);
        const material = newInv[index];
        newInv.splice(index, 1, {
            ...material,
            ...row
        });
        props.setCurrentInv(newInv);
    };

    const editableComponents = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const editableColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (material: MaterialTableData) => ({
                        title: col.title,
                        editable: col.editable ?? false,
                        dataIndex: col.dataIndex,
                        saveHandler: saveHandler,
                        material: material,
            }),
        };
    });

    return (
        <div>
            <Table components={editableComponents} columns={editableColumns} dataSource={props.currentInv} pagination={false}></Table>
        </div>
    );
}

export { DesiredTable, InventoryTable };