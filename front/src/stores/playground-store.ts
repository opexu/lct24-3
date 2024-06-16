import type { IPlayground, IPlaygroundFull, IPlaygroundYardAreaRelation } from "@/types/IReestr";
import type { IStrapi } from "@/types/strapi";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlaygroundStore = defineStore( 'PlaygroundStore', () => {

    const playgroundsArr = ref<IStrapi<IPlaygroundFull>[]>([]);
    const selectedPlayground = ref<IStrapi<IPlaygroundFull>>();

    const priceLimit = ref(0);
    const currentPrice = ref(0);
    const usePriceLimit = ref(false);

    function canAdd( price: number ){
        if( usePriceLimit.value ){
            return priceLimit.value > currentPrice.value + price;
        }else{
            return true;
        }
        
    }
    function addPrice( price: number ){
        currentPrice.value = Math.min( priceLimit.value, currentPrice.value + price );
    }
    function removePrice( price: number ){
        currentPrice.value = Math.max( 0, currentPrice.value - price );
    }
    return { playgroundsArr, selectedPlayground, priceLimit, canAdd, addPrice, removePrice, currentPrice, usePriceLimit }
})