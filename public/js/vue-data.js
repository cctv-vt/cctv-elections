//
var app = new Vue({
    el: '#app',
    data: {
        districts: [
          {
            show: true,
            title: 'Gable Town',
            elections: [
              {
                title:'Mayor of Gable Town',
                results: [
                  {
                    name:'John Cooldude',
                    votes: 0,
                    cell: 'c3'
                  },
                  {
                    name:'Beans McBeans',
                    votes: 0,
                    cell: 'c4'
                  },
                  {
                    name:'Gingo Bubelmann',
                    votes: 0,
                    cell: 'c5'
                  },
                  {
                    name:'New Candidate',
                    votes: 0,
                    cell: 'c6'
                  },
                  {
                    name:'Incumbent',
                    votes: 0,
                    cell: 'c7'
                  },
                ]
              },
            ]
          }, 
        ]
    },
    methods: {
      even: function(arr) {
        // Set slice() to avoid to generate an infinite loop!
        return arr.slice().sort(function(a, b) {
          return b.votes - a.votes;
        });
      },
      loadResults: function() {
        this.votes = 0;
        app = this;
        axios.get('./js/election-results.json').then(function (response) {
          return response;
        });
      }
      }
    });
