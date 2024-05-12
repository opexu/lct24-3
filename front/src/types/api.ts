export type IAPIHandler<T extends any[]> = { handler: ( ...args: T ) => string }

export type IAPI<T extends any[]> = IAPIHandler<T> & { url: string; }

export type IGET<T extends any[]> = IAPIHandler<T>