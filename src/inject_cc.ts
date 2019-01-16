import { CCCAPIInformation, HeaderMap } from "./CCCClasses/CCCAPIInformation";
import { CCCSave } from "./apiTypes/CCCSave";
import { CCCAPI } from "./CCCClasses/CCCAPI";

declare var Game: any;

declare global {
    interface Window {
        cccEmbedd: CCCEmbeddedFeatures;
    }
}

class CCCEmbeddedFeatures implements CCCAPIInformation {
    private bannerNode: HTMLElement;
    private intervalId: number;
    private api: CCCAPI;

    constructor() {
        this.bannerNode = document.getElementById("CCC_banner_node");
        this.intervalId = -1;
        this.api = new CCCAPI(this);
        window.addEventListener("keydown", (e)=>this.onKeyDown(e));
        window.addEventListener("message", (e)=>this.onMessage(e), false);

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

    upload() : void {
        let save: CCCSave = {
            name: Game.bakeryName,
            cookies: Math.floor(Game.cookies),
            wrinkler: 0,
            lumps: Game.lumps > 0 ? Math.floor(Game.lumps) : 0,
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

    async load(savename: string) {
        let saveGame = await this.api.getSave(savename);
        Game.LoadSave(saveGame.save);
    }

    auto(interval: number) {
        if (this.intervalId == -1) {
            this.intervalId = setInterval(()=>this.upload, interval);
            this.upload();
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
            this.upload();
            e.preventDefault();
        }
    }

    onMessage(ev: MessageEvent) : void {
        try {
            let data = JSON.parse( ev.data );
            if (data.cccCommand) {
                switch (data.cccCommand) {
                    case "load":
                        if (data.name) {
                            this.load(data.name);
                        }
                        break;
                    case "upload":
                        this.upload();
                        break;
                    case "auto":
                        if (data.interval) {
                            this.auto(data.interval);
                        }
                        break;
                    default:
                        console.error("CCC_Inject Wrong Command", data);
                }
            }
        }
        catch (e) {
            // Ignore
        }
    }
}

window.cccEmbedd = new CCCEmbeddedFeatures();