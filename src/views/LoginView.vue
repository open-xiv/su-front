<script lang="ts" setup>
import SvgIcon from "@/components/SvgIcon.vue";

import axios from "axios";
import router from "@/router";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { snakeToCamel } from "@/tools";
import { useSuStore } from "@/stores/subook";

// focus event
const currentInput = ref<string>("");

function setCurrentInput(input: string) {
  currentInput.value = input;
}

// name info
const playerName = ref<string>("");

// server select
interface Server {
  label: string;
  subServer: string[];
}

const rawServers = [
  {
    "label": "陆行鸟",
    "subServer": ["拉诺西亚", "幻影群岛", "神意之地", "萌芽池", "红玉海", "宇宙和音", "沃仙曦染", "晨曦王座"]
  },
  {
    "label": "莫古力",
    "subServer": ["潮风亭", "神拳痕", "白银乡", "白金幻象", "旅人栈桥", "拂晓之间", "龙巢神殿", "梦羽宝境"]
  },
  {
    "label": "猫小胖",
    "subServer": ["紫水栈桥", "延夏", "白银乡", "静语庄园", "摩杜纳", "海猫茶屋", "柔风海湾", "琥珀原"]
  },
  {
    "label": "豆豆柴",
    "subServer": ["水晶塔", "银泪湖", "太阳海岸", "伊修加德", "红茶川"]
  }
];
const selectServer = ref<Server>();
const selectSubServer = ref<string>();

const isNameValid = computed(() => {
  if (playerName.value !== "") {
    return playerName.value.lastIndexOf(" ") === -1;
  }
  return false;
});

// password info
const password = ref<string>("");
const isPasswordValid = computed(() => {
  if (password.value !== "") {
    const regex = RegExp("^[a-zA-Z0-9_-]{6,16}$");
    return regex.test(password.value);
  }
  return true;
});

// check
const isEveryThingOk = computed(() => {
  const nameCheck = isNameValid.value && playerName.value;
  const passwordCheck = isPasswordValid.value && password.value;
  return nameCheck && passwordCheck;
});

// register
const blurContent = ref<boolean>(false);
const isRegistering = ref<boolean>(false);
const token = ref<string>("");
const showTime = ref<number>(0);
const errorMSG = ref<string>("");

function getAvatar() {
  // get user avatar url
  const url = useSuStore().serverURL;
  axios.get(url + "/api/public/user/" + useUserStore().user.person.name + "/avatar")
    .then((res) => {
      console.log(res.data.avatar_url);
      useUserStore().user.person.avatarUrl = snakeToCamel(res.data.avatar_url);
    })
    .catch((err) => {
      showError(err.response.data.message);
    });
}


function login() {
  if (isEveryThingOk) {
    // build person info
    const personInfo = {
      name: playerName.value + "-" + selectSubServer.value,
      password: password.value
    };
    // send request
    const url = useSuStore().serverURL;
    isRegistering.value = true;
    blurContent.value = true;
    axios.post(url + "/api/protect/login", personInfo)
      .then((res) => {
        // success
        isRegistering.value = false;

        // token
        token.value = res.data.token;
        useUserStore().user.token = token.value;

        // get user info
        const bearer = { headers: { Authorization: "Bearer " + token.value } };
        axios.get(url + "/api/private/user", bearer)
          .then((res) => {
            useUserStore().user = snakeToCamel(res.data);
          })
          .catch((err) => {
            showError(err.response.data.message);
          });

        // animation
        showTime.value = 3;
        const timer = setInterval(() => {
          showTime.value -= 1;
          if (showTime.value === 0) {
            clearInterval(timer);
            getAvatar();
            router.push("/user/" + useUserStore().user.person.name);
          }
        }, 1000);
      })
      .catch((err) => {
        showError(err.response.data.message);
      });
  }
  return;
}

function showError(err: string) {
  // fail
  isRegistering.value = false;

  // error message
  errorMSG.value = err;

  // animation
  showTime.value = 3;
  const timer = setInterval(() => {
    showTime.value -= 1;
    if (showTime.value === 0) {
      clearInterval(timer);
      errorMSG.value = "";
      blurContent.value = false;
    }
  }, 1000);
}

onMounted(() => {
  // if come from register
  if (useUserStore().user.person.name) {
    // player name
    const nameParts = useUserStore().user.person.name.split("-");
    playerName.value = nameParts[0];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    selectServer.value = rawServers.find((server) => server.subServer.includes(nameParts[1]))!;
    selectSubServer.value = nameParts[1];

    // password
    password.value = useUserStore().user.person.password;

    // activate login
    login();
  }
});

</script>

<template>
  <div>
    <div :class="{'blur-md': blurContent, 'pointer-events-none': blurContent}" class="m-6 flex flex-col space-y-4">

      <div class="flex flex-col space-y-4 bg-base-300 rounded-box p-4 w-6/12 max-w-lg">
        <div class="flex flex-col space-y-4">

          <div class="flex flex-col space-y-4 p-4 justify-items-center bg-base-200 rounded-box">
            <div class="flex space-x-2 items-end">
              <span class="text-base font-bold">角色名称</span>
            </div>
            <div class="flex space-x-2 items-end">
              <input
                v-model="playerName" class="input input-sm input-bordered w-auto max-w-xs font-mono"
                placeholder="例: 蛋卷酥"
                type="text" @blur="setCurrentInput('')" @focus="setCurrentInput('playerName')" />

              <select
                v-model="selectServer" class="select select-sm select-bordered w-fit max-w-xs"
                @blur="setCurrentInput('')" @focus="setCurrentInput('playerName')">
                <option disabled selected>大区</option>
                <option v-for="server in rawServers" :key="server.label" :value="server">{{ server.label }}</option>
              </select>

              <select
                v-if="selectServer" v-model="selectSubServer" class="select select-sm select-bordered w-fit max-w-xs"
                @blur="setCurrentInput('')" @focus="setCurrentInput('playerName')">
                <option disabled>小区</option>
                <option v-for="server in selectServer.subServer" :key="server" :value="server">{{
                    server
                  }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex flex-col space-y-4 p-4 justify-items-center bg-base-200 rounded-box">
            <div class="flex space-x-2 items-end">
              <span class="font-bold">密码</span>
            </div>
            <input
              v-model="password"
              :class="{ 'input-error': !isPasswordValid}"
              class="input input-sm input-bordered w-auto max-w-xs font-mono"
              type="password" @blur="setCurrentInput('')" @focus="setCurrentInput('password')" />
          </div>
        </div>
      </div>

      <div class="flex space-x-1">
        <button :disabled="!isEveryThingOk" class="btn btn-primary w-1/12" @click="login">登录</button>
        <a class="font-moe btn btn-ghost w-1/12" href="/register">注册</a>
      </div>

    </div>

    <div v-if="isRegistering" class="toast toast-center toast-middle">
      <div class="flex flex-col space-y-4 justify-center items-center">
        <span class="loading loading-ring loading-lg"></span>
        <span class="text-lg font-mono font-bold">正在等待服务器相应</span>
      </div>
    </div>

    <div v-if="token" class="toast toast-center toast-middle">
      <div class="flex flex-col space-y-4 justify-center items-center">
        <span class="text-lg font-mono font-bold">已登录成功 即将自动跳转</span>
        <div>
          <span class="countdown font-mono text-4xl">
            <span :style="{'--value': showTime}"></span>
          </span>
          sec
        </div>
      </div>
    </div>

    <div v-if="errorMSG" class="toast toast-center toast-middle">
      <div class="flex flex-col space-y-4 justify-center items-center">
        <span class="text-lg font-bold">{{ errorMSG }}</span>
        <div>
          <span class="countdown font-mono text-4xl">
            <span :style="{'--value': showTime}"></span>
          </span>
          sec
        </div>
      </div>
    </div>
  </div>
</template>
