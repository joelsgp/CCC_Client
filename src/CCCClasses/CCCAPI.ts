import axios, { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { CCCAPIInformation } from "./CCCAPIInformation";
import { CCCSave } from '../apiTypes/CCCSave';
import IRefreshTarget from '../utils/IRefreshTarget';

type HTTPMethod = "GET"|"POST"|"DELETE"|"OPTIONS";

export class CCCAPI {

    private apiInformation: CCCAPIInformation;
    onMotD?: (motd: string) => void;
    onUrlChange?: (url: string) => void;
    private refreshTargets: IRefreshTarget[];

    constructor(apiInformation: CCCAPIInformation) {
        this.apiInformation = apiInformation;
        this.refreshTargets = [];
    }

    public attach(refreshTarget: IRefreshTarget) {
        this.refreshTargets.push(refreshTarget);
    }

    public detach(refreshTarget: IRefreshTarget) {
        this.refreshTargets = this.refreshTargets.filter(t => t != refreshTarget);
    }

    public triggerRefresh(): void {
        this.refreshTargets.forEach(t => t.reload());
    }

    private async request(endpoint: string, method: HTTPMethod, body?: any) : Promise<any> {
        let requestInfo: RequestInit = {
            method: method,
            headers: this.apiInformation.getApiHeaders()
        }

        if (this.apiInformation.token != "") {
            requestInfo.headers["X-Token"] = this.apiInformation.token;
        }

        if (body) {
            requestInfo.headers["Content-Type"] = "application/json";
            requestInfo.body = JSON.stringify(body);
        }

        let result = (await (await fetch(this.apiInformation.baseUrl+endpoint, requestInfo)).json());

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

        if (result.changeAppUrl != undefined && this.onUrlChange != undefined) {
            this.onUrlChange(result.changeAppUrl);
            return await this.request(endpoint, method, body);
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
        return this.request("/save/"+encodeURIComponent(save.name), "POST", save);
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