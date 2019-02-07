var refresh_rate = 20000;
//var api_endpoint = "https://elections.cctv.org/elections/index.php?f=results";
var api_endpoint = "https://elections-api.cctv.org/api.php?f=results"

var navOffset = document.getElementById("nav").offsetTop;
window.onresize = () => {
  document.getElementById("nav").classList.remove("static")
  navOffset = document.getElementById("nav").offsetTop;
  navLock(document.getElementById("nav"))
  if (window.innerWidth >= 1000) {
    document.getElementById("cmenu-items").style.height = "auto";
  }
}

window.onscroll = function() {
  navLock(document.getElementById("nav"));
}

//Local Functions
//getSum is used to get and sum the subresults to form the total number of votes
const getSum = function(obj) {
  var sum = 0;
  for (i in obj) {
    sum += obj[i];
  }
  return sum;
};

//misc functions
const navLock = function(target) {
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
    districts: [
      {
        "title": "Loading",
        "results": [
          {
            "name": "loading...",
            "votes": {
            "loading": " votes...",
            }
          }
        ]
      }
    ],
    currentVue : 0,
    settings: {
      color: [
        "#FFB800",
        "#AD00FF",
        "#00E0FF",
        "#00FF75",
        "#FF003D",
      ]
    }
    
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
          console.log("Receiving results from remote API endpoint.")
          app.districts = response.data.districts;
        }).catch(function(error) {
          console.log(error);
        });
    },
    //math and sorting functions
    sortVotes(arr) {
      return arr.slice(0, 12).sort(function (a, b) {
        return app.getSum(b.votes) - app.getSum(a.votes);
      });
    },
    getSum(obj) {
      var sum = 0;
      for (i in obj) {
        sum += obj[i];
      }
      return sum;
    },
    getVotePerc(elec, votes) {
      electionTotal = 0;
      for (res of elec.results) {
        electionTotal += this.getSum(res.votes);
      }
      return (votes/electionTotal)*100;
    },
    subResultsLength(obj) {
      var len = 0
      for (d in obj) {
        len += 1
      }
      return len
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
    subToggle(ev, v, eh) {
      //'ev' refers to the clicked element, 
      //'v' refers to the object that is iterated for the drop down, 
      //and 'eh' is the height one of the iterated objects
      var sr = ev.lastChild
      var h = this.subResultsLength(v)
      if(sr.style.height == '0px' || !sr.style.height) {
        sr.style.height = h * eh + 'px';
      } else {
        sr.style.height = '0px';
      };
    }
  }
});
