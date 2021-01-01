<template>
  <div class="export-holidays" v-if="!isLoading && !isError">
    <button
        @click="exportToJsonFile(getHolidays)"
        title="Download holidays in JSON format"
    >
        <i class="json-icon">JSON</i>
        {{ 'Export to JSON' }}
    </button>
    <button
        @click="exportToCsvFile(getHolidays)"
        title="Download holidays in CSV format"
    >
        <i class="csv-icon">CSV</i>
        {{ 'Export to CSV' }}
    </button>
  </div>
</template>

<script>
export default {
    computed: {
        getSelectedCountry() {
            return this.$store.getters.getSelectedCountry
        },
        getSelectedYear() {
            return this.$store.getters.getSelectedYear
        },
        isLoading() {
            return this.$store.getters.isLoading
        },
        isError() {
            return this.$store.getters.isError
        },
        getHolidays() {
            return this.$store.getters.getHolidays
        }
    },

    methods: {
        // Converting JSON data and exporting
        exportToJsonFile(jsonData) {
            jsonData = this.filteredData(jsonData)
            let dataStr = JSON.stringify(jsonData)
            let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

            let exportFileDefaultName = `holidays-${this.getSelectedCountry}-${this.getSelectedYear}.json`

            let linkElement = document.createElement('a')
            linkElement.setAttribute('href', dataUri)
            linkElement.setAttribute('download', exportFileDefaultName)
            linkElement.click()
        },
        // Parse JSON to CSV string
        parseJSONToCSVStr(jsonData) {
            jsonData = this.filteredData(jsonData)

            if(jsonData.length == 0) {
                return '';
            }

            let keys = Object.keys(jsonData[0])

            let columnDelimiter = ';'
            let lineDelimiter = '\n'

            let csvColumnHeader = keys.join(columnDelimiter)
            let csvStr = csvColumnHeader + lineDelimiter

            jsonData.forEach(item => {
                keys.forEach((key, index) => {
                    csvStr += item[key]
                    if( index < keys.length-1 ) {
                        csvStr += columnDelimiter
                    }
                })
                csvStr += lineDelimiter
            });

            return encodeURIComponent(csvStr)
        },
        // Exporting of CSV file
        exportToCsvFile(jsonData) {
            let csvStr = this.parseJSONToCSVStr(jsonData)
            let dataUri = 'data:text/csv;charset=utf-8,'+ csvStr

            let exportFileDefaultName = `holidays-${this.getSelectedCountry}-${this.getSelectedYear}.csv`

            let linkElement = document.createElement('a')
            linkElement.setAttribute('href', dataUri)
            linkElement.setAttribute('download', exportFileDefaultName)
            linkElement.click()
        },
        // Filtering json to match app data
        filteredData(jsonData) {
            let filteredData = jsonData.map(function(data) {
                return {
                    Name: data.name,
                    Native: data.native,
                    Date: data.date
                }
            })

            return filteredData
        }
    }
}
</script>

<style lang="less">
  @import '@/assets/css/export-holidays.less';
</style>