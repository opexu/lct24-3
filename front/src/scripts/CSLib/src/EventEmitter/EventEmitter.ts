import type { EventMap, IEventEmitter } from "./IEventEmitter";

export class EventEmitter<T> implements IEventEmitter<T> {
    
    private _events: EventMap<T>;
    
    constructor(){
        this._events = <EventMap<T>>{};
    }
    
    public on<K extends keyof T>( key: K, callback: ( args: T[ K ] ) => void ): void {
        !this._events[ key ] && ( this._events[ key ] = [] );
        this._events[ key ].push( callback );
    }
    
    public off<K extends keyof T>( key: K, callback: ( args: T[ K ] ) => void ): void {
        if(this._events[ key ]) {
            this._events[ key ] = this._events[ key ].filter( eventCallback => {
                return callback.name !== eventCallback.name
            });
        }
    }
    
    public emit<K extends keyof T>( key: K, args: T[ K ] ): void {
        const event = this._events[ key ];
        event && event.forEach( callback => callback.call( null, args ));
    }
    
    public dispose(): void {
        this._events = <EventMap<T>>{};
    }

}