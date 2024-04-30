import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue';
import Main from '@/views/Main.vue';
import { strapiauth } from '@/scripts/auth';

const router = createRouter( {
    history: createWebHistory(),
    routes: [
        {
            path: '/:catchAll(.*)*',
            redirect: 'Login',
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            props: true,
            meta: { transition: 'fade' },
            beforeEnter: async ( to, from, next ) => {
                return strapiauth( next, { okname: 'app' } );
            },
        },
        {
            path: '/app',
            name: 'app',
            component: Main,
            props: true,
            meta: { transition: 'fade' },
            beforeEnter: async ( to, from, next ) => {
                return strapiauth( next, { errorname: 'login' } );
            }
        }
    ]
} )

export default router;
