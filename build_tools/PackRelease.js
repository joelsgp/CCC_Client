const admzip = require("adm-zip");
const helpers = require("../webpack/helpers");
const path = require("path");
const fs = require("fs");

const nonSourcesContent = [
    "node_modules",
    ".vscode",
    ".git"
];

function packReleaseZip() {
    let buildDirName = helpers.getNameForReleaseFolder();
    let from = path.resolve(buildDirName);
    let zip = new admzip();
    console.log("Pack "+from);
    zip.addLocalFolder(from);
    zip.writeZip( path.resolve(buildDirName+".zip" ) );
    console.log("Release ZIP erstellt! "+path.resolve(buildDirName+".zip" ));
}

function packMozillaSource() {
    let sourcesPath = path.resolve(".");
    let sourcesZipPath = path.resolve("../"+helpers.getNameForReleaseFolder()+"_sources.zip");
    let zip = new admzip();

    for (let file of fs.readdirSync(sourcesPath)) {
        // Hide elements
        if (!nonSourcesContent.includes(file)) {
            let filePath = path.join(sourcesPath, file);
            let stats = fs.lstatSync( filePath );
            if (stats.isDirectory()) {
                zip.addLocalFolder( filePath, file );
            }
            else {
                zip.addLocalFile( filePath );
            }
        }
    }

    //zip.addLocalFolder(path.resolve("."));
    zip.writeZip( sourcesZipPath );

    console.log("Quelle gepackt in: " + sourcesZipPath);
}

packReleaseZip();
packMozillaSource();