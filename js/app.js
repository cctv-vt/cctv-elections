let refresh_rate = 20000;
//var api_endpoint = "https://elections.cctv.org/elections/index.php?f=results";
let api_endpoint = "./js/election-results.json"
//Vue Creation
const getSum = function (obj) {
  let sum = 0;
  for (i in obj) {
    sum += obj[i];
  }
  return sum;
};

var app = new Vue({
  el: '#app',
  data: {
    districts: [],
    districtShow: [{
      show: true
    }]
  },
  mounted() {
    this.getResults();
    setInterval(function () {
      this.getResults();
    }.bind(this), refresh_rate);
  },
  //TODO:Todo
  methods: {
    getResults: function () {
      axios.get(api_endpoint)
        .then(function (response) {
          app.districts = response.data.districts;
          //console.log(response.data.districts);
        }).catch(error => {
          console.log(error);
        });
    },
    sortVotes: function (arr) {
      // Set slice() to avoid to generate an infinite loop!
      return arr.slice().sort(function (a, b) {
        console.log(getSum(b.votes) - getSum(a.votes));
        return getSum(b.votes) - getSum(a.votes);
      });
    },
    getSum: function (obj) {
      let sum = 0;
      for (i in obj) {
        sum += obj[i];
      }
      return sum;
    }
  }
});