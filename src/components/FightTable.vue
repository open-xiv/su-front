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
    <div :class="{'collapse-arrow': fullRecord}" class="collapse border border-base-300 bg-base-200" tabindex="0">

      <div class="collapse-title flex items-center justify-between">
        <div class="flex space-x-4 items-center">
          <p class="ml-2 text-base font-medium font-mono">
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

      <div v-if="fullRecord" class="collapse-content flex flex-col space-y-4">

        <table class="table table-sm card glass">
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
            <td>{{ player.name }}</td>
            <td>{{ player.job.name }}</td>
            <td class="font-mono">{{ "lv." + player.level }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
