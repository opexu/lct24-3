import type { IPlayground, IPlaygroundFull, IPlaygroundYardAreaRelation } from "@/types/IReestr";
import type { IStrapi } from "@/types/strapi";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlaygroundStore = defineStore( 'PlaygroundStore', () => {

    const playgroundsArr = ref<IStrapi<IPlaygroundFull>[]>([]);
    const selectedPlayground = ref<IStrapi<IPlaygroundFull>>();

    return { playgroundsArr, selectedPlayground }
})