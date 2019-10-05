'use strict';


const store = new Vuex.Store({
  state: {
    searchQuery: '',
    gridColumns: ['name', 'power'],
    gridData: [
      { name: 'Chuck Norris', power: Infinity },
      { name: 'Bruce Lee', power: 9000 },
      { name: 'Jackie Chan', power: 7000 },
      { name: 'Jet Li', power: 8000 }
    ]
  },
  mutations: {
    setQuery: (state, query) => state.searchQuery = query
  },
  actions: {
    search: ({commit}, query) => commit('setQuery', query),
  }
});


const grid = {
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },

  data () {
    let sortOrders = {};
    this.columns.forEach(key => sortOrders[key] = 1);
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },

  computed: {
    filteredData: function() {
      let sortKey = this.sortKey;
      let filterKey = this.filterKey && this.filterKey.toLowerCase();
      let order = this.sortOrders[sortKey] || 1;
      let data = this.data;
      if (filterKey) {
        data = data.filter(
          row => Object.keys(row).some(
            key => String(row[key]).toLowerCase().indexOf(filterKey) > -1))
      }
      if (sortKey) {
        data = data.slice().sort((a, b) => {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        })
      }
      return data
    }
  },

  filters: {
    capitalize: function (str) {
      return str[0].toUpperCase() + str.slice(1);
    }
  },

  methods: {
    sortBy: function(key) {
      this.sortKey = key;
      this.sortOrders[key] = -this.sortOrders[key];
    }
  },

  template: `
    <table>
      <thead>
        <tr>
          <th v-for="key in columns"
            @click="sortBy(key)"
            :key="key"
            :class="{ active: sortKey == key }">
            {{ key | capitalize }}
            <span
              class="arrow"
              :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in filteredData">
          <td v-for="key in columns">
            {{ entry[key] }}
          </td>
        </tr>
      </tbody>
    </table>
  `
};


const demp = new Vue({
  el: '#app',
  store,
  components: {
    'data-grid': grid
  },
  computed: Vuex.mapState({
    searchQuery: state => state.searchQuery,
    gridColumns: state => state.gridColumns,
    gridData: state => state.gridData
  }),
  methods: {
    search(value) {
      this.$store.dispatch('search', value)
    }
  },
  template: `
    <div>
      <form id="search">
        Search <input
          name="query"
          :value="searchQuery"
          @input="search($event.target.value)">
      </form>
      <data-grid
        :data="gridData"
        :columns="gridColumns"
        :filter-key="searchQuery" />
    </div>
  `
})