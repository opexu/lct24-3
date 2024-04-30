export interface IAPI<T extends any[]> {
    url: string;
    handler: ( ...args: T ) => string;
}

export interface IGET<T extends any[]> {
    handler: ( ...args: T ) => string;
}

export enum API_KEY {
    AUTH = 'auth',
    ME = 'me',
}

fetch('adsf', {
    
})