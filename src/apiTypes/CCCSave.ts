export type CCCSave = {
    name: string;
    cookies: number;
    wrinkler: number;
    cps?: number;
    lumps?: number;
    time?: number;
    browserlabel?: string|null;
    save?: string;
}

export function getPlainCCCSave() : CCCSave {
    return {
        name: "undefined",
        cookies: 0,
        wrinkler: 0,
        cps: 0,
        lumps: 0
    };
}