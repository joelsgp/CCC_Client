let getManifest = ()=>{
    let fs = require("fs");
    let path = require("path");

    return JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../manifest.json"),
            "utf-8"
            )
    );
};

let output = (outname) => {
    let fs = require("fs");
    let path = require("path");
    let outpath = path.join( __dirname, outname );

    if (!fs.existsSync(outpath)) {
        fs.mkdirSync(outpath);
    }

    return outpath;
};

let getNameForReleaseFolder = () => {
    return "ccc_"
    + getManifest().version.split(".").join("_");
};

let getNameForRelease = ()=>{
    return output("../"+getNameForReleaseFolder())+"/js";
};

module.exports = {output, getManifest, getNameForRelease, getNameForReleaseFolder};