<template>
  <layout>
    <div class="min-vh100-fh">
      <slot />
    </div>

    <main-footer />
  </layout>
</template>

<script>
import Layout from '@/components/layout/Layout'
import MainFooter from '@/components/layout/MainFooter'

export default {
  components: {
    Layout,
    MainFooter
  }
}
</script>
