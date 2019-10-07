import React from "react";
import { CCCSave } from "../../apiTypes/CCCSave";
import { CookieColor } from "../../CCCClasses/helpers/CookieColorParser";
import { CCCEnv } from "../../CCCClasses/CCCEnv";
import { CardText, Badge, Table } from "reactstrap";
import moment from "moment";

type ViewObject = {
    key: string;
    value: string;
    badgeKey?: string;
}

export abstract class AttrMode {

    protected views: ViewObject[] = [];

    abstract name: string;

    protected abstract render(): JSX.Element;

    private push(key: string, value: string, badgeKey?: string) {
        this.views.push({ key, value, badgeKey });
    }

    private createElements(save: CCCSave, cookiesObj: CookieColor, env: CCCEnv) {
        this.push("Cookies", cookiesObj.value);

        if (save.cps !== undefined) {
            this.push("CpS", env.colorParser.parse(save.cps).value);
        }

        if (save.wrinkler > 0) {
            var wrinklerObj = env.colorParser.parse(save.wrinkler);
            this.push("Wrinkler Cookies", wrinklerObj.value);
        }

        if (save.lumps !== undefined && save.lumps > 0) {
            var lumpsObj = env.colorParser.parse(save.lumps);
            this.push("Sugar Lumps", lumpsObj.value);
        }

        if (save.browserlabel) {
            this.push("Browser Label", save.browserlabel, "Uploaded on: ");
        }

        this.push("Last update", moment((save.time as number) * 1000).format("LLL"), "Last update on: ");
    }

    public getJSX(save: CCCSave, cookiesObj: CookieColor, env: CCCEnv): JSX.Element {
        this.views = [];
        this.createElements(save, cookiesObj, env);
        return this.render();
    }
}

class TableAttrMode extends AttrMode {

    name = "Table";

    render(): JSX.Element {
        return <Table size="sm">
            <tbody>
                {
                    this.views.map(e => <tr>
                        <th scope="row">{e.key}</th>
                        <td>
                            <Badge>{e.value}</Badge>
                        </td>
                    </tr>)
                }
            </tbody>
        </Table>;
    }
}

class SlimAttrMode extends AttrMode {

    name = "Badges";

    render(): JSX.Element {
        let badgeText = this.views.map(e => {
            if (e.badgeKey) {
                return e.badgeKey + e.value;
            }
            else {
                return e.value + " " + e.key;
            }
        });

        return <CardText>
            {
                badgeText.map(e => <Badge className="mr-1">
                    {e}
                </Badge>)
            }
        </CardText>;
    }
}

let attrModes = [
    new TableAttrMode(),
    new SlimAttrMode()
];

export function GetGameAttrModes(): AttrMode[] {
    return attrModes;
}

export function getCurrentAttrMode(env: CCCEnv): AttrMode {
    return GetGameAttrModes()[
        Number(env.settings.get("attrMode"))
    ];
}