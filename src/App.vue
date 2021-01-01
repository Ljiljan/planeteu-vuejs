<template>
  <div id="app">
    <CountrySelector />
    <YearSwitcher />
    <HolidaysTable />
    <ExportHolidays />
  </div>
</template>

<script>
import CountrySelector from '@/components/CountrySelector.vue'
import YearSwitcher from '@/components/YearSwitcher.vue'
import HolidaysTable from '@/components/HolidaysTable.vue'
import ExportHolidays from '@/components/ExportHolidays.vue'

export default {
  components: {
    CountrySelector,
    YearSwitcher,
    HolidaysTable,
    ExportHolidays
  },

  created(){
    this.$store.dispatch('loadHolidays');
  }
}
</script>