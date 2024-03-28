<script lang="ts" setup>
import {useUserStore} from "@/stores/user";
import SvgIcon from "@/components/SvgIcon.vue";
import router from "@/router";

// show user avatar if user is logged in
const isLogin = computed(() => {
  return useUserStore().user.id;
});

// search mode
const isSearchEntering = ref<boolean>(false);
const searchName = ref<string>("");
const isNameValid = computed(() => {
  if (searchName.value !== "") {
    return searchName.value.lastIndexOf(" ") === -1 && searchName.value.lastIndexOf("-") !== -1;
  }
  return false;
});

// search
function jumpUser() {
  if (isNameValid.value) {
    router.push(`/user/${searchName.value}`);
    isSearchEntering.value = false;
  }
}

// copy user key to clipboard
const isCopied = ref<boolean>(false);

function copyKey() {
  const token = useUserStore().user.person.key;
  if (token) {
    navigator.clipboard.writeText(token);
    const dialog = document.getElementById("key_suc_modal") as HTMLDialogElement;
    dialog.showModal();
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  }
}
</script>

<template>
  <div class="navbar bg-base-100 items-center gap-2 bg-opacity-90 px-4 py-2 backdrop-blur shadow-sm">

    <div class="navbar-start">
      <a class="btn btn-ghost px-2" href="/">
        <div class="font-title text-primary inline-flex text-3xl transition-all duration-200">
          <span class="lowercase text-primary">酥</span>
          <span class="text-base-content">卷</span>
        </div>
      </a>
      <div class="dropdown">
        <label class="link link-hover font-mono text-xs" tabindex="0">Beta</label>
        <ul class="dropdown-content menu menu-sm bg-base-200 rounded-box mt-8 w-40 p-2 shadow">
          <li>
            <a href="/docs/changelog">更新日志</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="navbar-end flex space-x-2">

      <div v-if="isSearchEntering" class="form-control">
        <input
            v-model="searchName" :class="{'input-error': searchName && !isNameValid, 'input-primary': isNameValid}"
            class="input input-bordered w-64 font-moe" placeholder="例: 蛋卷酥-红茶川"
            type="text" @keyup.enter="jumpUser()"/>
      </div>

      <button
          :class="{'btn-circle': !isSearchEntering, 'btn-square btn-outline': isSearchEntering}"
          class="btn btn-ghost"
          @click="isSearchEntering = !isSearchEntering; jumpUser();">
        <svg-icon class="h-5 w-5" icon-name="search" size="20"/>
      </button>

      <button v-if="!isLogin" class="btn btn-ghost btn-circle" @click="router.push('/login')">
        <svg-icon class="h-5 w-5" icon-name="login" size="20"/>
      </button>

      <div v-if="isLogin" class="dropdown dropdown-end">
        <label class="btn btn-ghost btn-circle avatar" tabindex="0">
          <div class="w-10 rounded-full">
            <img :src="useUserStore().getAvatarURL()" alt="avatar"/>
          </div>
        </label>
        <ul class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52" tabindex="0">
          <li><a @click="copyKey()">复制 Key</a></li>
          <li>
            <a class="justify-between" onclick="dev_modal.showModal()">
              导入数据
              <span class="badge badge-warning">Dev</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <dialog id="key_suc_modal" class="modal font-moe">
      <form class="modal-box" method="dialog">
        <h3 class="font-bold text-lg">Key 复制成功</h3>
        <p class="py-4">请妥善保存 一旦丢失则将损害账户安全！</p>
      </form>
      <form class="modal-backdrop" method="dialog">
        <button>close</button>
      </form>
    </dialog>

    <dialog id="dev_modal" class="modal font-moe">
      <form class="modal-box" method="dialog">
        <h3 class="font-bold text-lg">开发中！</h3>
        <p class="py-4">虽然你很急 但你先别急</p>
      </form>
      <form class="modal-backdrop" method="dialog">
        <button>close</button>
      </form>
    </dialog>

  </div>
</template>
