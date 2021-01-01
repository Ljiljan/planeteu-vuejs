<template>
  <div class="holidays-table">
      <h3>Public Holidays for {{ getSelectedYear }} in {{ getSelectedCountryName }}</h3>
      <div class="msg msg__loading" v-if="isLoading">
          {{ 'Loading data from API' }}
          <img alt="Loader" :src="require(`@/assets/loader.svg`)" width="25">
      </div>
      <div class="msg msg__error" v-if="isError">
          {{ 'There is an error, check console for more info' }}
      </div>
      <table v-if="!isLoading && !isError">
          <tr>
              <th>Name</th>
              <th>Native name</th>
              <th>Date</th>
          </tr>
          <tr v-for="(holiday, index) in getHolidays" :key="index">
              <td>{{ holiday.name }}</td>
              <td>{{ holiday.native }}</td>
              <td>{{ holiday.date }}</td>
          </tr>
      </table>
  </div>
</template>

<script>
export default {
    computed: {
        getSelectedCountryName() {
            return this.$store.getters.getSelectedCountryName
        },
        getSelectedYear() {
            return this.$store.getters.getSelectedYear
        },
        getHolidays() {
            return this.$store.getters.getHolidays
        },
        isLoading() {
            return this.$store.getters.isLoading
        },
        isError() {
            return this.$store.getters.isError
        }
    },
}
</script>

<style lang="less">
  @import '@/assets/css/holidays-table.less';
</style>