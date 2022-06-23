const fs = require("fs");
const path = require("path");


function getManifest() {
    return JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../manifest.json"),
            "utf-8"
        )
    );
}

export function outputDir(outname) {
    let outpath = path.join( __dirname, outname );

    if (!fs.existsSync(outpath)) {
        fs.mkdirSync(outpath, { recursive: true });
    }

    return outpath;
}

export function getReleaseName() {
    let manifest = getManifest();
    let version = manifest.version.split(".").join("_");
    let releaseName = "ccc_" + version;
    return releaseName;
}

export function getReleaseDir() {
    let releaseName = getReleaseName();
    let releasePath = `../dist/${releaseName}/js`;
    let releaseDir = outputDir(releasePath);
    return releaseDir;
}
