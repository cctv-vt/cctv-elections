var refresh_rate = 20000;

//Vue Creation
var app = new Vue({
    el: '#app',
    data: {
        districts: [
          {
            show:true
          },
          {
            show:true
          },
          {
            show:true
          },
          {
            show:true
          }
        ]
    },
    mounted () {
      this.getResults();

      setInterval(function () {
        this.getResults();
      }.bind(this), refresh_rate);
    },
    //TODO:Todo
    methods: {
        getResults: function() {
            axios.get("https://elections.cctv.org/elections/index.php?f=results")
            .then(function(response){
                app.districts = response.data.districts;
                console.log(response.data.districts)
            }).catch(error => { console.log(error); });
          },
        even: function(arr) {
            // Set slice() to avoid to generate an infinite loop!
            return arr.slice().sort(function(a, b) {
              return b.votes - a.votes;
            });
          },
    }
});