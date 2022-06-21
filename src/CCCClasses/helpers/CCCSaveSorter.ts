import { CCCSave } from "../../apiTypes/CCCSave";
import { CCCEnv } from "../CCCEnv";

export abstract class CCCSaveComparator {
    label: string;
    abstract compare(a: CCCSave, b: CCCSave) : number;
}

let comparators: CCCSaveComparator[] =  [
    {
        label: "Time",
        compare: (a, b) => b.time - a.time,
    },
    {
        label: "Cookies",
        compare: (a, b) => b.time - a.time
    },
    {
        label: "Lumps",
        compare: (a, b) => b.lumps - a.time
    },
    {
        label: "CpS",
        compare: (a, b) => b.cps - a.cps
    },
    {
        label: "Name",
        compare: (a, b) => a.name.localeCompare(b.name)
    },
    {
        label: "Browserlabel",
        compare: (a, b) => {
            if (!a.browserlabel) { return -1; }
            if (!b.browserlabel) { return 1; }
            a.browserlabel.localeCompare(b.browserlabel)
        }
    }
];

export function getComparators() : CCCSaveComparator[] {
    return comparators;
}

export function getCurrentSorter(env: CCCEnv) : CCCSaveComparator {
    return getComparators()[parseInt(env.settings.get("sorter"))];
}