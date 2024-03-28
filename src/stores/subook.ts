import {ref} from "vue";
import {defineStore} from "pinia";

export const useSuStore = defineStore("server", () => {
    // author
    const author = ref("蛋卷酥-红茶川");

    // subook document title
    const suTitle = ref("酥卷 Beta");

    // server api
    const serverURL = ref("http://localhost:8123");

    // return
    return {author, suTitle, serverURL};
}, {
    persist: true
});
