export interface PlainResponse {
    ok: boolean;
    error?: string;
}

export interface ErrorResponse extends PlainResponse {
    message?: string;
    from?: number;
    to?: number;
}