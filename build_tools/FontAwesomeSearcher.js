/*
 *  Search all FontAwesome Icons that I use in this project and generate the imports in ~/src/CCCClasses/fontawesome.ts
 *  Should run as first task of building 
 */

const fs = require("fs");
const path = require("path");

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
    let string = "import { library, icon, dom } from '@fortawesome/fontawesome-svg-core';";
    let lib = [];
    
    let fas = Array.from( icons.get("fas") ).sort();
    let fab = Array.from( icons.get("fab") ).sort();
    // fas
    for (let icon of fas) {
        let faKey = createName(icon);
        lib.push( faKey );
        string += `\nimport { ${faKey} } from '@fortawesome/pro-solid-svg-icons/${faKey}';`
    }

    //fab
    for (let icon of fab) {
        let faKey = createName(icon);
        lib.push( faKey );
        string += `\nimport { ${faKey} } from '@fortawesome/free-brands-svg-icons/${faKey}';`;
    }

    return fs.readFileSync( path.join("build_tools", "faHeader.txt"), "utf-8")+string+"\n\nexport function initFA(): void {\n    library.add("+ lib.sort().join(",\n        ") +"\n    );\n"+
        "    dom.watch();\n}";
}

readDir( path.resolve("content") );
readDir( path.resolve("src") );
let src = formatFAImports(icons);

fs.writeFileSync( path.join("src", "CCCClasses", "fontawesome.ts"), src, "utf-8" );