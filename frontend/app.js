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
                  croppa: {},
                  initialImage: null,
                  result: null
                };
              },
              methods: {
                loadImage: function () {
                  var image = new Image();
                  image.setAttribute('crossorigin', 'anonymous');
                  image.src = 'http://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png';
                  this.initialImage = image;
                  console.log(this.croppa);
                },
                uploadCroppedImage: function () {
                  var _this = this;
                  this.croppa.generateBlob(function (blob) {
                    var form = new FormData();
                    form.append('file', blob);
                    Vue.http.post('/api/photos', form, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }).then(function (response) {
                      _this.result = response.body;
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
