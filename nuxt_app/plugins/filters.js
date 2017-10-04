import Vue from 'vue'

import DateFilter from '~/filters/date'
import TrancateText from '~/filters/text'

Vue.filter('filteredDate', DateFilter)
Vue.filter('trancateText', TrancateText)