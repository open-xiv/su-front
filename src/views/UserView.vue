<script lang="ts" setup>
import SvgIcon from "@/components/SvgIcon.vue";
import {onMounted} from "vue";
import {useSuStore} from "@/stores/subook";
import axios from "axios";
import {snakeToCamel} from "@/tools";
import FightTable from "@/components/FightTable.vue";

// props
const props = defineProps({
  "name": {
    type: String,
    required: true
  }
});

// core data
// fights
const fightIds = ref<string[]>([]);
const fights = ref<FightRecord[]>([]);

// stat - 2 - time
// last record time
const lastRecordTime = computed<[(string | number), string]>(() => {
  if (fights.value.length > 0) {
    // timestamp to date
    const recordTime = new Date(fights.value[fights.value.length - 1].area.op.timestamp * 1000);
    // towards now: "1 hours ago"
    const now = new Date();
    const diff = now.getTime() - recordTime.getTime();
    // match
    if (diff < 60 * 1000) {
      return ["Just", ""];
    } else if (diff < 60 * 60 * 1000) {
      return [Math.floor(diff / (60 * 1000)), " 分钟前"];
    } else if (diff < 24 * 60 * 60 * 1000) {
      return [Math.floor(diff / (60 * 60 * 1000)), " 小时前"];
    } else {
      return [Math.floor(diff / (24 * 60 * 60 * 1000)), " 天前"];
    }
  }
  return ["Invalid", ""];
});

// time analysis
const getTimeAnalysis = computed(() => {
  if (fights.value.length == 0) {
    return "注册了不用是吧💢";
  } else if (lastRecordTime.value[1].lastIndexOf("天") && <number>lastRecordTime.value[0] > 7) {
    return "鉴定为摆烂人";
  } else {
    return "阿伟又在打电动哦 休息一下吧";
  }
});

// stat - 3 - progress
// meta
const suMeta = ref<SuMeta>({
  base: 0,
  total: 2000,
});

// avatar
const avatarUrl = ref<string>("");

// progress
const progress = computed(() => {
  return Math.floor((suMeta.value.base + fightIds.value.length) / suMeta.value.total * 100);
});
const remainNum = computed(() => {
  return suMeta.value.total - fightIds.value.length - suMeta.value.base;
});

// sorted fights
const sortedFights = computed(() => {
  return fights.value.sort((a, b) => a.area.op.timestamp - b.area.op.timestamp);
});


// on mounted
onMounted(() => {
  // change page title
  // convert 'a-b' to 'a - b'
  const name = (props.name ?? "").replace(/-/g, " - ");
  document.title = name + " - " + useSuStore().suTitle;

  // get user fights
  axios.get(useSuStore().serverURL + "/api/public/user/" + props.name + "/fights")
      .then((res) => {
        fightIds.value = snakeToCamel(res.data["fight_ids"]);
        // get fights
        for (const fightId of fightIds.value) {
          axios.get(useSuStore().serverURL + "/api/public/fight/" + fightId)
              .then((res) => {
                fights.value.push(snakeToCamel(res.data["fight_record"]));
              });
        }
      });

  // get user meta
  axios.get(useSuStore().serverURL + "/api/public/user/" + props.name + "/meta")
      .then((res) => {
        suMeta.value = snakeToCamel(res.data["meta"]);
      });

  // get user avatar
  axios.get(useSuStore().serverURL + "/api/public/user/" + props.name + "/avatar")
      .then((res) => {
        avatarUrl.value = snakeToCamel(res.data["avatar_url"]);
      });
});
</script>

<template>
  <div class="w-full">
    <div class="m-6 flex flex-col space-y-4">

      <div v-if="props.name === useSuStore().author" class="alert alert-primary">
        <svg-icon class="h-5 w-5" fill="none" icon-name="hearts" size="20"/>
        <span class="font-moe">这是酥卷开发者的页面！</span>
      </div>

      <div class="stats shadow stats-vertical md:stats-horizontal">

        <div v-if="fightIds" class="stat">
          <div class="stat-figure text-primary">
            <svg-icon class="inline-block w-8 h-8 stroke-current" icon-name="award" size="32"/>
          </div>
          <div class="stat-title">总稻穗次数</div>
          <div class="stat-value text-primary">{{ fightIds.length + suMeta.base }}</div>
          <div class="stat-desc">{{ "含无记录 " + suMeta.base + " 次" }}</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg-icon class="inline-block w-8 h-8 stroke-current" icon-name="clock-rewind" size="32"/>
          </div>
          <div class="stat-title">最近记录时间</div>
          <div class="stat-value text-secondary">
            <span>{{ lastRecordTime[0] }}</span>
            <span v-if="lastRecordTime[1]" class="text-xl">{{ lastRecordTime[1] }}</span>
          </div>
          <div class="stat-desc">{{ getTimeAnalysis }}</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <div class="avatar">
              <div v-if="avatarUrl" class="w-16 rounded-full">
                <img :src="avatarUrl" alt="avatar"/>
              </div>
              <span v-if="!avatarUrl" class="loading loading-ring loading-lg"></span>
            </div>
          </div>
          <div class="stat-value">{{ progress + "%" }}</div>
          <div class="stat-title">任务完成进度</div>
          <div class="stat-desc text-secondary">{{ "余 " + remainNum + " 次" }}</div>
        </div>

      </div>

      <div v-if="fights && fights.length !== 0" class="flex flex-col space-y-2">
        <fight-table
            v-for="(fight, f_idx) in sortedFights" :key="f_idx" :fight="fight" :idx="f_idx as number + suMeta.base + 1"/>
      </div>

    </div>
  </div>
</template>
