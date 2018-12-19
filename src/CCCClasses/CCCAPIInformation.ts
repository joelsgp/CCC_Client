export type HeaderMap = {
    [key: string] : string;
}

export interface CCCAPIInformation {
    token: string | null;
    baseUrl: string;
    getApiHeaders() : HeaderMap
}