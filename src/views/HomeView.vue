<script lang="ts" setup>
import SvgIcon from "@/components/SvgIcon.vue";
</script>

<template>
  <div class="m-6 flex flex-col space-y-4">

    <div class="alert alert-warning">
      <svg-icon class="h-5 w-5" fill="none" icon-name="alert" size="20"/>
      <span class="font-moe">这个页面还在早期开发阶段 难看就忍受一下 能用就行 感恩！</span>
    </div>

    <div class="divider"/>

    <div class="alert alert-primary">
      <svg-icon class="h-5 w-5" fill="none" icon-name="server" size="20"/>
      <span class="font-moe">服务器正常运行中！</span>
    </div>

    <div class="divider"/>

    <div class="flex space-x-2">
      <div class="alert alert-primary w-fit">
        <svg-icon class="h-5 w-5" fill="none" icon-name="new-user" size="20"/>
        <a class="font-moe link link-hover" href="/register">目前酥卷接受新的注册用户！</a>
      </div>

      <div class="alert alert-primary w-fit">
        <svg-icon class="h-5 w-5" fill="none" icon-name="login" size="20"/>
        <span class="font-moe">登录在右上角</span>
      </div>
    </div>

  </div>
</template>
