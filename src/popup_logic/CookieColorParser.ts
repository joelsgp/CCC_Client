import Axios from "axios";

interface CookieColorDefinition {
    color: string,
    min: number,
    white_textcolor: boolean,
    label: string,
    replace?: boolean
}

export interface CookieColor {
    value: string;
    background: string;
    textcolor: string;
}

export class CookieColorParser {
    private colorDefinitions: Array<CookieColorDefinition>;

    constructor() {
        Axios.get("/resources/cookie_colors.json")
            .then((d) => {
                this.colorDefinitions = d.data;
            })
            .catch((d) => {
                console.log(d);
            });
    }

    parse(cookies: number): CookieColor {
        let factor = 0;
        for (let i = this.colorDefinitions.length - 1; i >= 0; i--) {
            factor = Math.pow(10, this.colorDefinitions[i].min);
            if (cookies > factor) {
                let value : string;
                if (this.colorDefinitions[i].replace) {
                    value = this.colorDefinitions[i].label;
                }
                else if (factor == 1) {
                    value = cookies.toFixed(0);
                }
                else {
                    value = (cookies / factor).toFixed(3) + this.colorDefinitions[i].label;
                }

                return {
                    value: value,
                    background: "#" + this.colorDefinitions[i].color,
                    textcolor: (this.colorDefinitions[i].white_textcolor) ? "#fff" : "#000"
                };
            }
        }
    }

    backeryName(name: string) : string {
        if (name.slice(-1).toLowerCase()=='s') name+='\' bakery'; else name+='\'s bakery';			
        return name;
    }
}