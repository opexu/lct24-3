<template>
<div class="w-full h-full flex justify-center items-center">
    <div class="w-fit min-w-[30%] h-fit flex flex-col space-y-4">
        
        <!-- HEADER TEXT -->
        <div class="w-full h-full flex flex-row justify-center">
            <p class="text-lg">Авторизация</p>
        </div>

        <!-- BODY TEXT -->
        <form>
        <div class="w-full h-fit flex flex-col space-y-4">
            
            <!-- ЛОГИН -->
            <div class="w-full h-fit flex flex-col">
                <label for="login" class="w-full h-fit">Логин</label>
                <InputText id="username" type="text" 
                v-model="login" 
                placeholder="Email пользователя"
                :invalid="isAuthError"
                :pt="{ root: { autocomplete: 'username' } }"
                />
            </div>

            <!-- ПАРОЛЬ -->
            <div class="w-full h-fit flex flex-col">
                <label for="password" class="w-full h-fit">Пароль</label>
                <Password id="password" 
                required toggleMask
                inputClass="w-full"
                v-model="password" 
                placeholder="Пароль" 
                :feedback=false 
                :invalid="isAuthError"
                :inputProps="{ autocomplete: 'current-password' }"
                />
            </div>
        </div>
        </form>

        <!-- FOOTER TEXT-->
        <div class="w-full h-fit flex">
            <Button class="w-full h-fit" 
            outlined
            label="Авторизоваться" 
            @click="submitLogin"
            />
        </div>

        <!-- ERROR -->
        <div class="w-full h-fit p-4 rounded-md flex flex-row justify-center items-center"
        :class="[ message.isError ? 'border-red-500 bg-red-50 text-red-800' : 'border-green-500 bg-green-50 text-green-800']"
        v-if="message.text"
        >
            <p>{{ message.text }}</p>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { AUTH_API } from '@/api/auth';
import { useApi } from '@/composables/useAPI';
import { COOKIE_KEY, useCookiesStore } from '@/stores/cookie-store';
import type { API_KEY, IAPI } from '@/types/api';
import type { IAuthRes } from '@/types/auth';
import type { IAxiosStrapi } from '@/types/strapi';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const cookies = useCookiesStore();
const { strapipost } = useApi();

const login = ref();
const password = ref();
const isAuthError = ref(false);
const message = ref({
    isError: false,
    text: ''
});
    
async function submitLogin(){

    try{
        const loginRes = await strapipost<IAuthRes, AUTH_API[API_KEY.AUTH]>( AUTH_API.auth, {
            identifier: login.value,
            password: password.value,
        } );
        cookies.set( COOKIE_KEY.USER, loginRes.data.user );
        cookies.set( COOKIE_KEY.JWT, loginRes.data.jwt );
        isAuthError.value = isAuthError.value ? false : true;
        router.push({ name: 'app' });
    }catch(e){
        const msg = 'Ошибка авторизации, попробуйте изменить логин или пароль';
        console.warn( msg, e);
        message.value = { isError: true, text: msg }
        isAuthError.value = true;
    }
}
</script>