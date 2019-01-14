import axios from 'axios';
import { CCCAPIInformation } from "./CCCAPIInformation";
import { CCCSave } from '../apiTypes/CCCSave';

type HTTPMethod = "GET"|"POST"|"DELETE"|"OPTIONS";

export class CCCAPI {
    private apiInformation: CCCAPIInformation;
    onMotD: (motd: string) => void;
    onUrlChange: (url: string) => void;

    constructor(apiInformation: CCCAPIInformation) {
        this.apiInformation = apiInformation;
    }

    private async request(endpoint: string, method: HTTPMethod, body?: any, json: boolean = false) : Promise<any> {
        let requestInfo: any = {
            url: this.apiInformation.baseUrl+endpoint,
            method: method,
            headers: this.apiInformation.getApiHeaders()
        }

        if (this.apiInformation.token) {
            requestInfo.headers["X-Token"] = this.apiInformation.token;
        }

        if (body) {
            if (!json) {
                let params = new URLSearchParams();
                for (let key in body) {
                    params.append(key, body[key]);
                }
                requestInfo.data = params;
            }
            else {
                requestInfo.data = body;
            }
        }

        let result = (await axios(requestInfo)).data;

        // Kein Objekt. Kein Erfolg
        if (typeof(result) != "object") {
            throw new Error("connection");
        }

        // Server sagt nein
        if (!result.ok) {
            throw result;
        }

        if (result.motd != undefined && this.onMotD != undefined) {
            this.onMotD(result.motd);
        }

        if (result.url != undefined && this.onUrlChange != undefined) {
            this.onUrlChange(result.url);
            return await this.request(endpoint, method, body, json);
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

    getSave(savename: string) : Promise<any> {
        return this.request("/save/"+encodeURIComponent(savename), "GET");
    }

    putSave(save: CCCSave) : Promise<any> {
        return this.request("/save/"+encodeURIComponent(save.name), "POST", save, true);
    }

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

    getMessageOfTheDay() {
        return this.request("/motd", "GET");
    }

    deleteUser(password: string) : Promise<any> {
        return this.request("/user", "DELETE", {pass: password});
    }

    exportData() : Promise<any> {
        return this.request("/data", "GET");
    }
}