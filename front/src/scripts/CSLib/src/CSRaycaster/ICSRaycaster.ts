import type { IEventEmitter } from '../EventEmitter';

export interface ICSRaycaster extends IEventEmitter<ICSRaycastEvent> {
    IsEnabled: boolean;
    enable(): void;
    disable(): void;
    update(): void;
}

export interface ICSRaycastEvent {
    'intersect': string
}