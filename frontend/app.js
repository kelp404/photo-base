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
              Vue.http.get('/api/photos').then(function (response) {
                this.photos = response.body;
              });
            }
          }
        }
      },
      {
        path: '/uploader',
        component: function (resolve) {
          Vue.http.get('/templates/uploader.html').then(function (response) {
            resolve({
              template: response.body
            });
          });
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
