<template>
  <div class="year-switcher">
    {{ 'Select year:' }}
    <button
      :class="classNameGenerator(year)"
      v-for="(year, index) in generatedYears(selectedYear)"
      @click="onYearSwitch($event)"
      :data-year="year"
      :key="index"
      :disabled="isLoading"
    >{{ year }}</button>

    <button
      class="year-switcher__btn year-switcher__btn__reset"
      v-if="isResetButtonAvailable()"
      @click="resetToCurrentYear"
    >{{ 'Reset' }}</button>
  </div>
</template>

<script>
const NUMBER_YEARS_TO_SHOW = 5;
const NUMBER_YEARS_TO_SHOW_RESET = 3;
const MIN_SUPPORTED_YEAR = 1970; // Min year supported by api
const MAX_SUPPORTED_YEAR = 2035; // Max year supported by api

export default {
  computed: {
    selectedYear() {
      return this.$store.getters.getSelectedYear
    },
    currentYear() {
      return this.$store.getters.getCurrentYear
    },
    isLoading() {
      return this.$store.getters.isLoading
    }
  },

  methods: {
    // Method which determine how many years are presented in slider
    generatedYears(selectedYear) {
      let years = []
      let startYear = selectedYear - NUMBER_YEARS_TO_SHOW <= MIN_SUPPORTED_YEAR
        ? MIN_SUPPORTED_YEAR : selectedYear - NUMBER_YEARS_TO_SHOW
      let endYear = selectedYear + NUMBER_YEARS_TO_SHOW >= MAX_SUPPORTED_YEAR
        ? MAX_SUPPORTED_YEAR : selectedYear + NUMBER_YEARS_TO_SHOW

      while ( startYear <= endYear) {
          years.push(startYear++)
      }

      return years
    },
    // Executed on switching years
    onYearSwitch(event) {
      let year = parseInt(event.target.dataset.year)
      this.$store.dispatch('setSelectedYear', year)
      this.$store.dispatch('loadHolidays')
    },
    // Generate higlighted class for year switcher buttons
    classNameGenerator(year) {
      if (year === this.selectedYear) {
        return 'year-switcher__btn highlighted'
      }
      return 'year-switcher__btn'
    },
    // Determine if reset button is visible
    isResetButtonAvailable() {
      if (this.currentYear + NUMBER_YEARS_TO_SHOW_RESET < this.selectedYear
        || this.currentYear - NUMBER_YEARS_TO_SHOW_RESET > this.selectedYear
      ) {
        return true
      }
      return false;
    },
    // Reset button functionality
    resetToCurrentYear() {
      this.$store.dispatch('setSelectedYear', this.currentYear)
      this.$store.dispatch('loadHolidays')
    }
  }
}
</script>

<style lang="less">
  @import '@/assets/css/year-switcher.less';
</style>
