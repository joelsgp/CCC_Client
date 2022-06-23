const { exec } = require("child_process");
const path = require("path");
const admzip = require("adm-zip");
const helpers = require("../webpack/helpers");


function packReleaseZip() {
    let releaseName = helpers.getReleaseName();
    let releasePath = "./dist/" + releaseName;
    let from = path.resolve(releasePath);
    let zipPath = path.resolve(`./dist/${releaseName}.zip`);
    
    console.log("Pack " + from);
    let zip = new admzip();
    zip.addLocalFolder(from);
    zip.writeZip( path.resolve(zipPath) );
    console.log("Release zip created! " + zipPath);
}

function packMozillaSource() {
    let releaseName = helpers.getReleaseName();
    let zipPath = `./dist/${releaseName}_sources.zip`

    console.log("Pack sources from git HEAD")
    exec(`git archive -o "${zipPath}" HEAD`);
    console.log("Source packed! " + zipPath);
}

packReleaseZip();
packMozillaSource();
