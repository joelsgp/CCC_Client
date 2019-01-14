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

function formatFAImports() {
    
}

readDir( filesFolder );
console.log( icons );