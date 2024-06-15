import type { ICSMafObject } from "@/scripts/CSLib";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCSProps = defineStore( 'useCSProps', () => {

    const CSGeoProps = ref([]);

    function addGeo( csdxfobj: ICSMafObject ){

    }

    function removeGeo( csdxfobj: ICSMafObject ){
        
    }

    return {
        CSGeoProps, addGeo, removeGeo
    }
})