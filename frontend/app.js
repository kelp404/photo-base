(function () {
  var router = new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: {
          template: '<div>foo</div>'
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
