import {ref} from "vue";
import {defineStore} from "pinia";

export const useSuStore = defineStore("server", () => {
    // author
    const author = ref("蛋卷酥-宇宙和音");

    // subook document title
    const suTitle = ref("酥卷 Beta");

    // server api
    const serverURL = ref("https://subook.api.sumemo.net");

    // return
    return {author, suTitle, serverURL};
});
