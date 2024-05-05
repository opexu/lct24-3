<template>
<div class="flex flex-row justify-end items-center space-x-2">
    <p class="text-neutral-500">{{ user.email }}</p>
    
    <Button icon="pi pi-times" severity="danger" text aria-label="Cancel"
    v-tooltip.bottom="'Выйти'"
    @click="logout"
    />
</div>
</template>

<script setup lang="ts">
import { useLogout } from '@/composables/useLogout';
import type { IUser } from '@/types/auth';
import Button from 'primevue/button';

const { logout } = useLogout();
defineProps<{
    user: IUser;
}>();
</script>