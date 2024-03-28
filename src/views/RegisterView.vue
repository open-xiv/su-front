<script lang="ts" setup>
import SvgIcon from "@/components/SvgIcon.vue";
import axios from "axios";
import router from "@/router";
import {useUserStore} from "@/stores/user";
import {useSuStore} from "@/stores/subook";

// focus event
const currentInput = ref<string>("");

function setCurrentInput(input: string) {
  currentInput.value = input;
}

function isFocus(input: string) {
  return currentInput.value === input;
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
  },
];
const selectServer = ref<Server>();
const selectSubServer = ref<string>();

const isNameValid = computed(() => {
  if (playerName.value !== "") {
    return playerName.value.lastIndexOf(" ") === -1;
  }
  return false;
});


// email info
const email = ref<string>("");
const isEmailValid = computed(() => {
  if (email.value !== "") {
    const regex = RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$");
    return regex.test(email.value);
  }
  return true;
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
  const emailCheck = isEmailValid.value && email.value;
  const passwordCheck = isPasswordValid.value && password.value;
  return nameCheck && emailCheck && passwordCheck;
});

// register
const blurContent = ref<boolean>(false);
const isRegistering = ref<boolean>(false);
const userID = ref<string>("");
const showTime = ref<number>(0);
const errorMSG = ref<string>("");

async function register() {
  if (isEveryThingOk) {
    // build person info
    const personInfo = {
      name: playerName.value + "-" + selectSubServer.value,
      email: email.value,
      password: password.value,
    };
    // send request
    const url = useSuStore().serverURL;
    isRegistering.value = true;
    blurContent.value = true;
    axios.post(url + "/api/protect/user", personInfo)
        .then((res) => {
          // success
          isRegistering.value = false;
          userID.value = res.data.id;

          // set user info
          useUserStore().user.id = res.data.id;
          useUserStore().user.person.name = personInfo.name;
          useUserStore().user.person.password = personInfo.password;

          // animation
          showTime.value = 5;
          const timer = setInterval(() => {
            showTime.value -= 1;
            if (showTime.value === 0) {
              clearInterval(timer);
              blurContent.value = false;
              router.push("/login");
            }
          }, 1000);
        })
        .catch((err) => {
          // fail
          isRegistering.value = false;

          // existing bind name
          if (err.response.data.error === "user name already exists") {
            errorMSG.value = "已经绑定的玩家名称";
          }

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
        });
  }
  return;
}

</script>

<template>
  <div>
    <div :class="{'blur-md': blurContent, 'pointer-events-none': blurContent}" class="m-6 flex flex-col space-y-4">

      <div class="flex flex-col space-y-4 bg-base-300 rounded-box p-4 w-9/12 max-x-lg">
        <div class="flex flex-col space-y-4">
          <div class="flex space-x-2 items-end">
            <span class="text-xl font-bold">用户信息绑定</span>
          </div>

          <div class="flex flex-col space-y-4 p-4 justify-items-center bg-base-200 rounded-box">
            <div class="flex space-x-2 items-end">
              <span class="text-base font-bold">角色信息</span>
              <span
                  :class="{'text-primary': isFocus('playerName'), 'text-primary-content': !isFocus('playerName')}"
                  class="text-sm font-moe font-bold">这将决定你的主页路径</span>
            </div>
            <div class="flex space-x-2 items-end">
              <input
                  v-model="playerName" class="input input-sm input-bordered w-2/12 max-w-xs font-mono"
                  placeholder="例: 蛋卷酥"
                  type="text" @blur="setCurrentInput('')" @focus="setCurrentInput('playerName')"/>

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
              <span class="text-base font-bold">邮箱</span>
              <span
                  :class="{'text-secondary': isFocus('email'), 'text-secondary-content': !isFocus('email')}"
                  class="text-sm font-moe font-bold">这将是你丢失密码后的唯一恢复方式</span>
            </div>
            <input
                v-model="email" :class="{ 'input-error': !isEmailValid }"
                class="input input-sm input-bordered w-4/12 max-w-xs font-mono"
                placeholder="例: axsdad@gmail.com"
                type="email" @blur="setCurrentInput('')" @focus="setCurrentInput('email')"/>
          </div>

          <div class="flex flex-col space-y-4 p-4 justify-items-center bg-base-200 rounded-box">
            <div class="flex space-x-2 items-end">
              <span class="font-bold">密码</span>
              <span
                  :class="{'text-secondary': isFocus('password'), 'text-secondary-content': !isFocus('password')}"
                  class="text-sm font-moe font-bold">6-16位 且包含字母及数字</span>
              <span
                  :class="{'text-primary': isFocus('password'), 'text-primary-content': !isFocus('password')}"
                  class="text-sm font-moe font-bold">我们将尽力保证密码的安全 但仍建议您为酥卷使用不同于其他网站的密码</span>
            </div>
            <input
                v-model="password"
                :class="{ 'input-error': !isPasswordValid}"
                class="input input-sm input-bordered w-3/12 max-w-xs font-mono"
                type="password" @blur="setCurrentInput('')" @focus="setCurrentInput('password')"/>
          </div>
        </div>
      </div>

      <button :disabled="!isEveryThingOk" class="btn btn-primary w-1/12" @click="register">注册</button>
    </div>

    <div v-if="isRegistering" class="toast toast-center toast-middle">
      <div class="flex flex-col space-y-4 justify-center items-center">
        <span class="loading loading-ring loading-lg"></span>
        <span class="text-lg font-mono font-bold">正在等待服务器相应</span>
      </div>
    </div>

    <div v-if="userID" class="toast toast-center toast-middle">
      <div class="flex flex-col space-y-4 justify-center items-center">
        <span class="text-lg font-mono font-bold">已注册成功 即将自动跳转</span>
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
        <span class="text-lg font-mono font-bold">{{ errorMSG }}</span>
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
