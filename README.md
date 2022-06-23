# Cookie Clicker Cloud

Cookie Clicker Cloud is a borwser extension which allows you to sync your Cookie Clicker game with other browsers and to backup your savegame.
You can save as many games you want :)

CCC is free to use and will stay free. You savegame is located on an own server, where nobody has access.

A free account is required for use.

## Release build
Requires NodeJS LTS Gallium (16)

    npm install
    npm run release

## Commands
npm run
 - **watch**: Builds the extension in debug mode in ./dist/
 - **build**: Builds the finished extension in prod mode in ./dist/ccc_v_v_v/ (e.g. ccc_1_2_3)
 - **release**: Runs build, packs the folder into the zip ccc_v_v_v.zip which can be uploaded, and adds the sources to a zip in ccc_v_v_v_sources.zip

## Activate debug features
Open browser console and run `localStorage.debug = 1`

## First version
2016-11-18 -- v1.0.0

## Directories and files
| Path | Description |
|---|---|
| build_tools/ | JS files used to build the app |
| content/ | Static files such as HTML, images etc. which are copied into the app |
| dist/ | The finished extension is here after builds |
| src/ | Here are dynamic files that are used during build, e.g. Typescript sources or Sass files |
| webpack/ | Webpack configurations |
| manifest.json | Extension manifest |
