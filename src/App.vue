<template>
  <router-view v-slot="{ Component }">
    <keep-alive exclude="Detail">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style scoped>

</style>
