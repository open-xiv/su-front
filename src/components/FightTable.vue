<script lang="ts" setup>

// props
const props = defineProps<{
  idx: number;
  fight: FightRecord;
}>();

const timeString = computed(() => {
  const timestamp = props.fight.area.op.timestamp;
  if (timestamp < 1687400000) {
    return "NaN";
  }
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
});

const fullRecord = computed(() => {
  return props.fight.players.length > 1;
});
</script>

<template>
  <div class="flex items-center space-x-4 w-full">
    <div :class="{'collapse-arrow': fullRecord}" class="collapse border border-base-300 bg-base-200">
      <input type="checkbox" />

      <div class="collapse-title flex items-center justify-between">
        <div class="flex flex-col items-start ml-2">
          <p class="text-base font-medium font-mono">
            {{ idx.toString().padStart(4, "0") + " " + props.fight.area.instance.name }}
          </p>
          <p v-if="timeString != 'NaN'" class="text-sm font-mono text-gray-600 hidden lg:block">{{ timeString }}</p>
        </div>

        <div class="text-sm font-mono flex space-x-4 items-center">
          <p class="font-mono font-bold hidden sm:block">
            {{ props.fight.players[0].job.name + " lv." + props.fight.players[0].level }}
          </p>
        </div>
      </div>

      <div v-if="fullRecord" class="collapse-content flex flex-row space-x-4">

        <table class="table table-sm card glass w-2/3">
          <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>职业</th>
            <th>等级</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(player, p_idx) in props.fight.players" :key="player.id"
            :class="{ 'bg-base-300': p_idx == 0 }">
            <td class="font-mono">{{ p_idx + 1 }}</td>
            <td>
              <div class="flex flex-col">
                <span class="font-bold">{{ player.name }}</span>
                <span v-if="player.server" class="text-xs">{{ player.server }}</span>
              </div>
            </td>
            <td>{{ player.job.name }}</td>
            <td class="font-mono">{{ "lv." + player.level }}</td>
          </tr>
          </tbody>
        </table>

        <textarea class="textarea textarea-bordered bg-gray-200 w-1/3 font-mono" spellcheck="false" />

      </div>
    </div>
  </div>
</template>
