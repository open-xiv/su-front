import { ref } from "vue";
import { defineStore } from "pinia";
import { Md5 } from "ts-md5";

export const useUserStore = defineStore("user", () => {
  const user = ref<User>({
    id: "",
    person: {
      name: "",
      email: "",
      avatarUrl: "",
      password: "",
      key: ""
    },
    meta: {
      base: 0,
      total: 2000
    },
    fightIds: [],
    serverRecord: {
      ip: "",
      update: 0
    },
    token: ""
  });

  function getAvatarURL() {
    if (user.value.person.avatarUrl === "") {
      return "https://www.gravatar.com/avatar/" + Md5.hashStr(user.value.person.email) + "?d=mp";
    } else {
      return user.value.person.avatarUrl;
    }
  }

  return { user, getAvatarURL };
}, {
  persist: true
});
