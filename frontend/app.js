(function () {
  Vue.use(Croppa);
  var router = new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        redirect: '/uploader'
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
                  result: null
                };
              },
              methods: {
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
