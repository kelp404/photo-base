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
              components: {
                VueCoreImageUpload: Vue.component('VueCoreImageUpload', VueCoreImageUpload)
              },
              data: function () {
                return {
                  src: 'http://img1.vued.vanthink.cn/vued7553a09a5d5209ebd00a48264394b7f3.png',
                  cropSrc: 'http://img1.vued.vanthink.cn/vued7553a09a5d5209ebd00a48264394b7f3.png',
                  cropArgs: {
                    toCropImgH: '?',
                    toCropImgW: '?',
                    toCropImgX: '?',
                    toCropImgY: '?',
                    toCropDegrees: '?'
                  }
                };
              },
              template: response.body,
              methods: {
                cropLocalImageUploaded: function (response) {
                  console.log('jaifjie');
                  console.log(response);
                  this.src = response.data.src;
                },
                cropServerImageUploaded: function (response) {
                  console.log(response);
                  if (response.src) {
                    console.log(this);
                    this.src = response.src;
                  }
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
