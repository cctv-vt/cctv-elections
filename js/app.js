let refresh_rate = 20000;
//var api_endpoint = "https://elections.cctv.org/elections/index.php?f=results";
let api_endpoint = "./js/election-results.json"
//Vue Creation
const getSum = (obj) => {
  let sum = 0;
  for (i in obj) {
    sum += obj[i];
  }
  return sum;
};

const districtClose = (str, element) => {
  animClose = anime({
    targets: element,
    easing: 'easeInBack',
    scaleY: {
      value: 0,
      duration: 200,
    },
    height: {
      value: 0,
      duration: 300
    },
    autoplay: false
  });

  animOpen = anime({
    targets: element,
    easing: 'easeOutBack',
    scaleY: {
      value: 1.0,
      duration: 250,
      delay: 200
    },
    height: {
      value: 900,
      duration: 300
    },
    autoplay: false
  });
  if (str === 'close') {
    animClose.play();
  } else {
    animOpen.play();
  }
}

var app = new Vue({
  el: '#app',
  data: {
    districts: [],
    districtShow: [{
      show: false
    },{ show: false }]
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
    },
    vueDistrictClose: function (i, event) {
      if (app.districtShow[i]) {
        districtClose('close', event.srcElement.nextSibling.nextSibling);
        app.districtShow[i] = false;
      } else {
        app.districtShow[i] = true;
        districtClose('open', event.srcElement.nextSibling.nextSibling);
      }
    }
  }
});