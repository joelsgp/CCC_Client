/**
 * Manifest Loader
 * (removes URLs from prod. Build)
 */

const fs = require("fs");
const path = require("path");

class ManifestPlugin {

    constructor(manifestPath, outPath) {
        this.manifestPath = path.resolve( __dirname, manifestPath );
        this.outPath = path.resolve( __dirname, outPath );
    }

    addForDebugManifest(manifest) {
        manifest.permissions.push("http://itserver:82/*");
        manifest.permissions.push("https://timia2109.ddns.net/*");

        return manifest;
    }

    apply(compiler) {

        let manifestContent = JSON.parse( fs.readFileSync(this.manifestPath, "utf-8") );

        if (compiler.options.mode == "development") {
            manifestContent = this.addForDebugManifest(manifestContent);
        }

        fs.writeFileSync(this.outPath, JSON.stringify(manifestContent, null, 4), "utf-8");
    }
}

module.exports = ManifestPlugin;