const fs = require("fs");
const path = require("path");
const admzip = require("adm-zip");
const helpers = require("../webpack/helpers");

const nonSourcesContent = [
    "node_modules",
    ".vscode",
    ".git"
];

function packReleaseZip() {
    let releaseDir = helpers.getReleaseDir();
    let from = path.resolve(releaseDir);
    let zipPath = path.join(from, ".zip")
    let zip = new admzip();
    console.log("Pack " + from);
    zip.addLocalFolder(from);
    zip.writeZip( path.resolve(zipPath) );
    console.log("Release zip created! " + zipPath);
}

function packMozillaSource() {
    let sourcesPath = path.resolve("..");
    let releaseDir = helpers.getReleaseDir();
    let zipPath = path.resolve(releaseDir + "_sources.zip");
    let zip = new admzip();

    for (let file of fs.readdirSync(sourcesPath)) {
        // Hide elements
        if (!nonSourcesContent.includes(file) || file.indexOf("ccc_") === -1) {
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

    console.log("Source packed! " + sourcesZipPath);
}

packReleaseZip();
packMozillaSource();
