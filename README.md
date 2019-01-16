# Cookie Clicker Cloud

Cookie Clicker Cloud is an Webextension which allows you to sync your CookieClicker game with other browsers and to backup your savegame.
You can save as many games you want :)

CCC is free to use and will stay free. You savegame is located on an own server, where nobody has access.

An free account is required for use.

This is a free time project.

## Release builden
Benötigt NodeJS v10.12.0

    npm install
    npm run build

## Kommandos
npm run
 - **watch**: Baut das Addon im Debug Mode in ./dist
 - **build**: Baut das fertige Addon im Prod Mode in ./ccc_v_v_v (z.B. ./ccc_2_1_1)
 - **release**: Führt build aus, packt den Ordner in den Zip ./ccc_v_v_v.zip (z.B. ./ccc_2_1_1.zip) welcher hochgeladen werden kann und fügt die Quellen in einen Zip in ../ccc_v_v_v_sources.zip (ohne .git, .vscode, node_modules)

## Debug features aktivieren
Konsole öffnen und `localStorage.debug = 1` sagen

## Erste Version
18.11.2016 - v1.0

## Verzeichnisse
|Ordername|Beschreibung|
|---|---|
|/build_tools|Hier liegen JS Dateien, welche zum Bauen der App verwendet werden|
|/content|Hier liegen statische Dateien wie HTML, Bilder etc. welche in die App rein kopiert werden|
|/dist|Das fertige Plugin liegt nach dem Bauen hier|
|/src|Hier liegen dynamische Dateien, welche beim Bauen genutzt werden z.B. Typescript Quellen oder Sass Dateien|
|/webpack|Hier liegen WebPack Konfigurationen|
|/manifest.json|Die Extention Manifest|