let refresh_rate = 20000;
//var api_endpoint = "https://elections.cctv.org/elections/index.php?f=results";
let api_endpoint = "./js/election-results.json"

let navOffset = document.getElementById("nav").offsetTop;
window.onresize = () => {
  document.getElementById("nav").classList.remove("static")
  navOffset = document.getElementById("nav").offsetTop;
  navLock(document.getElementById("nav"))
  console.log(window.innerWidth)
  if (window.innerWidth >= 1000) {
    console.log("wow");
    if (document.getElementById("cmenu-items").style.height == "0px") {
      document.getElementById("cmenu-items").style.height = "auto";
      console.log("cool")
    }
  }
}

window.onscroll = () => {
  navLock(document.getElementById("nav"));
}

//Local Functions
//getSum is used to get and sum the subresults to form the total number of votes
const getSum = (obj) => {
  let sum = 0;
  for (i in obj) {
    sum += obj[i];
  }
  return sum;
};

//misc functions
const navLock = (target) => {
  if (window.pageYOffset >= navOffset) {
    target.classList.add("static")
  } else {
    target.classList.remove("static")
  }
}
 

//Vue Creation
var app = new Vue({
  el: '#app',
  data: {
    districts: [],
    currentVue : 0,
    windowY : 0,
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
        return this.getSum(b.votes) - this.getSum(a.votes);
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
    districtChange(k, ev) {
      document.getElementById("election-results").style.opacity = 0;
      if (window.scrollY > navOffset) {window.scrollTo(0, navOffset)};
      if (window.innerWidth <= 1000) {
        ev.currentTarget.parentElement.style = "0px";
      }
      this.currentVue = k;
      document.getElementById("election-results").style.opacity = 1;
    },
    subToggle(ev) {
      let sr = ev.lastChild
      
      if(sr.style.height == '0px' || !sr.style.height) {
        sr.style.height = 'auto';
      } else {
        sr.style.height = '0px';
      };
    }
  }
});
