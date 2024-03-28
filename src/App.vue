<script lang="ts" setup>
import SuNavbar from "@/components/SuNavbar.vue";
</script>

<template>
  <div class="w-full flex flex-col space-y-4">
    <su-navbar/>
    <router-view/>
  </div>
</template>
