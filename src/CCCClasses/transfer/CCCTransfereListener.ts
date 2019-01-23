import { LoadCommand, UploadCommand, AutoCommand, CCCTransfereCommand } from "./CCCTransfereMessage";

export type LoadCommandListener = (load: LoadCommand) => void;
export type UploadCommandListener = (upload: UploadCommand) => void;
export type AutoCommandListener = (auto: AutoCommand) => void;

export class CCCTransfereListener {

    loadListener: LoadCommandListener;
    uploadListener: UploadCommandListener;
    autoListener: AutoCommandListener;

    private listener: (listener: MessageEvent) => void;

    constructor() {
        this.listener = (m)=>this.onMessage(m);
    }

    public on() : void {
        window.addEventListener("message", this.listener, false);
    }

    public off() : void {
        window.removeEventListener("message", this.listener);
    }

    private onMessage(ev: MessageEvent) : void {
        try {
            let m = <CCCTransfereCommand> JSON.parse( ev.data );
            switch (m.cccCommand) {
                case "load": 
                    this.loadListener(<LoadCommand>m);
                    break;
                case "upload":
                    this.uploadListener(<UploadCommand>m);
                    break;
                case "auto":
                    this.autoListener(<AutoCommand>m);
                    break;
            }
        } catch (e){}
    }
}