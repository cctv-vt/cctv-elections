// ─── VARIABLES ──────────────────────────────────────────────────────────────────
//refresh rate definition 
var refresh_rate = 10000 + Math.floor((Math.random() * 10000));

// extracts url parameters (this uses a polyfill for older browsers)
var url = new URLSearchParams(window.location.search);

//assigns variables/handles defaults
var d = url.get("d") || 0;
var e = url.get("e") || 0;
var ev = url.get("ev") || "default";
var theme = url.get("theme") || "classic";

//defines api endpoint based on the url, the parameter 'f' defines the name of the json file to pull from the server
var api_endpoint = "https://elections-api.cctv.org/api.php?f=" + ev;

// coverageHeightFix is run when the page loads or the user resizes the window
window.onload = function () {
  coverageHeightFix();
};
window.onresize = function () {
  coverageHeightFix();
};

//this sticks the navbar to the top when the page is scrolled
window.onscroll = function () {
  navLock();
};

// ─── FUNCTIONS ──────────────────────────────────────────────────────────────────

const getSum = function (obj) {
  /* getSum is used to get and sum the sub-results
  to form the total number of votes */
  var sum = 0;
  for (i in obj) {
    sum += obj[i];
  }
  return sum;
};

const coverageHeightFix = function () {
  /* coverageHeightFix changes the height of the 'election-coverage' element
  to make sure that the background renders correctly */
  document.getElementById("nav").classList.remove("static");
  navOffset = document.getElementById("nav").offsetTop;
  document.getElementById("election-coverage").style.height = navOffset + 'px';
  navLock();
  if (window.innerWidth >= 1000) {
    var menuItems = document.getElementById("cmenu-items").style;
    menuItems.height = "auto";
    menuItems.opacity = 1;

  }
}

const navLock = function () {
  /* navLock makes the 'nav' element attach to the top of the page 
  by applying the css class 'static' */
  var target = document.getElementById("nav")
  if (window.pageYOffset >= navOffset) {
    target.classList.add("static")
  } else {
    target.classList.remove("static")
  }
}

// ─── VUE ────────────────────────────────────────────────────────────────────────
var app = new Vue({
  el: '#app',
  data: {
    /* districts holds all of the data, including names, numbers, 
    and a few district specific configuration options */
    districts: [
      {
      title: "Loading",
      results: [
        {
          name: "loading...",
          votes: {
            loading: " votes...",
        }
        }
      ]
    }],
    /* evSettings has event level settings  */
    evSettings: {
      title: "Elections Page",
      live: false,
      links: [
        {
          title: "Channel 17 Home",
          href: "http://www.cctv.org/about-us/channel-17"
        },
        {
          title: "Exit Voices",
          href: "https://www.youtube.com/watch?v=m2P6DjVub2A&list=PLljLFn4BZd2O7bG1XHuWl54Dh80sqkHNc"
        },
        {
          title: "Election Forums",
          href: "https://www.youtube.com/watch?v=XCvoxGEx6gk&list=PLljLFn4BZd2M9DJ8C-_zpZYKVBuzxVMIP"
        },
        {
          title: "Donate",
          href: "https://www.cctv.org/civicrm/contribute/transact?reset=1&id=4"
        }
      ],
      embed: {
        youtube: "-9N1gGuHCaM",
        twitter: "https://twitter.com/ch_17/timelines/1098311669133000704?ref_src=twsrc%5Etfw"
      }
    },
    currentVue: d,
    dist: d,
    elec: e,
    theme: theme,
    settings: {
      classic: {
        img: "img/logo.svg",
        color: [
          "#A76DA6",
          "#FEE351",
          "#D6647F",
          "#79A8ED",
          "#78E381",
        ]
      },
      tmd19: {
        img: "img/newlogo.svg",
        styles: "css/tmd19/styles.css",
        color: [
          "#FFB800",
          "#AD00FF",
          "#00E0FF",
          "#FF003D",
          "#00FF75",
        ]
      }

    }

  },
  mounted() {
    this.getResults();
    console.log(this.evSettings.title)
    document.title = this.evSettings.title
    if (this.evSettings.live) {
      setInterval(function () {
        this.getResults();
      }.bind(this), refresh_rate);
    }
  },
  methods: {
    //data retrieval functions
    getResults() {
      //Gets results via an async get
      axios.get(api_endpoint)
        .then(function (response) {
          //Sets the districts array in data to the districts array of the received data
          console.log("Receiving results from remote API endpoint at " + new Date());
          app.districts = response.data.districts;
          app.evSettings = response.data.evSettings;
          document.title = app.evSettings.title
          console.log(response.data.evSettings)
        }).catch(function (error) {
          console.log(error);
        });
    },
    //math and sorting functions
    sortVotes(arr) {
      if (arr.length > 2) {
        return arr.slice(0, 12).sort(function (a, b) {
          return app.getSum(b.votes) - app.getSum(a.votes);
        });
      } else {
        return arr;
      }
    },
    getSum(obj) {
      var sum = 0;
      for (i in obj) {
        sum += obj[i];
      }
      return sum;
    },
    getVotePerc(elec, votes, round) {
      electionTotal = 0;
      for (res of elec.results) {
        electionTotal += this.getSum(res.votes);
      }
      if (round) {
        if (votes / electionTotal) {
          return Math.round((votes / electionTotal) * 100);
        } else return 0;
      } else {
        if (votes / electionTotal) {
          return (votes / electionTotal) * 100;
        } else return 0;
      }

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
      if (window.scrollY > navOffset) {
        window.scrollTo(0, navOffset)
      };
      if (window.innerWidth <= 1000) {
        ev.currentTarget.parentElement.style = "0px";
      }
      this.currentVue = k;
      dChangeAnim.reverse();

    },
    subToggle(ev, v, eh) {
      //'ev' refers to the clicked element, 
      //'v' refers to the object that is iterated for the drop down, 
      //and 'eh' is the height one of the iterated objects
      var sr = ev.lastChild
      var h = this.subResultsLength(v)
      if (sr.style.height == '0px' || !sr.style.height) {
        sr.style.height = h * eh + 'px';
        sr.style.opacity = '1.0';
      } else {
        sr.style.height = '0px';
        sr.style.opacity = '0.0';
      };
    },
    themeToggle() {

    }
  }
});