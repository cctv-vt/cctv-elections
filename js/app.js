let refresh_rate = 20000;
//var api_endpoint = "https://elections.cctv.org/elections/index.php?f=results";
let api_endpoint = "./js/election-results.json"

//Local Functions
//getSum is used to get and sum the subresults to form the total number of votes
const getSum = (obj) => {
  let sum = 0;
  for (i in obj) {
    sum += obj[i];
  }
  return sum;
};

//subToggle is used to toggle subresults
const subToggle = (event) => {
  
}

//Vue Creation
var app = new Vue({
  el: '#app',
  data: {
    districts: [],
    currentVue : 0,
  },
  mounted() {
    this.getResults();
    setInterval(function () {
      this.getResults();
    }.bind(this), refresh_rate);
  },
  updated() {
    this.$nextTick(function () {
      console.log('loaded');
      anime({
        targets:'#loading',
        easing: 'linear',
        top: -1000,
        duration: 1000,
        delay: 1000
      })
      //setTimeout(document.getElementById('loading').remove(), 501);
    })
  },
  //TODO:Todo
  methods: {
    getResults() {
      axios.get(api_endpoint)
        .then(function (response) {
          app.districts = response.data.districts;
        }).catch(error => {
          console.log(error);
        });
    },
    sortVotes(arr) {
      // Set slice() to avoid to generate an infinite loop!
      return arr.slice().sort(function (a, b) {
        //console.log(getSum(b.votes) - getSum(a.votes));
        return getSum(b.votes) - getSum(a.votes);
      });
    },
    getSum(obj) {
      let sum = 0;
      for (i in obj) {
        sum += obj[i];
      }
      return sum;
    }
  }
});
