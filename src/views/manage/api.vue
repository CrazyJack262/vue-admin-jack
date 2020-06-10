<template>
  <div class="app-container">
    <iframe id="apiIframe" :src="src" width="100%" scrolling="yes" frameborder="0" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: 'http://localhost:8080/swagger-ui.html#/'
    }
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    const oIframe = document.getElementById('apiIframe')
    const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    oIframe.style.width = (Number(deviceWidth) - 220) + 'px'
    oIframe.style.height = (Number(deviceHeight) - 120) + 'px'
  }
}
</script>
