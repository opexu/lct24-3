export type IAPIHandler<T extends any[]> = { handler: ( ...args: T ) => string }

export type IAPI<T extends any[]> = IAPIHandler<T> & { url: string; }
export type IAPIPOST<T extends any[]> = { 
    url: string;
    handler: ( ...args: T ) => FormData 
}
export type IGET<T extends any[]> = IAPIHandler<T>