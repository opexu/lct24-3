<template>
<div class="w-full h-full flex flex-col space-y-2">
    
    <div class="w-full h-fit flex flex-col space-y-2">
        <span>Слои</span>
        <Listbox class="w-full" filter multiple
        v-model="selectedDxfLayers" 
        :options="DXFStore.DxfLayers" 
        :optionLabel="( $data: DxfLayerWithCount ) => ( $data.layer.name + ' -> ( ' + $data.count + ' )')"
        />
    </div>
    <Toolbar>
        <template #start>
            <AssignTypes class="mr-2"/>
        </template>
    </Toolbar>
</div>
</template>

<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import Listbox, { type ListboxChangeEvent } from 'primevue/listbox';
import Card from 'primevue/card';
import { useDXFStore } from '@/stores/dxf-store';
import { ref, watch } from 'vue';
import type { ILayer } from 'dxf-parser';
import { useCSStore } from '@/stores/cs-store';
import * as Utils from '@/scripts/utils/Utils';
import AssignTypes from './AssignTypes.vue';

type DxfLayerWithCount = typeof DXFStore.DxfLayers[0];
const CSStore = useCSStore();
const DXFStore = useDXFStore();
const selectedDxfLayers = ref<DxfLayerWithCount[]>([]);
watch( selectedDxfLayers, ( value, oldvalue ) => {
    const { isAdded, diff } = Utils.CalcDiff( value, oldvalue )
    // const isAdded = value.length > oldvalue.length;
    // const max = isAdded ? value : oldvalue;
    // const min = isAdded ? oldvalue : value;
    // const diff = max.filter( m => !min.includes( m ) );
    const layersNames = diff.map( d => d.layer.name );
    isAdded ? CSStore.CS?.selectByLayers( layersNames ) : CSStore.CS?.deselectByLayers( layersNames )
    // CSStore.CS?.CSDXFObjectsArr.filter( csdxf => ( layersNames.includes( csdxf.DXFLayer ) && ( isAdded ? !csdxf.IsSelected : csdxf.IsSelected ) )).forEach( csdxf => ( isAdded ? csdxf.select() : csdxf.deselect() ))
})
</script>