(function () {
  Vue.use(Croppa);
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
              template: response.body,
              data: function () {
                return {
                  croppa: {}
                };
              },
              methods: {
                uploadCroppedImage: function () {
                  this.croppa.generateBlob(function (blob) {
                    var form = new FormData();
                    form.append('file', blob);
                    Vue.http.post('/api/photos', form, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    });
                  }, 'image/jpeg', 0.8);
                }
              }
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
