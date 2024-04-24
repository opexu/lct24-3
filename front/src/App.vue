<template>
    <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in" appear>
            <component :is="Component"/>
        </transition>
    </router-view>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
