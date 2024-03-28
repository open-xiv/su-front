<script lang="ts" setup>
import SvgIcon from "@/components/SvgIcon.vue";
import { useSuStore } from '@/stores/subook';
import axios from 'axios';
import { useUserStore } from "@/stores/user";
import router from "@/router";

// server status
const serverStatus = ref<string>("");

// login status
const hasLogin = ref<boolean>(false);

// check server status
function checkServerStatus() {
  // send request
  const url = useSuStore().serverURL;
  axios.get(`${url}/public/status`)
    .then((rsp) => {
      serverStatus.value = rsp.data.status;
    })
    .catch((err) => {
      serverStatus.value = `no-response: ${err}`;
    });
}

onBeforeMount(() => {
    // refresh server status every 5 seconds
    checkServerStatus();
    setInterval(checkServerStatus, 5000);
    // check login status
    if (useUserStore().user.token) {
      hasLogin.value = true;
      router.push("/user/" + useUserStore().user.person.name);
    }
});
</script>

<template>
  <div class="m-6 flex flex-col space-y-4">

    <div class="alert alert-warning">
      <svg-icon class="h-5 w-5" fill="none" icon-name="alert" size="20"/>
      <span class="font-moe">早期开发阶段</span>
    </div>

    <div class="divider"/>

    <div class="flex alert alert-primary">
      <svg-icon class="h-5 w-5" fill="none" icon-name="server" size="20"/>
      <span class="font-moe">服务器当前状态</span>
      <span class="font-mono text-sm font-bold">{{ serverStatus }}</span>
    </div>

    <div class="divider"/>

    <router-view/>
  </div>
</template>
