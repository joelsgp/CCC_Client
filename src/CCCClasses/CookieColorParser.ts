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
    parse(cookies: number): CookieColor {
        let factor = 0;
        for (let i = cookieColorDefinitions.length - 1; i >= 0; i--) {
            factor = Math.pow(10, cookieColorDefinitions[i].min);
            if (cookies > factor) {
                let value : string;
                if (cookieColorDefinitions[i].replace) {
                    value = cookieColorDefinitions[i].label;
                }
                else if (factor == 1) {
                    value = cookies.toFixed(0);
                }
                else {
                    value = (cookies / factor).toFixed(3) + cookieColorDefinitions[i].label;
                }

                return {
                    value: value,
                    background: "#" + cookieColorDefinitions[i].color,
                    textcolor: (cookieColorDefinitions[i].white_textcolor) ? "#fff" : "#000"
                };
            }
        }
    }

    backeryName(name: string) : string {
        if (name.slice(-1).toLowerCase()=='s') name+='\' bakery'; else name+='\'s bakery';			
        return name;
    }
}

let cookieColorDefinitions: Array<CookieColorDefinition> = [
    {
        "color": "7b1fa2",
        "min": 0,
        "white_textcolor": true,
        "label": ""
    },
    {
        "color": "512da8",
        "min": 6,
        "white_textcolor": true,
        "label": " million"
    },
    {
        "color": "303f9f",
        "min": 9,
        "white_textcolor": true,
        "label": " billion"
    },
    {
        "color": "1976d2",
        "min": 12,
        "white_textcolor": false,
        "label": " trillion"
    },
    {
        "color": "0097a7",
        "min": 15,
        "white_textcolor": false,
        "label": " quadrillion"
    },
    {
        "color": "00796b",
        "min": 18,
        "white_textcolor": true,
        "label": " quintillion"
    },
    {
        "color": "388e3c",
        "min": 21,
        "white_textcolor": false,
        "label": " sextillion"
    },
    {
        "color": "689f38",
        "min": 24,
        "white_textcolor": false,
        "label": " septillion"
    },
    {
        "color": "afb42b",
        "min": 27,
        "white_textcolor": false,
        "label": " octillion"
    },
    {
        "color": "fbc02d",
        "min": 30,
        "white_textcolor": false,
        "label": " nonillion"
    },
    {
        "color": "ffa000",
        "min": 33,
        "white_textcolor": false,
        "label": " decillion"
    },
    {
        "color": "f57c00",
        "min": 36,
        "white_textcolor": false,
        "label": " undecillion"
    },
    {
        "color": "e64a19",
        "min": 39,
        "white_textcolor": false,
        "label": " duodecillion"
    },
    {
        "color": "795548",
        "min": 42,
        "white_textcolor": true,
        "label": " tredecillion"
    },
    {
        "color": "5d4037",
        "min": 45,
        "white_textcolor": true,
        "label": " quattuordecillion"
    },
    {
        "color": "616161",
        "min": 48,
        "white_textcolor": true,
        "label": " quindecillion"
    },
    {
        "color": "1B2631",
        "min": 51,
        "white_textcolor": true,
        "label": "Infinity", 
        "replace": true
    }
];