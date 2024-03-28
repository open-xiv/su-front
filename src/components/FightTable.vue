<script lang="ts" setup>

// props
const props = defineProps<{
  idx: number;
  fight: FightRecord;
}>();

const timeString = computed(() => {
  const date = new Date(props.fight.area.op.timestamp * 1000);
  return date.toLocaleString();
});
</script>

<template>
  <div class="flex items-center space-x-4 w-full">
    <div class="collapse collapse-arrow border border-base-300 bg-base-200" tabindex="0">

      <div class="collapse-title flex items-center justify-between">
        <p class="ml-2 text-base font-medium font-mono"> {{
            idx.toString().padStart(4, "0") + " " + props.fight.area.instance.name
          }}</p>
        <div class="text-sm font-mono flex space-x-4">
          <p class="text-primary/50 hidden lg:block">{{ timeString }}</p>
          <p class="text-sm font-mono hidden sm:block"> {{
              props.fight.players[0].job.name + " lv." + props.fight.players[0].level
            }}</p>
        </div>
      </div>

      <div class="collapse-content flex flex-col space-y-4">

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
