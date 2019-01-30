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
const subToggle = () => {
  console.log(event.srcElement.lastChild);
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
  methods: {
    //data retrieval functions
    getResults() {
      //Gets results via an async get
      axios.get(api_endpoint)
        .then(function (response) {
          //Sets the districts array in data to the districts array of the recieved data
          app.districts = response.data.districts;
        }).catch(error => {
          console.log(error);
        });
    },
    //math and sorting functions
    sortVotes(arr) {
      return arr.slice(0, 12).sort(function (a, b) {
        return getSum(b.votes) - getSum(a.votes);
      });
    },
    getSum(obj) {
      let sum = 0;
      for (i in obj) {
        sum += obj[i];
      }
      return sum;
    },
    //rendering and animation functions
    subToggle(ev) {
      let sr = ev.currentTarget.lastChild
      if(sr.style.height == '0px') {
        sr.style.height = 'auto';
      } else {
        sr.style.height = '0px';
      };
    }
  }
});
