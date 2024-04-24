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
                    <input id="login" type="text" autocomplete="new-login"
                    class="w-full h-fit p-4 border rounded-md"
                    v-model="login"
                    />
                </div>
    
                <!-- ПАРОЛЬ -->
                <div class="w-full h-fit flex flex-col">
                    <label for="password" class="w-full h-fit">Пароль</label>
                    <input id="password" type="password" autocomplete="new-password"
                    class="w-full h-fit p-4 border rounded-md"
                    v-model="password"
                    />
                </div>
            </div>
            </form>
    
            <!-- FOOTER TEXT-->
            <div class="w-full h-fit flex">
                <button type="button" class="w-full h-fit p-4 border rounded-md common-handler-btn-blue" 
                @click="submitLogin"
                >
                    Войти
                </button>
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
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    
    const router = useRouter();
    const route = useRoute();
    
    const login = ref();
    const password = ref();
    const isAuthError = ref(false);
    const message = ref({
        isError: false,
        text: ''
    });
    
    async function submitLogin(){
        console.log('login: ', login.value);
        console.log('password: ', password.value);
    
        try{
            isAuthError.value = isAuthError.value ? false : true;
            
            message.value = { isError: false, text: 'Успешная авторизация' }
    
            router.push({
                name: 'SelectProject',
            })
        }catch(e){
            console.warn('Ошибка авторизации, попробуйте изменить логин или пароль', e);
            message.value = { isError: true, text: 'Ошибка авторизации, попробуйте изменить логин или пароль' }
            isAuthError.value = true;
        }
    }
    </script>