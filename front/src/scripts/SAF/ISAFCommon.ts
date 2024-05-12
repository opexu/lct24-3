import type { IDated } from "@/types/strapi";

export interface ISAFCommon extends IDated {
    Title: string;
    Code: string;
}