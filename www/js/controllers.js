/**
 * 무인 스마트 편의점 AI 플랫폼 - 컨트롤러 모듈
 * 고객 앱과 점주 대시보드의 모든 컨트롤러를 포함합니다.
 */
angular.module('starter.controllers', [])

/**
 * 앱 메인 컨트롤러 - 사이드바 메뉴 및 공통 기능 관리
 */
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $translate) {
  // Form data for the login modal
  $scope.loginData = {};

  // 현재 선택된 언어 (기본값: 한국어)
  $scope.currentLanguage = 'ko';

  // 다국어 번역 데이터
  $scope.translations = {
    'ko': {
      title: '무인 스마트 편의점',
      menu: '메뉴',
      login: '로그인',
      logout: '로그아웃',
      settings: '설정'
    },
    'en': {
      title: 'Smart Convenience Store',
      menu: 'Menu',
      login: 'Login',
      logout: 'Logout',
      settings: 'Settings'
    },
    'zh': {
      title: '智能便利店',
      menu: '菜单',
      login: '登录',
      logout: '登出',
      settings: '设置'
    },
    'ja': {
      title: 'スマートコンビニ',
      menu: 'メニュー',
      login: 'ログイン',
      logout: 'ログアウト',
      settings: '設定'
    }
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  // 언어 변경 함수
  $scope.changeLanguage = function(lang) {
    $scope.currentLanguage = lang;
    // 필요시 $translate.use(lang) 호출
  };

  // 현재 언어에 따른 타이틀 가져오기
  $scope.getTitle = function() {
    return $scope.translations[$scope.currentLanguage].title;
  };
})

/**
 * QR 입장 컨트롤러 - 고객入场 QR 생성 및 생체인증
 */
.controller('QREntryCtrl', function($scope, $timeout) {
  // QR 코드 데이터
  $scope.qrCode = null;
  $scope.sessionId = null;
  $scope.entryStatus = 'ready'; // ready, scanning, entered, denied

  // 사용자 정보 (익명化处理)
  $scope.anonymousUser = {
    id: null,
    entryTime: null,
    biometricVerified: false
  };

  /**
   *入场 QR 코드 생성
   * burn.dev API 연동하여 고유 세션 ID 생성
   */
  $scope.generateEntryQR = function() {
    $scope.entryStatus = 'scanning';
    
    // 실제 구현시에는 백엔드 API 호출
    // POST /api/session/create
    $timeout(function() {
      $scope.sessionId = 'SESSION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      $scope.qrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      $scope.anonymousUser.id = generateSessionScopedId($scope.sessionId);
      $scope.anonymousUser.entryTime = new Date();
      $scope.entryStatus = 'entered';
      
      console.log('입장 QR 생성됨:', $scope.sessionId);
      console.log('익명 사용자 ID:', $scope.anonymousUser.id);
    }, 1500);
  };

  /**
   * 세션 범위 익명 ID 생성 (프라이버시 보호)
   * 재방문 시 연결 불가능한 일회성 ID
   */
  function generateSessionScopedId(sessionId) {
    // 얼굴 인식 없는 골격 추적용 익명 ID
    // pose_keypoints 에서 얼굴 키포인트 (0 번) 제외
    return 'ANON_' + sessionId + '_' + Math.random().toString(36).substr(2, 12);
  }

  /**
   * 생체인증 (선택사항)
   * 안면인식 대신 제스처 인증 등 대체 수단 사용
   */
  $scope.verifyBiometric = function() {
    // 실제 구현시에는 디바이스 생체인증 API 사용
    $timeout(function() {
      $scope.anonymousUser.biometricVerified = true;
      console.log('생체인증 완료');
    }, 1000);
  };

  // 초기화: QR 코드 자동 생성
  $scope.generateEntryQR();
})

/**
 * 장바구니 컨트롤러 - 실시간 장바구니 현황 확인
 */
.controller('CartCtrl', function($scope, $interval) {
  // 현재 장바구니 항목들
  $scope.cartItems = [];
  $scope.totalAmount = 0;
  $scope.lastUpdated = null;

  // 실시간 업데이트 (2 초마다)
  var updateInterval = null;

  /**
   * 장바구니 데이터 갱신
   * burn.dev 객체 감지 모델과 연동하여 실시간 반영
   */
  $scope.refreshCart = function() {
    // 실제 구현시에는 WebSocket 또는 SSE 로 실시간 데이터 수신
    // GET /api/cart/current
    
    // 샘플 데이터
    $scope.cartItems = [
      { id: 1, name: '삼각김밥 (참치마요)', price: 1200, quantity: 2, category: 'triangular_rice_ball' },
      { id: 2, name: '도시락 (불고기)', price: 4500, quantity: 1, category: 'lunch_box' },
      { id: 3, name: '콜라 500ml', price: 1500, quantity: 1, category: 'beverage' }
    ];
    
    calculateTotal();
    $scope.lastUpdated = new Date();
  };

  /**
   * 총 금액 계산
   */
  function calculateTotal() {
    $scope.totalAmount = $scope.cartItems.reduce(function(sum, item) {
      return sum + (item.price * item.quantity);
    }, 0);
  }

  /**
   * 항목 제거 (실시간 감지에서 제외)
   */
  $scope.removeItem = function(itemId) {
    $scope.cartItems = $scope.cartItems.filter(function(item) {
      return item.id !== itemId;
    });
    calculateTotal();
    
    // 백엔드에 반납 이벤트 전송
    // POST /api/shelf-event { event_type: 'return', product_id: itemId }
  };

  // 자동 refresh 시작
  updateInterval = $interval(function() {
    $scope.refreshCart();
  }, 2000);

  // 페이지 떠날 때 interval 정리
  $scope.$on('$destroy', function() {
    if (updateInterval) {
      $interval.cancel(updateInterval);
    }
  });

  // 초기 로드
  $scope.refreshCart();
})

/**
 * 영수증 컨트롤러 - 거래 완료 후 영수증 확인 및 포인트 적립
 */
.controller('ReceiptCtrl', function($scope) {
  $scope.receipt = null;
  $scope.points = {
    earned: 0,
    total: 0,
    tier: 'Bronze' // Bronze, Silver, Gold, Platinum
  };

  /**
   * 최근 거래 내역 조회
   */
  $scope.loadReceipt = function(transactionId) {
    // 실제 구현시: GET /api/transactions/:id
    
    // 샘플 데이터
    $scope.receipt = {
      id: transactionId || 'TXN_' + Date.now(),
      storeName: '무인편의점 강남점',
      storeCode: 'GN-001',
      date: new Date(),
      items: [
        { name: '삼각김밥 (참치마요)', quantity: 2, price: 1200, subtotal: 2400 },
        { name: '도시락 (불고기)', quantity: 1, price: 4500, subtotal: 4500 },
        { name: '콜라 500ml', quantity: 1, price: 1500, subtotal: 1500 }
      ],
      subtotal: 8400,
      tax: 840, // 10% 부가세
      total: 9240,
      paymentMethod: 'auto_payment', // auto_payment, credit_card, mobile_pay
      status: 'completed'
    };

    // 포인트 계산 (총액의 1%)
    $scope.points.earned = Math.floor($scope.receipt.total * 0.01);
    $scope.points.total += $scope.points.earned;
    
    // 티어 결정
    if ($scope.points.total >= 10000) {
      $scope.points.tier = 'Platinum';
    } else if ($scope.points.total >= 5000) {
      $scope.points.tier = 'Gold';
    } else if ($scope.points.total >= 1000) {
      $scope.points.tier = 'Silver';
    }
  };

  /**
   * 영수증 공유 (이메일/SMS)
   */
  $scope.shareReceipt = function(method) {
    console.log('영수증 공유:', method);
    // 실제 구현시: POST /api/receipt/share
  };

  // 초기 로드
  $scope.loadReceipt();
})

/**
 * 재고 조회 컨트롤러 - 매장별 상품 재고 현황 확인
 */
.controller('InventoryCtrl', function($scope) {
  $scope.stores = [];
  $scope.selectedStore = null;
  $scope.products = [];
  $scope.searchQuery = '';

  // RGB 재고 상태 색상
  $scope.stockColors = {
    sufficient: 'rgb(0,220,100)',      // 충분
    needsRestock: 'rgb(255,200,50)',   // 보충 필요
    outOfStock: 'rgb(255,60,60)',      // 품절
    nearExpiry: 'rgb(160,80,255)'      // 유통기한 임박
  };

  /**
   * 매장 목록 조회
   */
  $scope.loadStores = function() {
    // 실제 구현시: GET /api/stores
    
    $scope.stores = [
      { id: 1, name: '무인편의점 강남점', address: '서울시 강남구 테헤란로 123', openedAt: '2024-01-15' },
      { id: 2, name: '무인편의점 홍대점', address: '서울시 마포구 양화로 45', openedAt: '2024-02-20' },
      { id: 3, name: '무인편의점 부산점', address: '부산시 해운대구 해운대로 78', openedAt: '2024-03-10' }
    ];
    
    if (!$scope.selectedStore && $scope.stores.length > 0) {
      $scope.selectedStore = $scope.stores[0];
      $scope.loadProducts();
    }
  };

  /**
   * 선택된 매장의 상품 재고 조회
   */
  $scope.loadProducts = function() {
    if (!$scope.selectedStore) return;
    
    // 실제 구현시: GET /api/inventory?store_id=:storeId
    
    // 샘플 데이터
    $scope.products = [
      { 
        id: 1, 
        barcode: '8801234567890', 
        name: '삼각김밥 (참치마요)', 
        category: 'triangular_rice_ball',
        price: 1200,
        quantity: 45,
        shelfPosition: 'A-1-1',
        lastRestocked: '2024-12-10T08:00:00Z',
        shelfLifeDays: 3,
        status: 'sufficient'
      },
      { 
        id: 2, 
        barcode: '8801234567891', 
        name: '도시락 (불고기)', 
        category: 'lunch_box',
        price: 4500,
        quantity: 8,
        shelfPosition: 'B-2-3',
        lastRestocked: '2024-12-09T08:00:00Z',
        shelfLifeDays: 2,
        status: 'needs_restock'
      },
      { 
        id: 3, 
        barcode: '8801234567892', 
        name: '콜라 500ml', 
        category: 'beverage',
        price: 1500,
        quantity: 0,
        shelfPosition: 'C-3-1',
        lastRestocked: '2024-12-08T08:00:00Z',
        shelfLifeDays: 365,
        status: 'out_of_stock'
      },
      { 
        id: 4, 
        barcode: '8801234567893', 
        name: '우유 900ml', 
        category: 'dairy',
        price: 2500,
        quantity: 12,
        shelfPosition: 'D-1-2',
        lastRestocked: '2024-12-05T08:00:00Z',
        shelfLifeDays: 7,
        expiryDate: '2024-12-12T23:59:59Z',
        status: 'near_expiry'
      }
    ];
  };

  /**
   * 재고 상태에 따른 RGB 색상 반환
   */
  $scope.getStockColor = function(status) {
    switch(status) {
      case 'sufficient': return $scope.stockColors.sufficient;
      case 'needs_restock': return $scope.stockColors.needsRestock;
      case 'out_of_stock': return $scope.stockColors.outOfStock;
      case 'near_expiry': return $scope.stockColors.nearExpiry;
      default: return '#cccccc';
    }
  };

  /**
   * 검색 필터링
   */
  $scope.filteredProducts = function() {
    if (!$scope.searchQuery) return $scope.products;
    
    var query = $scope.searchQuery.toLowerCase();
    return $scope.products.filter(function(product) {
      return product.name.toLowerCase().includes(query) ||
             product.category.toLowerCase().includes(query) ||
             product.barcode.includes(query);
    });
  };

  // 초기 로드
  $scope.loadStores();
})

/**
 * 점주 대시보드 - 실시간 현황 컨트롤러
 * 매장 평면도 실시간 + 인원 현황 표시
 */
.controller('DashboardRealtimeCtrl', function($scope, $interval) {
  $scope.storeInfo = {
    name: '무인편의점 강남점',
    code: 'GN-001',
    openHours: '24/7'
  };

  $scope.realtimeStats = {
    currentCustomers: 0,
    totalVisitorsToday: 0,
    activeSessions: [],
    floorPlan: []
  };

  /**
   * 실시간 고객 현황 업데이트
   * burn.dev 3D 포즈 추정 + 객체 감지 모델 연동
   */
  $scope.updateRealtimeStats = function() {
    // 실제 구현시: WebSocket 으로 실시간 데이터 수신
    
    // 샘플 데이터
    $scope.realtimeStats.currentCustomers = 3;
    $scope.realtimeStats.totalVisitorsToday = 127;
    $scope.realtimeStats.activeSessions = [
      { sessionId: 'SES-001', entryTime: '10:23', zone: 'A' },
      { sessionId: 'SES-002', entryTime: '10:45', zone: 'B' },
      { sessionId: 'SES-003', entryTime: '11:02', zone: 'C' }
    ];

    // 매장 평면도 그리드 (5x5)
    $scope.realtimeStats.floorPlan = [
      ['entrance', 'A1', 'A2', 'A3', 'checkout'],
      ['B1', 'B2', 'B3', 'B4', 'B5'],
      ['C1', 'C2', 'C3', 'C4', 'C5'],
      ['D1', 'D2', 'D3', 'D4', 'D5'],
      ['storage', 'E1', 'E2', 'E3', 'exit']
    ];
  };

  /**
   * 고객 위치 추적 (얼굴 인식 없는 골격 추적)
   * 프라이버시 보호를 위해 얼굴 영역 자동 제외
   */
  $scope.trackCustomerPose = function(sessionId) {
    // Rust 코드 연동 예시:
    // track_customer_without_face(pose_keypoints, session_id)
    // - pose_keypoints 의 0 번 (얼굴) 키포인트 제외
    // - session_scoped_id 로 익명화
    
    console.log('고객 추적 (익명):', sessionId);
  };

  // 5 초마다 실시간 업데이트
  var updateInterval = $interval(function() {
    $scope.updateRealtimeStats();
  }, 5000);

  $scope.$on('$destroy', function() {
    if (updateInterval) {
      $interval.cancel(updateInterval);
    }
  });

  // 초기 로드
  $scope.updateRealtimeStats();
})

/**
 * 점주 대시보드 - 재고 관리 컨트롤러
 * RGB 재고 상태 표시 및 알림
 */
.controller('DashboardInventoryCtrl', function($scope) {
  $scope.inventory = [];
  $scope.alerts = [];
  
  // 재고 상태 필터
  $scope.statusFilter = 'all'; // all, sufficient, needs_restock, out_of_stock, near_expiry

  /**
   * 전체 재고 조회
   */
  $scope.loadInventory = function() {
    // 실제 구현시: GET /api/inventory
    
    $scope.inventory = [
      { 
        productId: 1, 
        productName: '삼각김밥 (참치마요)', 
        quantity: 45, 
        status: 'sufficient',
        lastRestocked: '2024-12-10',
        shelfPosition: 'A-1-1'
      },
      { 
        productId: 2, 
        productName: '도시락 (불고기)', 
        quantity: 8, 
        status: 'needs_restock',
        lastRestocked: '2024-12-09',
        shelfPosition: 'B-2-3'
      },
      { 
        productId: 3, 
        productName: '콜라 500ml', 
        quantity: 0, 
        status: 'out_of_stock',
        lastRestocked: '2024-12-08',
        shelfPosition: 'C-3-1'
      },
      { 
        productId: 4, 
        productName: '우유 900ml', 
        quantity: 12, 
        status: 'near_expiry',
        expiryDate: '2024-12-12',
        shelfPosition: 'D-1-2'
      }
    ];

    // 재고 알림 생성
    $scope.generateAlerts();
  };

  /**
   * 재고 상태에 따른 알림 생성
   */
  $scope.generateAlerts = function() {
    $scope.alerts = [];
    
    $scope.inventory.forEach(function(item) {
      if (item.status === 'out_of_stock') {
        $scope.alerts.push({
          type: 'critical',
          message: '[' + item.productName + '] 품절되었습니다. 즉시 보충이 필요합니다.',
          readAt: null
        });
      } else if (item.status === 'needs_restock') {
        $scope.alerts.push({
          type: 'warning',
          message: '[' + item.productName + '] 재고가 부족합니다. (현재: ' + item.quantity + '개)',
          readAt: null
        });
      } else if (item.status === 'near_expiry') {
        $scope.alerts.push({
          type: 'info',
          message: '[' + item.productName + '] 유통기한이 임박했습니다. (' + item.expiryDate + ')',
          readAt: null
        });
      }
    });
  };

  /**
   * 재고 보충 처리
   */
  $scope.restockProduct = function(productId) {
    // 실제 구현시: POST /api/inventory/restock
    
    console.log('재고 보충:', productId);
    alert('재고 보충이 완료되었습니다.');
    
    // 재조회
    $scope.loadInventory();
  };

  /**
   * 알림 읽음 처리
   */
  $scope.markAlertRead = function(index) {
    $scope.alerts[index].readAt = new Date();
  };

  /**
   * 재고 상태 필터링
   */
  $scope.filteredInventory = function() {
    if ($scope.statusFilter === 'all') return $scope.inventory;
    
    return $scope.inventory.filter(function(item) {
      return item.status === $scope.statusFilter;
    });
  };

  // 초기 로드
  $scope.loadInventory();
})

/**
 * 점주 대시보드 - 거래 내역 컨트롤러
 */
.controller('DashboardTransactionsCtrl', function($scope) {
  $scope.transactions = [];
  $scope.dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 일 전
    end: new Date()
  };

  /**
   * 거래 내역 조회
   */
  $scope.loadTransactions = function() {
    // 실제 구현시: GET /api/transactions?start=:start&end=:end
    
    $scope.transactions = [
      {
        id: 'TXN-20241210-001',
        sessionId: 'SES-20241210-001',
        timestamp: '2024-12-10T10:23:45Z',
        items: [
          { name: '삼각김밥 (참치마요)', quantity: 2, price: 1200 },
          { name: '콜라 500ml', quantity: 1, price: 1500 }
        ],
        totalAmount: 3900,
        paymentMethod: 'auto_payment',
        status: 'completed'
      },
      {
        id: 'TXN-20241210-002',
        sessionId: 'SES-20241210-002',
        timestamp: '2024-12-10T11:45:12Z',
        items: [
          { name: '도시락 (불고기)', quantity: 1, price: 4500 },
          { name: '우유 900ml', quantity: 1, price: 2500 }
        ],
        totalAmount: 7700,
        paymentMethod: 'credit_card',
        status: 'completed'
      },
      {
        id: 'TXN-20241210-003',
        sessionId: 'SES-20241210-003',
        timestamp: '2024-12-10T12:05:33Z',
        items: [
          { name: '아이스크림', quantity: 2, price: 2000 }
        ],
        totalAmount: 4400,
        paymentMethod: 'mobile_pay',
        status: 'refunded'
      }
    ];
  };

  /**
   * 거래 상세 보기
   */
  $scope.viewTransactionDetail = function(transactionId) {
    console.log('거래 상세:', transactionId);
    // 모달 또는 새 페이지로 상세 정보 표시
  };

  /**
   * 환불 처리
   */
  $scope.processRefund = function(transactionId) {
    // 실제 구현시: POST /api/transactions/:id/refund
    
    if (confirm('정말로 환불을 처리하시겠습니까?')) {
      console.log('환불 처리:', transactionId);
      alert('환불이 완료되었습니다.');
      $scope.loadTransactions();
    }
  };

  // 초기 로드
  $scope.loadTransactions();
})

/**
 * 점주 대시보드 - 통계 분석 컨트롤러
 * 매출 트렌드 / 인기 상품 분석
 */
.controller('DashboardStatsCtrl', function($scope) {
  $scope.stats = {
    dailyRevenue: [],
    topProducts: [],
    hourlyTraffic: [],
    customerRetention: 0
  };

  /**
   * 통계 데이터 조회
   */
  $scope.loadStats = function() {
    // 실제 구현시: GET /api/stats
    
    // 일별 매출 트렌드 (지난 7 일)
    $scope.stats.dailyRevenue = [
      { date: '2024-12-04', amount: 1250000 },
      { date: '2024-12-05', amount: 1380000 },
      { date: '2024-12-06', amount: 1520000 },
      { date: '2024-12-07', amount: 1890000 }, // 주말
      { date: '2024-12-08', amount: 1750000 }, // 주말
      { date: '2024-12-09', amount: 1420000 },
      { date: '2024-12-10', amount: 980000 }   // 오늘 (진행중)
    ];

    // 인기 상품 TOP 5
    $scope.stats.topProducts = [
      { rank: 1, name: '삼각김밥 (참치마요)', salesCount: 342, revenue: 410400 },
      { rank: 2, name: '도시락 (불고기)', salesCount: 189, revenue: 850500 },
      { rank: 3, name: '콜라 500ml', salesCount: 276, revenue: 414000 },
      { rank: 4, name: '우유 900ml', salesCount: 154, revenue: 385000 },
      { rank: 5, name: '아이스크림', salesCount: 198, revenue: 396000 }
    ];

    // 시간대별 방문객 수
    $scope.stats.hourlyTraffic = [
      { hour: '08:00', count: 23 },
      { hour: '09:00', count: 45 },
      { hour: '10:00', count: 32 },
      { hour: '11:00', count: 28 },
      { hour: '12:00', count: 67 }, // 점심 피크
      { hour: '13:00', count: 41 },
      { hour: '14:00', count: 25 },
      { hour: '15:00', count: 19 },
      { hour: '16:00', count: 22 },
      { hour: '17:00', count: 38 },
      { hour: '18:00', count: 52 }, // 저녁 피크
      { hour: '19:00', count: 48 }
    ];

    // 고객 재방문율
    $scope.stats.customerRetention = 34.5; // 34.5%
  };

  /**
   * 매출 합계 계산
   */
  $scope.getTotalRevenue = function() {
    return $scope.stats.dailyRevenue.reduce(function(sum, day) {
      return sum + day.amount;
    }, 0);
  };

  // 초기 로드
  $scope.loadStats();
})

/**
 * 점주 대시보드 - 설비 관리 컨트롤러
 * 카메라, 센서, 결제기기 등 장비 상태 모니터링
 */
.controller('DashboardFacilitiesCtrl', function($scope, $interval) {
  $scope.facilities = [];

  /**
   * 설비 목록 및 상태 조회
   */
  $scope.loadFacilities = function() {
    // 실제 구현시: GET /api/facilities
    
    $scope.facilities = [
      {
        id: 'CAM-001',
        type: 'camera',
        name: '입구 카메라',
        location: 'Entrance',
        status: 'online',
        lastCheck: '2024-12-10T11:58:00Z',
        firmware: 'v2.3.1'
      },
      {
        id: 'CAM-002',
        type: 'camera',
        name: '선반 A 카메라',
        location: 'Shelf-A',
        status: 'online',
        lastCheck: '2024-12-10T11:58:00Z',
        firmware: 'v2.3.1'
      },
      {
        id: 'SENSOR-001',
        type: 'pressure_sensor',
        name: '선반 A 압력 센서',
        location: 'Shelf-A',
        status: 'online',
        lastCheck: '2024-12-10T11:57:30Z',
        batteryLevel: 87
      },
      {
        id: 'POS-001',
        type: 'payment_terminal',
        name: '자동 결제 단말기',
        location: 'Checkout',
        status: 'online',
        lastCheck: '2024-12-10T11:58:15Z',
        firmware: 'v4.1.0'
      },
      {
        id: 'CAM-003',
        type: 'camera',
        name: '냉장고 카메라',
        location: 'Refrigerator',
        status: 'offline',
        lastCheck: '2024-12-10T09:23:00Z',
        firmware: 'v2.3.0',
        error: '연결 끊김'
      }
    ];
  };

  /**
   * 설비 상태에 따른 색상 반환
   */
  $scope.getStatusColor = function(status) {
    switch(status) {
      case 'online': return '#00dc64'; // 녹색
      case 'offline': return '#ff3c3c'; // 적색
      case 'warning': return '#ffc832'; // 황색
      default: return '#cccccc';
    }
  };

  /**
   * 설비 재부팅
   */
  $scope.rebootFacility = function(facilityId) {
    // 실제 구현시: POST /api/facilities/:id/reboot
    
    if (confirm(facilityId + ' 장비를 재부팅하시겠습니까?')) {
      console.log('재부팅:', facilityId);
      alert('재부팅 명령이 전송되었습니다.');
    }
  };

  /**
   * 펌웨어 업데이트
   */
  $scope.updateFirmware = function(facilityId) {
    // 실제 구현시: POST /api/facilities/:id/update
    
    if (confirm(facilityId + ' 장비의 펌웨어를 업데이트하시겠습니까?')) {
      console.log('펌웨어 업데이트:', facilityId);
      alert('펌웨어 업데이트가 시작되었습니다.');
    }
  };

  // 30 초마다 상태 업데이트
  var updateInterval = $interval(function() {
    $scope.loadFacilities();
  }, 30000);

  $scope.$on('$destroy', function() {
    if (updateInterval) {
      $interval.cancel(updateInterval);
    }
  });

  // 초기 로드
  $scope.loadFacilities();
})

/**
 * 점주 대시보드 - 고객 관리 컨트롤러
 */
.controller('DashboardCustomersCtrl', function($scope) {
  $scope.customers = [];
  $scope.searchQuery = '';

  /**
   * 고객 목록 조회 (익명화된 데이터만)
   * 프라이버시 보호: 얼굴 정보 저장 안함
   */
  $scope.loadCustomers = function() {
    // 실제 구현시: GET /api/customers/anonymized
    
    $scope.customers = [
      {
        anonymousId: 'ANON-20241210-001',
        visitCount: 15,
        firstVisit: '2024-11-01',
        lastVisit: '2024-12-10',
        totalSpent: 125000,
        favoriteCategory: 'triangular_rice_ball',
        tier: 'Gold'
      },
      {
        anonymousId: 'ANON-20241210-002',
        visitCount: 3,
        firstVisit: '2024-12-05',
        lastVisit: '2024-12-09',
        totalSpent: 28000,
        favoriteCategory: 'beverage',
        tier: 'Bronze'
      },
      {
        anonymousId: 'ANON-20241210-003',
        visitCount: 42,
        firstVisit: '2024-06-15',
        lastVisit: '2024-12-10',
        totalSpent: 580000,
        favoriteCategory: 'lunch_box',
        tier: 'Platinum'
      }
    ];
  };

  /**
   * 고객 티어 색상 반환
   */
  $scope.getTierColor = function(tier) {
    switch(tier) {
      case 'Platinum': return '#e5e4e2'; // 플래티넘
      case 'Gold': return '#ffd700';     // 골드
      case 'Silver': return '#c0c0c0';   // 실버
      case 'Bronze': return '#cd7f32';   // 브론즈
      default: return '#cccccc';
    }
  };

  /**
   * 검색 필터링
   */
  $scope.filteredCustomers = function() {
    if (!$scope.searchQuery) return $scope.customers;
    
    var query = $scope.searchQuery.toLowerCase();
    return $scope.customers.filter(function(customer) {
      return customer.anonymousId.toLowerCase().includes(query) ||
             customer.favoriteCategory.toLowerCase().includes(query);
    });
  };

  // 초기 로드
  $scope.loadCustomers();
})

/**
 * 점주 대시보드 - 설정 컨트롤러
 * 매장명, 점주 연락처 등 설정 관리
 */
.controller('DashboardSettingsCtrl', function($scope) {
  $scope.settings = {
    storeName: '',
    storeCode: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    notificationEnabled: true,
    autoPaymentEnabled: true
  };

  /**
   * 설정 불러오기
   */
  $scope.loadSettings = function() {
    // 실제 구현시: GET /api/settings
    
    $scope.settings = {
      storeName: '무인편의점 강남점',
      storeCode: 'GN-001',
      managerName: '홍길동',
      managerPhone: '010-1234-5678',
      managerEmail: 'manager@example.com',
      notificationEnabled: true,
      autoPaymentEnabled: true
    };
  };

  /**
   * 설정 저장
   * 저장 후 영수증/알림에 즉시 반영
   */
  $scope.saveSettings = function() {
    // 실제 구현시: PUT /api/settings
    
    console.log('설정 저장:', $scope.settings);
    alert('설정이 저장되었습니다.\n영수증과 알림에 즉시 반영됩니다.');
  };

  /**
   * 알림 테스트 발송
   */
  $scope.sendTestNotification = function() {
    // 실제 구현시: POST /api/notifications/test
    
    console.log('테스트 알림 발송');
    alert('테스트 알림이 발송되었습니다.');
  };

  // 초기 로드
  $scope.loadSettings();
})

/**
 * 다국어 컨트롤러 - 언어 설정 관리
 * 한국어/영어/중국어/일본어 지원
 */
.controller('LanguageCtrl', function($scope) {
  $scope.languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  $scope.currentLanguage = 'ko';

  /**
   * 언어 변경
   */
  $scope.changeLanguage = function(langCode) {
    $scope.currentLanguage = langCode;
    
    // localStorage 에 저장
    localStorage.setItem('preferred_language', langCode);
    
    // 실제 구현시: $translate.use(langCode)
    console.log('언어 변경:', langCode);
    
    // 앱 전체에 언어 변경 알림
    $scope.$broadcast('languageChanged', langCode);
  };

  /**
   * 저장된 언어 설정 불러오기
   */
  $scope.loadSavedLanguage = function() {
    var saved = localStorage.getItem('preferred_language');
    if (saved) {
      $scope.currentLanguage = saved;
    }
  };

  // 초기 로드
  $scope.loadSavedLanguage();
});
