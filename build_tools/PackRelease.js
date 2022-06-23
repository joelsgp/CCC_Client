const fs = require("fs");
const path = require("path");
const admzip = require("adm-zip");
const helpers = require("../webpack/helpers");

function getIgnore() {
    let gitignore = fs.readFileSync(".gitignore", "utf-8");
    let lines = gitignore.split("\n").filter(Boolean);
    let ignore = new RegExp(lines.join("|"))
    return lines
}

function packReleaseZip() {
    let releaseDir = helpers.getReleaseDir();
    let from = path.resolve(releaseDir);
    let releaseName = helpers.getReleaseName();
    let zipPath = path.resolve(`./dist/${releaseName}.zip`)
    let zip = new admzip();
    console.log("Pack " + from);
    zip.addLocalFolder(from);
    zip.writeZip( path.resolve(zipPath) );
    console.log("Release zip created! " + zipPath);
}

function packMozillaSource() {
    let sourcesPath = path.resolve(".");
    console.log("Pack sources " + sourcesPath)
    let releaseName = helpers.getReleaseName();
    let zipPath = path.resolve(`./dist/${releaseName}_sources.zip`)
    let zip = new admzip();

    let ignore = getIgnore();
    for (let file of fs.readdirSync(sourcesPath)) {
        // Hide elements
        if (file.startsWith(".") || ignore.includes(file)) {
            continue;
        }

        // Add to zip
        let filePath = path.join(sourcesPath, file);
        let stats = fs.lstatSync( filePath );
        if (stats.isDirectory()) {
            zip.addLocalFolder( filePath, file );
        }
        else {
            zip.addLocalFile( filePath );
        }
    }

    zip.writeZip( zipPath );
    console.log("Source packed! " + zipPath);
}

packReleaseZip();
packMozillaSource();
