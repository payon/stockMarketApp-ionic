// Ionic Starter App - 무인 스마트 편의점 AI 플랫폼

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  // 고객 앱: 입장 QR 생성 및 장바구니 확인
  .state('app.qr-entry', {
    url: '/qr-entry',
    views: {
      'menuContent': {
        templateUrl: 'templates/qr-entry.html',
        controller: 'QREntryCtrl'
      }
    }
  })

  // 고객 앱: 실시간 장바구니 확인
  .state('app.cart', {
    url: '/cart',
    views: {
      'menuContent': {
        templateUrl: 'templates/cart.html',
        controller: 'CartCtrl'
      }
    }
  })

  // 고객 앱: 영수증 및 포인트 확인
  .state('app.receipt', {
    url: '/receipt',
    views: {
      'menuContent': {
        templateUrl: 'templates/receipt.html',
        controller: 'ReceiptCtrl'
      }
    }
  })

  // 고객 앱: 매장 재고 조회
  .state('app.inventory', {
    url: '/inventory',
    views: {
      'menuContent': {
        templateUrl: 'templates/inventory.html',
        controller: 'InventoryCtrl'
      }
    }
  })

  // 점주 대시보드: 실시간 현황
  .state('app.dashboard-realtime', {
    url: '/dashboard/realtime',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard-realtime.html',
        controller: 'DashboardRealtimeCtrl'
      }
    }
  })

  // 점주 대시보드: 재고 관리
  .state('app.dashboard-inventory', {
    url: '/dashboard/inventory',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard-inventory.html',
        controller: 'DashboardInventoryCtrl'
      }
    }
  })

  // 점주 대시보드: 거래 내역
  .state('app.dashboard-transactions', {
    url: '/dashboard/transactions',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard-transactions.html',
        controller: 'DashboardTransactionsCtrl'
      }
    }
  })

  // 점주 대시보드: 통계 분석
  .state('app.dashboard-stats', {
    url: '/dashboard/stats',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard-stats.html',
        controller: 'DashboardStatsCtrl'
      }
    }
  })

  // 점주 대시보드: 설비 관리
  .state('app.dashboard-facilities', {
    url: '/dashboard/facilities',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard-facilities.html',
        controller: 'DashboardFacilitiesCtrl'
      }
    }
  })

  // 점주 대시보드: 고객 관리
  .state('app.dashboard-customers', {
    url: '/dashboard/customers',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard-customers.html',
        controller: 'DashboardCustomersCtrl'
      }
    }
  })

  // 점주 대시보드: 설정
  .state('app.dashboard-settings', {
    url: '/dashboard/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard-settings.html',
        controller: 'DashboardSettingsCtrl'
      }
    }
  })

  // 다국어 지원 페이지
  .state('app.language', {
    url: '/language',
    views: {
      'menuContent': {
        templateUrl: 'templates/language.html',
        controller: 'LanguageCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/qr-entry');
});
