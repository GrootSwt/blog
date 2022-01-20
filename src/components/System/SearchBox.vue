<template>
  <div class="cg-search-box">
    <div class="cg-search-form" :style="{width: formWidth2}">
      <slot name="form"></slot>
    </div>
    <div class="cg-search-operation" :style="{width: operationWidth2}">
      <slot name="operation"></slot>
    </div>
  </div>
</template>

<script>
import { formatLength } from '@/utils/util'

export default {
  name: 'SearchBox',
  props: {
    // 传入数值时：小于100为百分比，大于100单位px；传入字符串时：不添加单位默认为px
    formWidth: {
      type: [Number, String],
      default: 50
    },
    // 传入数值时：小于100为百分比，大于100单位px；传入字符串时：不添加单位默认为px
    operationWidth: {
      type: [Number, String],
      default: 50
    }
  },
  computed: {
    formWidth2 () {
      return formatLength(this.formWidth)
    },
    operationWidth2 () {
      return formatLength(this.operationWidth)
    }
  }
}
</script>

<style scoped>

</style>
