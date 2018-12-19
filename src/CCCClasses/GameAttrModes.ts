export type AttrMode = {
    name: string,
    desc: string
};

export function GetGameAttrModes() : AttrMode[] {
    return [
        { name: "Table", desc: "Show all Attributes in a table (classic mode)" },
        { name: "Slim", desc: "Show all Attributes as Small Badges" }
    ];
}