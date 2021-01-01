<template>
  <div class="country-selector">
    <select id="countrySelect" v-model="selectedCountry" @change="onCountryChange">
      <option
        :value="option.code"
        v-for="(option, index) in getAllCountries"
        :disabled="isLoading"
        :key="index"
      >{{ option.name }}</option>
    </select>
    <country-flag :country='selectedCountry' size='big'/>
    <geo-located-country />
  </div>
</template>

<script>
import Vue from 'vue'
import CountryFlag from 'vue-country-flag'
import GeoLocatedCountry from '@/components/GeoLocatedCountry.vue'

Vue.component('country-flag', CountryFlag)
Vue.component('geo-located-country', GeoLocatedCountry)

export default {
  computed: {
    selectedCountry:
    {
        get() { return this.$store.getters.getSelectedCountry },
        set(value) { this.$store.commit('SET_SelectedCountry', value) }
    },
    getAllCountries() {
      return this.$store.getters.getAllCountries
    },
    isLoading() {
      return this.$store.getters.isLoading
    },
  },

  methods: {
    // Executed on change event for selector
    onCountryChange(event) {
      this.$store.dispatch('loadHolidays')
    },
  }
}
</script>

<style lang="less">
  @import '@/assets/css/country-selector.less';
</style>
