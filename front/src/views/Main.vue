<template>
<Splitter class="w-full h-full border-0">
    <SplitterPanel :size="35" class="p-4">
        <Panel class="h-full">
            <template #footer>
                <UserInfo class="w-full h-fit"
                :user="userInfo"
                />
            </template>
        
        </Panel>
    </SplitterPanel>
    <SplitterPanel :size="65">
        <div ref="csRoot" class="w-full h-full"></div>
    </SplitterPanel>
</Splitter>
</template>

<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import UserInfo from '@/components/UserInfo.vue';
import { useLogout } from '@/composables/useLogout';
import { COOKIE_KEY, useCookiesStore } from '@/stores/cookie-store';
import { useCSStore } from '@/stores/cs-store';
import type { IUser } from '@/types/auth';
import { onMounted, ref, nextTick, computed } from 'vue';
import Card from 'primevue/card';
import Panel from 'primevue/panel';

const cookies = useCookiesStore();
const userInfo = computed(() => cookies.get<IUser>( COOKIE_KEY.USER ) );
const logout = useLogout();
const CSStore = useCSStore();
const csRoot = ref<InstanceType<typeof HTMLDivElement>|null>();
onMounted( async () => {
    if( csRoot.value ){
        CSStore.CS.init( csRoot.value );
    }else{
        await nextTick();
        if( csRoot.value ){
            CSStore.CS.init( csRoot.value );
        }else{
            console.error('Ошибка инициализации приложения');
            logout.logout();
        }
    }
})
</script>