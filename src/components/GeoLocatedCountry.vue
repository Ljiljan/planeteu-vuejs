<template>
  <span
    class="geo-location"
    title="Get automatic location"
    @click="onGeoLocationClick"
  >
    <img alt="Vue logo" :src="require(`@/assets/location.svg`)" width="45">
  </span>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueToast)

export default {
  computed: {
    getSelectedCountry() {
      return this.$store.getters.getSelectedCountry
    },
    getSelectedCountryName() {
      return this.$store.getters.getSelectedCountryName
    },
    getGeoLocation() {
      return this.$store.getters.getGeoLocationData
    },
    isLoading() {
        return this.$store.getters.isLoading
    },
    isError() {
        return this.$store.getters.isError
    }
  },
  methods: {
    onGeoLocationClick() {
      // Check if geolocation supported by browser
      if(!("geolocation" in navigator)) {
        Vue.$toast.open({
            message: 'Geolocation is not available',
            type: 'error'
        })
        return;
      }
      // Get location by HTML geolocation API
      navigator.geolocation.getCurrentPosition(position => {
        this.$store.dispatch('setGeoLocationData', position)
        this.$store.dispatch('loadGeoLocation')
        this.$store.dispatch('loadHolidays')
      }, error => {
        Vue.$toast.open({
            message: error.message,
            type: 'error'
        })
      })
    },
  }
}
</script>

<style lang="less">
  @import '@/assets/css/geo-location.less';
</style>