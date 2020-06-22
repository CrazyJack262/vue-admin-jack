<template>
  <div>
    <h2>{{ title }}</h2>
    <div class="line" />
  </div>
</template>

<script>
export default {
  name: 'DividingLine',
  props: {
    title: String
  }
}
</script>

<style scoped>
  .line {
    position: relative;
    height: 1px;
    margin-top: -10px;
    background-color: #d4d4d4;
    text-align: center;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
  }
</style>
