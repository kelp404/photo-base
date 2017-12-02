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
                  url: '',
                  croppa: {},
                  initialImage: null,
                  result: null
                };
              },
              methods: {
                fetchRemotePhoto: function () {
                  var data = {
                    url: this.url
                  };
                  this.$http.post('/api/_fetch', data).then(function (response) {
                    var image = new Image();
                    image.setAttribute('crossorigin', 'anonymous');
                    image.src = response.body.url;
                    this.initialImage = image;
                    this.croppa.refresh();
                  });
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
