import { CCCAPIInformation, HeaderMap } from "./CCCClasses/CCCAPIInformation";
import { CCCSave } from "./apiTypes/CCCSave";
import { CCCAPI } from "./CCCClasses/CCCAPI";
import { CCCTransfereCommand, UploadCommand, LoadCommand, AutoCommand } from "./CCCClasses/transfer/CCCTransfereMessage";
import { CCCTransfereListener } from "./CCCClasses/transfer/CCCTransfereListener";

declare var Game: any;

declare global {
    interface Window {
        cccEmbedd: CCCEmbeddedFeatures;
    }
}

class CCCEmbeddedFeatures extends CCCTransfereListener implements CCCAPIInformation {
    private bannerNode: HTMLElement;
    private intervalId: number;
    private api: CCCAPI;

    constructor() {
        super();
        this.bannerNode = document.getElementById("CCC_banner_node");
        this.intervalId = -1;
        this.api = new CCCAPI(this);

        window.addEventListener("keydown", (e)=>this.onKeyDown(e));

        if (this.token === undefined) {
            this.showMessage("Please login on CCC on the addon popup");
        }

        this.messageOfTheDay();
    }

    private async messageOfTheDay() {
        let motd = await this.api.getMessageOfTheDay();
        Game.customTickers.push(()=>[
            motd.motd.content+"<sig>CookieClickerCloud</sig>"
        ]);
    }

    get token(): string {
        return this.bannerNode.dataset.token;
    }

    get baseUrl(): string {
        let url: string;
        if (this.bannerNode.dataset.url !== undefined){
            url = this.bannerNode.dataset.url;
        }
        else {
            url = "https://cc.timia2109.com/v2.php";
        }
        return url;
    }

    getApiHeaders(): HeaderMap {
        return {};
    }

    showMessage(message: string) : void {
        Game.Notify(message, "by CookieClickerCloud", 1);
    }

    upload(upload: UploadCommand) : void {
        let save: CCCSave = {
            name: Game.bakeryName,
            cookies: Math.floor(Game.cookies),
            wrinkler: 0,
            lumps: Game.lumps && Game.lumps > 0 ? Math.floor(Game.lumps) : 0,
            save: Game.WriteSave(1),
            cps: Math.floor(Game.cookiesPs - (Game.cookiesPs*(Game.cpsSucked)))
        };

        // Calc Wrinkler Cookies
        Game.wrinklers.forEach(e => {
            save.wrinkler += e.sucked;
        });
        save.wrinkler = Math.floor(save.wrinkler);

        console.log(save);

        this.api.putSave(save)
            .then(()=>{
                this.showMessage("Game was uploaded :)");
            })
            .catch(()=>{
                this.showMessage("Error on uploading :/");
            });
    }

    async load(command: LoadCommand) {
        let saveGame = await this.api.getSave(command.name);
        Game.LoadSave(saveGame.save);
    }

    auto(command: AutoCommand) {
        if (this.intervalId == -1) {
            this.intervalId = setInterval(()=>this.upload, command.interval);
            this.upload(null);
        }
        else {
            clearInterval(this.intervalId);
        }
    }

    onKeyDown(e: KeyboardEvent) : void {
        if (e.ctrlKey &&
            (e.keyCode === 67 ||
                e.keyCode === 86 ||
                e.keyCode === 85 ||
                e.keyCode === 117)) {
            this.upload(null);
            e.preventDefault();
        }
    }
}

window.cccEmbedd = new CCCEmbeddedFeatures();