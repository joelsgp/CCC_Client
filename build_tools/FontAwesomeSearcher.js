const fs = require("fs");
const path = require("path");

let filesFolder = path.join("..", "content");

// string => Set<string>
// fas => [user, cloud]
let icons = new Map();

function insert(type, icon) {
    if (!icons.has(type)) {
        icons.set(type, new Set());
    }
    icons.get(type).add(icon);
}

function readDir(dir) {
    console.log("Scan Dir: "+dir);
    for (let file of fs.readdirSync(dir)) {
        let cPath = path.join(dir, file);
        if (fs.lstatSync( cPath ).isDirectory()) {
            readDir( cPath );
        }
        else {
            const faRegex = /(fas|fab)\ fa-((\w|\-)*)/gm;
            let m;

            let content = fs.readFileSync( cPath, "utf-8" );
            while ((m = faRegex.exec(content)) !== null) {
                if (m.index === faRegex.lastIndex) {
                    faRegex.lastIndex++;
                }

                insert(m[1], m[2]);
            }
        }
    }
}

function createName(faName) {
    let use = "fa"+faName[0].toUpperCase();
    for (let i=1; i < faName.length; i++) {
        if (faName[i] == "-") {
            i++;
            use += faName[i].toUpperCase();
        }
        else {
            use += faName[i];
        }
    }
    return use;
}

function formatFAImports(icons) {
    let string = "import { library, dom } from '@fortawesome/fontawesome';";
    let lib = [];
    
    // fas
    for (let icon of icons.get("fas")) {
        let faKey = createName(icon);
        lib.push( faKey );
        string += `\nimport { ${faKey} } from '@fortawesome/pro-solid-svg-icons';`
    }

    //fab
    for (let icon of icons.get("fab")) {
        let faKey = createName(icon);
        lib.push( faKey );
        string += `\nimport { ${faKey} } from '@fortawesome/pro-brands-svg-icons';`;
    }

    return string+"\n\nexport function initFA(): void { library.add("+ lib.join(",") +"); }";
}

readDir( filesFolder );
console.log( formatFAImports(icons) );