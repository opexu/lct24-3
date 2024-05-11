export type EventMap<T> = {[K in keyof T]: (( args: T[ K ] ) => void)[]};
export type IEventListener<T> = { [key: string]: T }

export interface IEventEmitter<T> {
    on<K extends keyof T>( key: K, callback: ( args: T[ K ] ) => void ): void;
    off<K extends keyof T>( key: K, callback: ( args: T[ K ] ) => void ): void;
    emit<K extends keyof T>( key: K, args: T[ K ] ): void;
    dispose(): void;
}

export type IEventable<T> = Pick<IEventEmitter<T>, 'on'|'off'>;