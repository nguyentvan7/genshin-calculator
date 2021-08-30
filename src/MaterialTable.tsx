import { Form, FormInstance, InputNumber, Table } from "antd";
import React, { ReactElement, useContext, useEffect, useRef } from "react";
import { CharacterBuild } from "./genshin/CharacterBuild";
import { WeaponBuild } from "./genshin/WeaponBuild";
import MaterialData from "./Data.json";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

type MaterialDataKey = keyof typeof MaterialData;
type CharacterBuildKey = keyof CharacterBuild;
type WeaponBuildKey = keyof WeaponBuild;

export interface DesiredTableProps {
    desiredInv: MaterialTableData[];
}

export interface InventoryTableProps {
    currentInv: MaterialTableData[];
    setCurrentInv: React.Dispatch<React.SetStateAction<MaterialTableData[]>>;
}

export interface ConverterTableProps {
    currentInv: MaterialTableData[];
    desiredInv: MaterialTableData[];
}

export interface MaterialTableData {
    key?: number;
    material: number;
    tier1?: number;
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

const MaterialTierMap = new Map<number, number>([
    [Material.Gem, 4],
    [Material.Boss, 1],
    [Material.EXPBook, 3],
    [Material.Local, 1],
    [Material.CommonChar, 3],
    [Material.TalentBook, 3],
    [Material.Weekly, 1],
    [Material.Crown, 1],
    [Material.Ore, 3],
    [Material.Weapon, 4],
    [Material.CommonWep1, 3],
    [Material.CommonWep2, 3],
    [Material.Mora, 1],
]);

const columns = [
    {
        title: "Material",
        dataIndex: "material",
        key: "material",
        width: "36%",
        render: (value:any) => Material[value]
        //todo: change render option to adjust based on if what is in the inventory is enough to cover what is needed.
    },
    {
        title: "Tier 1",
        dataIndex: "tier1",
        key: "tier 1",
        width: "16%",
        editable: true,
        render: (value:any) => value ? value.toLocaleString(): ""
    },
    {
        title: "Tier 2",
        dataIndex: "tier2",
        key: "tier 2",
        width: "16%",
        editable: true,
        render: (value:any) => value ? value.toLocaleString(): ""
    },
    {
        title: "Tier 3",
        dataIndex: "tier3",
        key: "tier 3",
        width: "16%",
        editable: true,
        render: (value:any) => value ? value.toLocaleString(): ""
    },
    {
        title: "Tier 4",
        dataIndex: "tier4",
        key: "tier 4",
        width: "16%",
        editable: true,
        render: (value:any) => value ? value.toLocaleString(): ""
    },
]

export function generateBlankData(): MaterialTableData[] {
    return Object.keys(Material).filter(key => !isNaN(Number(key))).map(val => {
        return { key: Number(val), material: Number(val), tier1: 0}
    });
}

// ===============================
// VIEWONLY TABLES
// ===============================

function DesiredTable(props: DesiredTableProps): ReactElement {
    let data: MaterialTableData[] = props.desiredInv;
    return (
        <div>
            <Table columns={columns} dataSource={data} pagination={false}/>
        </div>
    );
}

function ConverterTable(props: ConverterTableProps): ReactElement {
    let data: MaterialTableData[] = generateBlankData();
    
    // Iterate over each material.
    props.currentInv.forEach(material => {
        let convertToTier2 = 3;
        let convertToTier3 = 3;
        let tiers = MaterialTierMap.get(material.material);
        if (material.material === Material.EXPBook) {
            convertToTier2 = 5;
            convertToTier3 = 4;
        }
        else if (material.material === Material.Ore) {
            convertToTier2 = 5;
            convertToTier3 = 5;
        }
    });

    return (
        <div>
            <Table columns={columns} dataSource={data} pagination={false}/>
        </div>
    );
}

// ===============================
// EDITABLE TABLE
// ===============================
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
        props.setCurrentInv!(newInv);
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
            <Table components={editableComponents} columns={editableColumns} dataSource={props.currentInv} pagination={false}/>
        </div>
    );
}

export { DesiredTable, InventoryTable, ConverterTable };