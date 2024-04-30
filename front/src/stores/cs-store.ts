import { CSCore, type ICSCore } from "@/scripts/CSLib";
import { defineStore } from "pinia";
import { computed, shallowRef } from "vue";

export const useCSStore = defineStore( 'useCSStore', () => {

    const _CS = shallowRef<ICSCore>( new CSCore() );
    const CS = computed(() => _CS.value );

    return { CS }
})