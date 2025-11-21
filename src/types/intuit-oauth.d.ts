declare module 'intuit-oauth' {
    export default class OAuthClient {
        constructor(config: any);
        authorizeUri(options: any): string;
        createToken(url: string): Promise<any>;
        refresh(): Promise<any>;
        makeApiCall(options: any): Promise<any>;
    }
}
