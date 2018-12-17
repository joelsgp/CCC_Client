import { CCCEnv } from "./CCCEnv";
import axios from 'axios';

type HTTPMethod = "GET"|"POST"|"DELETE"|"OPTIONS";

export class CCCAPI {
    private env: CCCEnv;
    public token?: string;
    onMotD: (motd: string) => void;

    constructor(env: CCCEnv, token: string = null) {
        this.env = env;
        this.token = token;
    }

    private async request(endpoint: string, method: HTTPMethod, body?: any, json: boolean = false) : Promise<any> {
        let requestInfo: any = {
            url: this.env.url+endpoint,
            method: method,
            headers: {
                "X-Pluginv": this.env.version,
                "X-Browser": this.env.browser
            }
        }

        /* if (this.env.settings > browserlabel) {
            requestInfo.headers["X-Browser-Label"] = value;
        } */

        if (this.token) {
            requestInfo.headers["X-Token"] = this.token;
        }

        if (body) {
            if (!json) {
                let params = new URLSearchParams();
                for (let key in body) {
                    params.append(key, body[key]);
                }
                requestInfo.params = params;
            }
            else {
                requestInfo.params = body;
            }
        }

        let result = (await axios(requestInfo)).data;

        // Kein Objekt. Kein Erfolg
        if (typeof(result) != "object") {
            throw new Error("Connection Error");
        }

        // Server sagt nein
        if (!result.ok) {
            throw result;
        }

        if (result.motd && this.onMotD) {
            this.onMotD(result.motd);
        }

        return result;
    }

    login(username: string, password: string) : Promise<any> {
        return this.request("/login", "POST", {
            user: username,
            pass: password
        });
    }

    register(username: string, password: string) : Promise<any> {
        return this.request("/register", "POST", {
            user: username,
            pass: password
        });
    }

    logout() : Promise<any> {
        return this.request("/logout", "GET");
    }

    getSaves() : Promise<any> {
        return this.request("/saves", "GET");
    }

    // putSave(...) maybe here

    deleteSave(name: string) : Promise<any> {
        return this.request("/save/"+encodeURIComponent(name), "DELETE");
    }

    changePassword(oldPass: string, newPass: string) : Promise<any> {
        return this.request("/password", "POST", {
            oldPass: oldPass,
            newPass: newPass
        });
    }

    getUser() {
        return this.request("/user", "GET");
    }

    deleteUser(password: string) : Promise<any> {
        return this.request("/user", "DELETE");
    }

    exportData() : Promise<any> {
        return this.request("/data", "GET");
    }

    putSettings(settings: any) {
        return this.request("/settings", "POST", settings, true);
    }
}