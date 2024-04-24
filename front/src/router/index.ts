import { createRouter, createWebHistory } from 'vue-router'
import Login
 from '@/views/Login.vue';
const router = createRouter( {
    history: createWebHistory(),
    routes: [
        {
            path: '/:catchAll(.*)',
            redirect: 'Login',
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            props: true,
            meta: { transition: 'fade' },
            beforeEnter: async ( to, from ) => {
                console.log('beforeEnter Login');
            },
        },
    ]
} )

export default router
