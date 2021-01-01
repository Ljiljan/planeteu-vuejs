import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueToast from 'vue-toast-notification';

Vue.use(Vuex)
Vue.use(VueToast)

const DEFAULT_COUNTRY = 'ba'
const DEFAULT_COUNTRY_NAME = 'Bosnia and Herzegovina'
const DEFAULT_YEAR = new Date().getFullYear();
const DEFAULT_API_CALL_TIMEOUT = 500;

const store = new Vuex.Store({
    state: {
        app: {
            loading: false,
            error: false
        },
        geoLocation: {
            latitude: null,
            longitude: null
        },
        selectedCountry: DEFAULT_COUNTRY,
        selectedCountryName: DEFAULT_COUNTRY_NAME,
        selectedYear: DEFAULT_YEAR,
        currentYear: DEFAULT_YEAR,
        countries: [
            { code: 'ba', name: 'Bosnia and Herzegovina' },
            { code: 'hr', name: 'Croatia' },
            { code: 'de', name: 'Germany' },
            { code: 'it', name: 'Italy' },
            { code: 'nl', name: 'Netherlands' },
            { code: 'se', name: 'Sweden' }
        ],
        holidays: []
    },
    getters: {
        getSelectedCountry: state => state.selectedCountry,
        getAllCountries: state => state.countries,
        getSelectedCountryName: state => state.countries.find(e => e.code === state.selectedCountry).name,
        getSelectedYear: state => state.selectedYear,
        getHolidays: state => state.holidays,
        getCurrentYear: state => state.currentYear,
        getGeoLocationData: state => state.geoLocation,
        isLoading: state => state.app.loading,
        isError: state => state.app.error
    },
    mutations: {
        SET_SelectedCountry (state, country) {
            state.selectedCountry = country
        },
        SET_SelectedYear (state, year) {
            state.selectedYear = year
        },
        SET_LoadingState (state, loading) {
            state.app.loading = loading
        },
        SET_ErrorState (state, error) {
            state.app.error = error
        },
        SET_Holidays (state, holidays) {
            state.holidays = holidays
        },
        SET_GeoLocationData (state, location) {
            state.geoLocation.longitude = location.coords.longitude
            state.geoLocation.latitude = location.coords.latitude
        }
    },
    actions: {
        // Set geolocation data from browser
        setGeoLocationData ({ commit }, payload) {
            commit('SET_GeoLocationData', payload)
        },
        // Set selected year in async way
        setSelectedYear ({ commit }, payload) {
            commit('SET_SelectedYear', payload)
        },
        // Load holidays data from API
        loadHolidays ({ commit }) {
            commit('SET_LoadingState', true)
            commit('SET_ErrorState', false)
            setTimeout(() => {
                axios
                    .get(`https://www.planeteu.com/holidays-api/api/api.php?yr=${this.state.selectedYear}&country=${this.state.selectedCountry}&key=${process.env.VUE_APP_PLANETEU_API_KEY}`)
                    .then(response => {
                        commit('SET_Holidays', response.data)
                    })
                    .catch(error => {
                        console.log('Error message:', error.message)
                        commit('SET_ErrorState', true)
                    })
                    .finally(() => {
                        commit('SET_LoadingState', false)
                    })
            }, DEFAULT_API_CALL_TIMEOUT)
        },
        // Get data from reverse geolocation service
        loadGeoLocation ({ commit }) {
            if (this.state.geoLocation.latitude) {
                axios
                    .get(`https://eu1.locationiq.com/v1/reverse.php?key=${process.env.VUE_APP_LOCATIONIQ_KEY}&lat=${this.state.geoLocation.latitude}&lon=${this.state.geoLocation.longitude}&format=json`)
                    .then(response => {
                        return response.data
                    })
                    .then(geoLocation => {
                        let countryName = geoLocation.address.country
                        if (this.state.countries.find(el => el.code === geoLocation.address.country_code) !== undefined) {
                            Vue.$toast.open(`Country ${countryName} is set by geolocation`)
                            commit('SET_SelectedCountry', geoLocation.address.country_code)
                        } else {
                            Vue.$toast.open({
                                message: `Country ${countryName} is not available!`,
                                type: 'error'
                            })
                        }
                    })
                    .catch(error => {
                        console.log('Error message:', error.message)
                    })
            }
        }
    }
})

export default store