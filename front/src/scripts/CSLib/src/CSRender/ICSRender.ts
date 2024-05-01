import type { WebGLRenderer } from "three";

export interface ICSRender {
    render(): void;
    resize( width: number, height: number ): void;
}