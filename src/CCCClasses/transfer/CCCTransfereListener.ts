import { LoadCommand, UploadCommand, AutoCommand, CCCTransfereCommand } from "./CCCTransfereMessage";

export type LoadCommandListener = (load: LoadCommand) => void;
export type UploadCommandListener = (upload: UploadCommand) => void;
export type AutoCommandListener = (auto: AutoCommand) => void;

export abstract class CCCTransfereListener {

    constructor() {
        window.addEventListener("message", (m)=>this.onMessage(m), false);
    }

    abstract load(command: LoadCommand): any;
    abstract upload(command: UploadCommand): any;
    abstract auto(command: AutoCommand): any;

    private onMessage(ev: MessageEvent) : void {
        try {
            let m = <CCCTransfereCommand> JSON.parse( ev.data );
            switch (m.cccCommand) {
                case "load": 
                    this.load(<LoadCommand>m);
                    break;
                case "upload":
                    this.upload(<UploadCommand>m);
                    break;
                case "auto":
                    this.auto(<AutoCommand>m);
                    break;
            }
        } catch (e){}
    }
}