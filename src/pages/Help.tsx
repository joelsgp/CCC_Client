import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faHeart, faQuestion, faListUl, faGlobe, IconDefinition, faClock } from "@fortawesome/free-solid-svg-icons";
import { ListGroupItem, ListGroup } from "reactstrap";
import React from "react";
import { faReact, faBootstrap, faFontAwesome } from "@fortawesome/free-brands-svg-icons";
import { getUri } from "../openDocs";

type ThanksEntry = {
    name: string,
    href?: string,
    icon?: IconDefinition,
    expl: string
};

let thankEntrys: ThanksEntry[] = [
    {
        name: "Orteil",
        expl: "created the game & I took some functions from him",
        href: "https://orteil.dashnet.org/"
    },
    {
        icon: faBootstrap,
        name: "Bootstrap",
        expl: "css framework",
        href: "https://getbootstrap.com"
    },
    {
        icon: faReact,
        name: "react",
        expl: "Popup Javascript Libary",
        href: "https://reactjs.org"
    },
    {
        name: "JQuery",
        expl: "JavaScript Extention",
        href: "https://jquery.com"
    },
    {
        icon: faFontAwesome,
        name: "Font Awesome",
        expl: "Icons",
        href: "https://fontawesome.com"
    },
    {
        name: "Showdown",
        expl: "Markdown Parser",
        href: "http://showdownjs.com/"
    },
    {
        icon: faClock,
        name: "moment.js",
        expl: "Time parser / formatter",
        href: "http://momentjs.com/"
    },
    {
        icon: faHeart,
        name: "Jenin",
        expl: "for translating"
    }
];

export function HelpComponent(): JSX.Element {
    return <>
        <h2>
            <FontAwesomeIcon icon={faQuestionCircle} />
            Help me!
        </h2>
        <ul className="list-group">
            <a className="list-group-item list-group-item-action" href={getUri("FAQ")} target="_blank">
                <FontAwesomeIcon icon={faQuestion} />
                <strong>FAQ</strong>
            </a>
            <a className="list-group-item list-group-item-action btnChangelog" href={getUri("Changelog")} target="_blank">
                <FontAwesomeIcon icon={faListUl} />
                <strong>Changelog</strong>
            </a>
            <a className="list-group-item list-group-item-action" href="https://timia2109.com/category/ccc/" target="_blank">
                <FontAwesomeIcon icon={faGlobe} />
                <strong>Homepage</strong>
            </a>
        </ul>

        <h2 className="mt-1">Thanks to:</h2>
        <ListGroup>
            {
                thankEntrys.map(t => {
                    let body: JSX.Element[] = [];

                    if (t.icon) {
                        body.push(<FontAwesomeIcon icon={t.icon} />);
                    }
                    body.push(<><strong>{t.name}</strong> {t.expl}</>);

                    let wrapper: JSX.Element;

                    if (t.href) {
                        wrapper =
                            <a href={t.href} target="_blank">
                                {body}
                            </a>;
                    }
                    else {
                        wrapper = <>{body}</>;
                    }

                    return <ListGroupItem key={"thx-" + t.name} action>
                        {wrapper}
                    </ListGroupItem>
                })
            }
        </ListGroup>
    </>;
}