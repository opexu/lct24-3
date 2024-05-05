<template>
<Splitter ref="splitterRef" class="w-full max-w-full h-full border-0" :gutterSize="2"
:pt="{ gutter: { class: 'bg-neutral-950 cursor-col-resize' }, gutterHandler: { class: 'bg-neutral-950 cursor-col-resize' }}"
@resize="onSplitterResize"
>
    <SplitterPanel :size="30" :min-size="25" class="w-full h-full p-4 pr-2 flex flex-col space-y-4 bg-neutral-900"
    >
        <div class="w-full h-fit flex flex-row justify-between">
            <Image class="max-w-[250px]"
            :src="LogoUrl"/>
            <UserInfo class="w-full h-fit"
            :user="userInfo"
            />
        </div>
        
        <div class="w-full h-full p-4 flex flex-col rounded-lg bg-neutral-800">
            <!-- <Panel class="h-full">
                <template #footer>
                    <UserInfo class="w-full h-fit"
                    :user="userInfo"
                    />
                </template>
            
            </Panel>-->
        </div> 
        
    </SplitterPanel>
    <SplitterPanel ref="splitterRightPanelRef" :size="70" class="w-full h-full p-4 pl-2 flex bg-neutral-900 outline-none">
        <View3D ref="view3DRef"/>
        <!-- <div id="csRootRef" ref="csRootRef" class="w-full h-full rounded-lg"></div> -->
    </SplitterPanel>
</Splitter>
</template>

<script setup lang="ts">
import Splitter, { type SplitterResizeEvent } from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import UserInfo from '@/components/UserInfo.vue';
import { COOKIE_KEY, useCookiesStore } from '@/stores/cookie-store';
import { useCSStore } from '@/stores/cs-store';
import type { IUser } from '@/types/auth';
import { onMounted, ref, computed, onUnmounted, type ComponentInstance, watch, nextTick } from 'vue';
import Panel from 'primevue/panel';
import Image from 'primevue/image';
import LogoUrl from '@/assets/Logo.png';
import View3D from '@/components/View3D.vue';

const cookies = useCookiesStore();
const userInfo = computed(() => cookies.get<IUser>( COOKIE_KEY.USER ) );
const CSStore = useCSStore();
const splitterRef = ref<ComponentInstance<typeof Splitter>|null>();
const splitterRightPanelRef = ref<ComponentInstance<typeof SplitterPanel>|null>();
const view3DRef = ref<ComponentInstance<typeof View3D>|null>();
 
onMounted( async () => {
    window.addEventListener( 'resize', onWindowResize );
    if( !view3DRef.value ){
        await nextTick();
    }
    onWindowResize();
});
onUnmounted(() => {
    window.removeEventListener( 'resize', onWindowResize );
});

function onWindowResize(){
    const splitterLeftPanelWidth = ( window.innerWidth * panelSizes.l ) / 100.0;
    const splitterRightPanelWidth = ( window.innerWidth * panelSizes.r ) / 100.0;
    const splitterRightPanelHeight = window.innerHeight;
    if( prevLeftWidth === splitterLeftPanelWidth && prevLeftHeight === splitterRightPanelHeight ) return;
    prevLeftWidth = splitterLeftPanelWidth;
    prevLeftHeight = splitterRightPanelHeight;
    onResize( splitterRightPanelWidth, splitterRightPanelHeight, 21, 28 );
}
let isSplitterResize = false;
let prevLeftWidth = 0;
let prevLeftHeight = 0;
const panelSizes = { l: 30, r: 70 }
function onSplitterResize( event: SplitterResizeEvent ){
    isSplitterResize = true;
    const splitterLeftPanelWidth = ( window.innerWidth * event.sizes[0] ) / 100.0;
    const splitterRightPanelWidth = ( window.innerWidth * event.sizes[1] ) / 100.0;
    const splitterRightPanelHeight = window.innerHeight;
    if( prevLeftWidth === splitterLeftPanelWidth && prevLeftHeight === splitterRightPanelHeight ) { isSplitterResize = false; return; }
    prevLeftWidth = splitterLeftPanelWidth;
    prevLeftHeight = splitterRightPanelHeight;
    panelSizes.l = event.sizes[0];
    panelSizes.r = event.sizes[1];
    onResize( splitterRightPanelWidth, splitterRightPanelHeight, 21, 28 );
    isSplitterResize = false;
}

function onResize( splitterRightPanelWidth: number, splitterRightPanelHeight: number, offsetWidth: number, offsetHeight: number ){
    const rpWidth = view3DRef.value?.rpWidth;
    if( !rpWidth ) return;
    CSStore.resize( splitterRightPanelWidth - offsetWidth - rpWidth - 7, splitterRightPanelHeight - offsetHeight );
}
</script>