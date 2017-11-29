(function () {
  var router = new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: {
          data: function () {
            return {
              photos: []
            };
          },
          template: '<div>{{ photos }}</div>',
          created: function () {
            this.fetchData();
          },
          methods: {
            fetchData: function () {
              this.$http.get('/api/photos').then(function (response) {
                this.photos = response.body;
              });
            }
          }
        }
      },
      {
        path: '/uploader',
        component: {
          template: '<div>uploader</div>'
        }
      }
    ]
  });

  var app = new Vue({
    el: '#root',
    router: router,
    data: {
      message: 'Hello Vue!'
    }
  });
})();
