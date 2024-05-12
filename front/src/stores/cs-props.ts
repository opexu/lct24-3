import type { ICSDXFObject } from "@/scripts/CSLib";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCSProps = defineStore( 'useCSProps', () => {

    const CSGeoProps = ref([]);

    function addGeo( csdxfobj: ICSDXFObject ){

    }

    function removeGeo( csdxfobj: ICSDXFObject ){
        
    }

    return {
        CSGeoProps, addGeo, removeGeo
    }
})