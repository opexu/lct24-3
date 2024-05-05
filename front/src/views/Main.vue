<template>
<Splitter ref="splitterRef" class="w-full max-w-full h-full border-0" :gutterSize="2"
:pt="{ gutter: { class: 'bg-neutral-950 cursor-col-resize' }, gutterHandler: { class: 'bg-neutral-950 cursor-col-resize' }}"
@resize="onSplitterResize"
>
    <SplitterPanel ref="splitterLeftPanelRef" :size="30" :min-size="25" class="w-full h-full p-4 pr-2 flex flex-col space-y-4 bg-neutral-900">
        <Image class="max-w-[250px]"
        :src="LogoUrl"/>
        <div class="w-full h-full p-4 flex flex-col rounded-lg bg-neutral-800">
            <Panel class="h-full">
                <template #footer>
                    <UserInfo class="w-full h-fit"
                    :user="userInfo"
                    />
                </template>
            
            </Panel>
        </div>
        
    </SplitterPanel>
    <SplitterPanel :size="70" class="w-full h-full p-4 pl-2 flex bg-neutral-900 outline-none">
        <div id="csRootRef" ref="csRootRef" class="w-full h-full rounded-lg"></div>
    </SplitterPanel>
</Splitter>
</template>

<script setup lang="ts">
import Splitter, { type SplitterResizeEvent } from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import UserInfo from '@/components/UserInfo.vue';
import { useLogout } from '@/composables/useLogout';
import { COOKIE_KEY, useCookiesStore } from '@/stores/cookie-store';
import { useCSStore } from '@/stores/cs-store';
import type { IUser } from '@/types/auth';
import { onMounted, ref, nextTick, computed, onUnmounted, type ComponentInstance } from 'vue';
import Panel from 'primevue/panel';
import Image from 'primevue/image';
import LogoUrl from '@/assets/Logo.png';

const cookies = useCookiesStore();
const userInfo = computed(() => cookies.get<IUser>( COOKIE_KEY.USER ) );
const logout = useLogout();
const CSStore = useCSStore();
const csRootRef = ref<InstanceType<typeof HTMLDivElement>|null>();
const splitterRef = ref<ComponentInstance<typeof Splitter>|null>();
const splitterLeftPanelRef = ref<ComponentInstance<typeof SplitterPanel>|null>();

onMounted( async () => {
    if( csRootRef.value && splitterRef.value && splitterLeftPanelRef.value ){
        CSStore.init( csRootRef.value );
    }else{
        await nextTick();
        if( csRootRef.value ){
            CSStore.init( csRootRef.value );
        }else{
            console.error('Ошибка инициализации приложения');
            logout.logout();
        }
    }
    
    splitterLeftPanelRef.value && splitterObserver.observe( splitterLeftPanelRef.value.$el );
});
onUnmounted(() => {
    splitterLeftPanelRef.value && splitterObserver.unobserve( splitterLeftPanelRef.value.$el );
});

const splitterObserver = new ResizeObserver(( entries: ResizeObserverEntry[], observer: ResizeObserver ) => {
    onObserverResize( entries[0].contentRect.width );
});

function onObserverResize( splitterLeftPanelWidth: number ){
    !isSplitterResize && onResize( splitterLeftPanelWidth, 21, 28 );
}

let isSplitterResize = false;
let prevLeftWidth = 0;
function onSplitterResize( event: SplitterResizeEvent ){
    isSplitterResize = true;
    const splitterLeftPanelWidth = ( window.innerWidth * event.sizes[0] ) / 100.0;
    if( prevLeftWidth === splitterLeftPanelWidth ) { isSplitterResize = false; return; }
    prevLeftWidth = splitterLeftPanelWidth;
    onResize( splitterLeftPanelWidth, 21, 28 );
    isSplitterResize = false;
}

function onResize( splitterLeftPanelWidth: number, offsetWidth: number, offsetHeight: number ){
    const rightWidth = window.innerWidth - splitterLeftPanelWidth - 2 - ( offsetWidth * 2 );
    CSStore.resize( rightWidth, window.innerHeight - offsetHeight );
}
</script>