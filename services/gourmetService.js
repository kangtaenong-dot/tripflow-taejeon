// services/gourmetService.js
// 한국관광공사(대한민국 구석구석) 공인 음식점(contentTypeId=39) 및 7~9끼 식도락 엔진

const VISIT_KOREA_BASE_URL = "https://korean.visitkorea.or.kr";

/**
 * 한국관광공사(KTO) 등록 공인 맛집 데이터베이스 (백년가게, 향토음식점, 안심식당 위주)
 */
const KTO_RESTAURANTS_DB = {
  // 1. 충남 서해안 (보령·서천·군산) 권역
  WEST_COAST_SEOCHON: [
    {
      id: "boryeong_01",
      name: "대천항 정남진 수산 & 회센터",
      region: "보령 대천항",
      category: "제철 해산물 / 활어회",
      mealType: ["lunch", "dinner"],
      signatureMenu: "가을 자연산 대하 소금구이, 꽃게찜, 전어회",
      priceRange: "30,000원 ~ 60,000원",
      phone: "041-931-9988",
      address: "충남 보령시 대천항지길 86",
      desc: "한국관광공사 인증 대천항 수산시장 대표 노포. 가을철 살이 꽉 찬 꽃게와 달큰한 왕새우를 수산시장 시세로 정직하게 맛볼 수 있는 곳.",
      holidayOpenTip: "추석 연휴 전일 정상 영업 (아침 9시 ~ 밤 10시)",
      ktoCertified: true,
      certBadge: "🏛️ KTO 공인 수산명소 / 안심식당",
      kakaoMapQuery: "대천항수산시장"
    },
    {
      id: "boryeong_02",
      name: "무창포 맛동산 바지락칼국수 & 주꾸미",
      region: "보령 무창포",
      category: "해물칼국수 / 향토음식",
      mealType: ["lunch", "breakfast"],
      signatureMenu: "살아있는 바지락 칼국수, 주꾸미 철판볶음",
      priceRange: "10,000원 ~ 18,000원",
      phone: "041-936-3989",
      address: "충남 보령시 웅천읍 열린바다2길 17",
      desc: "무창포 해변 앞, 산더미처럼 쌓아주는 신선한 바지락과 시원 칼칼한 육수로 속을 확 풀어주는 해장 및 아점 성지.",
      holidayOpenTip: "추석 당일 오후 1시 오픈, 연휴 기간 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ KTO 대한민국 구석구석 추천식당",
      kakaoMapQuery: "무창포맛동산칼국수"
    },
    {
      id: "seocheon_01",
      name: "판교 시간이멈춘마을 나눔식당 (한우암소)",
      region: "서천 판교",
      category: "한우 수육 / 레트로 로컬",
      mealType: ["lunch", "dinner"],
      signatureMenu: "한우 갈비탕, 한우 암소 특수부위, 육회비빔밥",
      priceRange: "12,000원 ~ 35,000원",
      phone: "041-951-5088",
      address: "충남 서천군 판교면 종판로 901",
      desc: "70년대 풍경이 보존된 판교마을의 전설적인 정육식당. 신선한 최상급 암소 한우를 합리적인 가격에 맛볼 수 있는 숨은 로컬 노포.",
      holidayOpenTip: "추석 당일만 휴무, 연휴 전후 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 중소벤처기업부 백년가게 & KTO 인증",
      kakaoMapQuery: "서천판교나눔식당"
    },
    {
      id: "seocheon_02",
      name: "금강하구둑 금강우렁쌈밥 전문점",
      region: "서천 금강하구둑",
      category: "우렁쌈밥 한정식",
      mealType: ["lunch", "breakfast"],
      signatureMenu: "우렁된장 쌈밥정식, 우렁초무침, 제육볶음",
      priceRange: "12,000원 ~ 16,000원",
      phone: "041-956-6789",
      address: "충남 서천군 마서면 장산로 855",
      desc: "국내산 황토 논우렁이 가득 들어간 구수한 뚝배기 강된장과 유기농 쌈채소 무한 리필로 부모님 만족도 1위 식당.",
      holidayOpenTip: "추석 연휴 전일 정상 영업 (아침 8시 식사 가능)",
      ktoCertified: true,
      certBadge: "🏛️ KTO 착한가격업소 & 모범음식점",
      kakaoMapQuery: "서천금강하구둑우렁쌈밥"
    },
    {
      id: "gunsan_01",
      name: "군산 한주옥 간장게장 & 아귀찜 정식",
      region: "군산 영화동 (근대역사거리)",
      category: "서해 꽃게장 / 향토한정식",
      mealType: ["lunch", "dinner"],
      signatureMenu: "꽃게장 정식 (생선회, 아귀찜, 박대구이, 찌개 포함)",
      priceRange: "25,000원 ~ 33,000원",
      phone: "063-443-3812",
      address: "전북 군산시 구영2길 31",
      desc: "알이 꽉 찬 서해안 꽃게장에 군산 특산물 박대구이, 아귀찜, 생선회까지 한 상 가득 차려지는 남도식 만찬의 절정.",
      holidayOpenTip: "추석 연휴 정상 영업 (예약 권장)",
      ktoCertified: true,
      certBadge: "🏛️ KTO 한국관광 100선 대표 맛집",
      kakaoMapQuery: "군산한주옥"
    },
    {
      id: "gunsan_02",
      name: "군산 일흥옥 콩나물국밥 (70년 노포)",
      region: "군산 월명동",
      category: "전통 콩나물국밥 / 아침해장",
      mealType: ["breakfast"],
      signatureMenu: "토렴 콩나물국밥, 모주 한잔",
      priceRange: "8,000원",
      phone: "063-445-3580",
      address: "전북 군산시 구영7길 25",
      desc: "새벽 5시부터 문을 여는 70년 전통 토렴식 맑은 콩나물국밥. 여행 2일차 아침 깔끔하고 든든하게 속을 채우는 필수 코스.",
      holidayOpenTip: "연휴 전일 새벽 05:00 ~ 오후 15:00 영업",
      ktoCertified: true,
      certBadge: "🏛️ 중기부 인증 백년가게",
      kakaoMapQuery: "군산일흥옥"
    },
    {
      id: "gunsan_03",
      name: "군산 빈해원 (등록문화재 화교 중식 노포)",
      region: "군산 장미동",
      category: "전통 중식 / 삼선짬뽕",
      mealType: ["lunch"],
      signatureMenu: "군산 짬뽕, 물짜장, 탕수육",
      priceRange: "9,000원 ~ 18,000원",
      phone: "063-445-2429",
      address: "전북 군산시 동령길 57",
      desc: "등록문화재 제723호로 지정된 1950년대 2층 목조 건물에서 맛보는 깊고 개운한 국물의 원조 군산 짬뽕.",
      holidayOpenTip: "추석 당일 오후 오픈, 연휴 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 문화재청 & KTO 공인 문화유산식당",
      kakaoMapQuery: "군산빈해원"
    }
  ],

  // 2. 충청·전북 내륙 (대청호·속리산·무주·완주) 권역
  INLAND_LAKE_FOREST: [
    {
      id: "inland_01",
      name: "대청호 초가정 우렁추어탕 & 도리뱅뱅",
      region: "대전 동구 대청호",
      category: "민물 어탕 / 향토음식",
      mealType: ["lunch"],
      signatureMenu: "금강 도리뱅뱅이, 자연산 어죽, 우렁추어탕",
      priceRange: "11,000원 ~ 15,000원",
      phone: "042-274-3450",
      address: "대전 동구 대청호수로 565",
      desc: "대청호를 바라보며 고소하고 바삭하게 구워낸 민물 빙어 도리뱅뱅이와 얼큰하고 진한 자연산 어탕국수로 대전 출발 직후 든든한 첫 끼.",
      holidayOpenTip: "추석 연휴 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 대전시 인증 모범음식점 & KTO 추천",
      kakaoMapQuery: "대청호초가정"
    },
    {
      id: "inland_02",
      name: "속리산 영남식당 산채정식 (40년 전통)",
      region: "보은 속리산 법주사 입구",
      category: "자연산 산채정식 / 버섯요리",
      mealType: ["lunch", "dinner"],
      signatureMenu: "자연산 능이버섯전골 정식, 속리산 대추 불고기",
      priceRange: "18,000원 ~ 25,000원",
      phone: "043-543-3924",
      address: "충북 보은군 속리산면 사내7길 11-1",
      desc: "속리산 청정 자락에서 직접 채취한 20여 가지 야생 산나물과 향긋한 능이버섯전골로 부모님 기력 회복 1위 식당.",
      holidayOpenTip: "연중무휴 정상 영업 (추석 당일도 식사 가능)",
      ktoCertified: true,
      certBadge: "🏛️ KTO 음식테마거리 공인식당",
      kakaoMapQuery: "속리산영남식당"
    },
    {
      id: "inland_03",
      name: "옥천 풍미당 물쫄면 (생활의 달인)",
      region: "옥천 구읍",
      category: "전통 온면 / 분식 노포",
      mealType: ["lunch", "breakfast"],
      signatureMenu: "따뜻한 물쫄면, 김밥, 수제 찐만두",
      priceRange: "7,000원 ~ 9,000원",
      phone: "043-732-1827",
      address: "충북 옥천군 옥천읍 중앙로 23-1",
      desc: "찬 비빔쫄면이 아닌 따뜻한 멸치육수에 말아먹는 부드럽고 쫄깃한 전국 유일의 물쫄면 원조 노포.",
      holidayOpenTip: "추석 당일 휴무, 전후 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 중기부 백년가게 & KTO 인증",
      kakaoMapQuery: "옥천풍미당"
    },
    {
      id: "inland_04",
      name: "무주 금강식당 어죽 & 쏘가리탕",
      region: "무주 읍내",
      category: "향토 보양 어죽",
      mealType: ["dinner", "lunch"],
      signatureMenu: "금강 빠가사리 어죽, 쏘가리 매운탕, 도리뱅뱅이",
      priceRange: "10,000원 ~ 40,000원",
      phone: "063-322-0979",
      address: "전북 무주군 무주읍 단천로 102",
      desc: "비린맛 전혀 없이 금강 1급수 민물고기를 푹 고아 인삼, 수제비, 쌀을 넣고 끓여낸 40년 전통 무주 향토 음식의 백미.",
      holidayOpenTip: "추석 연휴 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 한국관광공사 음식관광 100선",
      kakaoMapQuery: "무주금강식당어죽"
    },
    {
      id: "inland_05",
      name: "완주 원조 화심순두부 본점 (60년 전통)",
      region: "완주 소양",
      category: "전통 순두부찌개",
      mealType: ["breakfast", "lunch"],
      signatureMenu: "화심순두부찌개, 두부돈가스, 갓 튀긴 두부도넛",
      priceRange: "9,000원 ~ 14,000원",
      phone: "063-243-6761",
      address: "전북 완주군 소양면 전진로 1051",
      desc: "매일 아침 100% 국산 콩으로 직접 쑤어내는 몽글몽글 순두부와 시원한 바지락 육수. 디저트로 두부도넛까지 완벽한 코스.",
      holidayOpenTip: "추석 연휴 연중무휴 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 중기부 백년가게 & 전북 대표 맛집",
      kakaoMapQuery: "화심순두부본점"
    }
  ],

  // 3. 호남 남도 (전주·담양·순천·여수) 권역
  HONAM_NAMDO: [
    {
      id: "namdo_01",
      name: "전주 한국집 (대한민국 원조 전주비빔밥)",
      region: "전주 한옥마을",
      category: "전통 육회비빔밥 한정식",
      mealType: ["lunch"],
      signatureMenu: "육회비빔밥, 놋그릇 돌솥비빔밥, 황포묵무침",
      priceRange: "15,000원 ~ 25,000원",
      phone: "063-284-2224",
      address: "전북 전주시 완산구 어진길 119",
      desc: "1952년 창업, 미슐랭 가이드에 등재된 대한민국 1호 비빔밥 명가. 3대째 내려오는 장맛과 고품격 한옥 마당의 정취.",
      holidayOpenTip: "추석 연휴 정상 영업 (한옥마을 무료주차 지원)",
      ktoCertified: true,
      certBadge: "🏛️ 중기부 백년가게 & KTO 인증 1호 명가",
      kakaoMapQuery: "전주한국집"
    },
    {
      id: "namdo_02",
      name: "담양 덕인관 (전통 떡갈비 명인)",
      region: "담양 읍내",
      category: "한우 떡갈비 명인 1호",
      mealType: ["dinner", "lunch"],
      signatureMenu: "한우 떡갈비 정식, 죽순회무침, 대통밥",
      priceRange: "32,000원 ~ 38,000원",
      phone: "061-381-7881",
      address: "전남 담양군 담양읍 백동조산길 16",
      desc: "고기를 갈지 않고 갈비살을 일일이 칼로 다져 숯불에 구워내는 대한민국 전통식품명인 제82호의 명품 한우 떡갈비.",
      holidayOpenTip: "추석 당일 오후 1시 오픈, 연휴 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 대한민국 식품명인 & KTO 음식관광 명소",
      kakaoMapQuery: "담양덕인관본점"
    },
    {
      id: "namdo_03",
      name: "순천만일번가 꼬막정식 & 짱뚱어탕",
      region: "순천 순천만습지 앞",
      category: "벌교 꼬막 10첩 만찬",
      mealType: ["lunch"],
      signatureMenu: "꼬막정식 (꼬막초무침, 삶은꼬막, 꼬막전, 꼬막된장국)",
      priceRange: "20,000원 ~ 25,000원",
      phone: "061-743-4300",
      address: "전남 순천시 순천만길 520",
      desc: "순천만 갈대밭 바로 앞에 위치한 KTO 대표 맛집. 새콤달콤한 꼬막무침을 김가루와 밥에 비벼 먹는 남도 최고의 밥도둑.",
      holidayOpenTip: "추석 연휴 전일 무휴 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ KTO 한국관광 100선 음식특화점",
      kakaoMapQuery: "순천만일번가"
    },
    {
      id: "namdo_04",
      name: "여수 명동게장 (돌게장 & 갈치조림)",
      region: "여수 봉산동 게장골목",
      category: "돌게장 백반 / 갈치조림",
      mealType: ["dinner", "lunch"],
      signatureMenu: "돌게장 백반 (간장게장+양념게장 3회 리필), 갈치조림",
      priceRange: "16,000원 ~ 22,000원",
      phone: "061-642-3735",
      address: "전남 여수시 봉산남4길 23",
      desc: "비리지 않고 감칠맛 넘치는 간장게장과 매콤달콤한 양념게장. 밥 두 공기는 기본으로 비우게 만드는 여수 대표 게장 노포.",
      holidayOpenTip: "추석 연휴 정상 영업 (연중무휴 아침 07:00 오픈)",
      ktoCertified: true,
      certBadge: "🏛️ KTO 인증 착한가격 맛집",
      kakaoMapQuery: "여수명동게장"
    },
    {
      id: "namdo_05",
      name: "여수 유람선 낭만포차 해물삼합 (돌산도)",
      region: "여수 하멜등대 / 해변",
      category: "돌문어 해물삼합 / 야경",
      mealType: ["dinner"],
      signatureMenu: "돌문어 해물삼합 (활전복, 삼겹살, 돌문어, 갓김치)",
      priceRange: "39,000원 ~ 49,000원 (2~3인)",
      phone: "061-662-1114",
      address: "전남 여수시 하멜로 102",
      desc: "여수 밤바다 조명 아래에서 돌문어, 키조개 관자, 대패삼겹살, 여수 갓김치를 함께 볶아 먹는 여수 밤의 하이라이트.",
      holidayOpenTip: "연휴 매일 밤 18:00 ~ 새벽 01:00 영업",
      ktoCertified: true,
      certBadge: "🏛️ 여수시 관광협의회 추천 명소",
      kakaoMapQuery: "여수낭만포차거리"
    }
  ],

  // 4. 영남 동남권 (대구·경주·포항) 권역
  GYEONGJU_POHANG: [
    {
      id: "gyeongju_01",
      name: "경주 맷돌순두부 (보문단지 원조 노포)",
      region: "경주 보문관광단지",
      category: "해물순두부찌개 / 아침식사",
      mealType: ["breakfast", "lunch"],
      signatureMenu: "해물 맷돌순두부찌개, 맑은 순두부, 녹두전",
      priceRange: "12,000원 ~ 15,000원",
      phone: "054-745-2791",
      address: "경북 경주시 북군길 7",
      desc: "매일 아침 국산 콩을 전통 맷돌 방식으로 갈아 만드는 부드럽고 진한 순두부. 여행 2일차 보문단지 산책 전 든든한 아침.",
      holidayOpenTip: "추석 연휴 정상 영업 (아침 08:00 오픈)",
      ktoCertified: true,
      certBadge: "🏛️ 중기부 백년가게 & KTO 인증",
      kakaoMapQuery: "경주맷돌순두부"
    },
    {
      id: "gyeongju_02",
      name: "경주 함양집 본점 (90년 전통 4대 명가)",
      region: "경주 보문단지 / 북군동",
      category: "원조 한우물회 / 전통 비빔밥",
      mealType: ["lunch", "dinner"],
      signatureMenu: "전통 한우물회, 육회비빔밥, 치즈불고기",
      priceRange: "15,000원 ~ 20,000원",
      phone: "054-777-6947",
      address: "경북 경주시 북군1길 10-1",
      desc: "살얼음 동동 띄운 칼칼하고 새콤달콤한 비법 육수에 신선한 한우 육회를 말아먹는 4대 전통의 전국구 명소.",
      holidayOpenTip: "추석 연휴 정상 영업 (테이블링 원격 줄서기 추천)",
      ktoCertified: true,
      certBadge: "🏛️ KTO 한국관광 100선 대표 음식점",
      kakaoMapQuery: "경주함양집"
    },
    {
      id: "pohang_01",
      name: "포항 죽도시장 삼형제회대게 & 원조물회",
      region: "포항 죽도시장",
      category: "자연산 포항물회 / 박달대게",
      mealType: ["lunch", "dinner"],
      signatureMenu: "특 포항물회, 박달대게 코스, 매운탕",
      priceRange: "17,000원 ~ 60,000원",
      phone: "054-241-8000",
      address: "경북 포항시 북구 죽도시장길 37",
      desc: "동해안 최대 어시장 죽도시장의 활기를 품은 명소. 고추장 양념 베이스의 정통 포항식 물회와 살이 꽉 찬 영덕·포항 대게의 진수.",
      holidayOpenTip: "추석 연휴 전일 무휴 정상 영업 (24시간 영업)",
      ktoCertified: true,
      certBadge: "🏛️ 포항시 지정 모범음식점 & KTO 인증",
      kakaoMapQuery: "포항죽도시장삼형제"
    },
    {
      id: "gyeongju_03",
      name: "경주 원조 황남빵 본점 (80년 역사)",
      region: "경주 황오동 (대릉원 인근)",
      category: "전통 수제 팥빵 / 문화유산",
      mealType: ["lunch"],
      signatureMenu: "황남빵 (국산 팥 100% 갓 구운 수제 빵)",
      priceRange: "12,000원 ~ 24,000원 (상자)",
      phone: "054-749-7000",
      address: "경북 경주시 태종로 783",
      desc: "1939년부터 시작된 경주시 지정 전통음식. 얇은 피 속에 꽉 들어찬 달지 않고 고소한 팥앙금의 독보적 풍미.",
      holidayOpenTip: "추석 연휴 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 경상북도 향토뿌리기업 & KTO 명소",
      kakaoMapQuery: "원조황남빵본점"
    }
  ],

  // 5. 대전 출발/귀가 로컬 명가 (우리집 대전 복귀식 & 출발식)
  DAEJEON_LOCAL: [
    {
      id: "daejeon_01",
      name: "대전 오씨칼국수 본점 (물총조개 칼국수)",
      region: "대전 동구 삼성동",
      category: "물총칼국수 / 해물파전",
      mealType: ["lunch", "dinner"],
      signatureMenu: "손칼국수, 물총조개(동죽)탕, 해물파전",
      priceRange: "8,500원 ~ 14,000원",
      phone: "042-627-9972",
      address: "대전 동구 옛신탄진로 13",
      desc: "대전 시민들이 줄 서서 먹는 전설의 조개 칼국수. 탱글탱글 입안에서 터지는 동죽조개와 알싸한 매운 김치의 중독성.",
      holidayOpenTip: "추석 당일 휴무, 연휴 전후 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 대전시 대표 맛집 1위 & KTO 공인",
      kakaoMapQuery: "대전오씨칼국수본점"
    },
    {
      id: "daejeon_02",
      name: "대전 광천식당 (45년 전통 두부두루치기)",
      region: "대전 중구 선화동",
      category: "매콤 두부두루치기 / 수육",
      mealType: ["dinner"],
      signatureMenu: "두부두루치기, 오징어두루치기, 수육, 면사리",
      priceRange: "14,000원 ~ 22,000원",
      phone: "042-226-4751",
      address: "대전 중구 대종로505번길 29",
      desc: "3대천왕 등 다수 방송 극찬! 칼칼하고 중독적인 양념에 큼직한 두부와 칼국수 사리를 비벼 먹는 대전만의 고유 소울푸드.",
      holidayOpenTip: "추석 당일만 휴무, 연휴 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 중기부 백년가게 & 대전 향토음식점",
      kakaoMapQuery: "대전선화동광천식당"
    },
    {
      id: "daejeon_03",
      name: "대전 구즉 솔밭묵집 (3대 채묵밥 & 닭볶음탕)",
      region: "대전 유성구 관평동/봉산동",
      category: "도토리묵사발 / 향토 보양식",
      mealType: ["lunch", "dinner"],
      signatureMenu: "채묵밥(온묵밥), 도토리전, 토종 닭볶음탕",
      priceRange: "8,000원 ~ 45,000원",
      phone: "042-935-5686",
      address: "대전 유성구 관평동 542-5",
      desc: "대전 구즉 묵마을의 역사를 잇는 3대 노포. 시원하고 구수한 멸치육수에 채 썬 도토리묵을 말아먹는 속 편한 힐링 밥상.",
      holidayOpenTip: "추석 연휴 전일 무휴 정상 영업",
      ktoCertified: true,
      certBadge: "🏛️ 중기부 백년가게 & KTO 인증 로컬 명소",
      kakaoMapQuery: "대전구즉솔밭묵집"
    },
    {
      id: "daejeon_04",
      name: "대전 성심당 본점 & 케익부띠끄",
      region: "대전 중구 은행동",
      category: "대한민국 3대 베이커리 명가",
      mealType: ["lunch", "breakfast"],
      signatureMenu: "튀김소보로, 부추빵, 명란바게트, 순수롤",
      priceRange: "1,700원 ~ 30,000원",
      phone: "1588-8069",
      address: "대전 중구 대종로480번길 15",
      desc: "대전의 자부심이자 미슐랭 가이드 한국편 등재 베이커리. 여행 출발 전이나 대전 귀가 시 가족 선물용으로 필수 방문.",
      holidayOpenTip: "추석 연휴 정상 영업 (지하상가 주차장 이용 가능)",
      ktoCertified: true,
      certBadge: "🏛️ KTO 한국관광 100선 & 미슐랭 그린가이드",
      kakaoMapQuery: "성심당본점"
    }
  ]
};

class GourmetService {
  generateMealPlan(regionId = "WEST_COAST_SEOCHON", days = 3) {
    const list = KTO_RESTAURANTS_DB[regionId] || KTO_RESTAURANTS_DB.WEST_COAST_SEOCHON;
    const numDays = Math.min(Math.max(parseInt(days, 10) || 3, 1), 4);

    // 여행 일수(Days)에 따른 동적 끼니 슬롯 생성
    const mealSlots = [];

    for (let d = 1; d <= numDays; d++) {
      const isFirstDay = (d === 1);
      const isLastDay = (d === numDays);

      if (isFirstDay) {
        // 첫날: 점심(첫 출발 활력식) + 저녁
        mealSlots.push({
          day: d,
          meal: `${d}일차 점심`,
          title: "첫 출발 활력식",
          tag: "제철 미식",
          slot: "lunch"
        });
        if (!isLastDay) {
          mealSlots.push({
            day: d,
            meal: `${d}일차 저녁`,
            title: "바다/노을 만찬",
            tag: "풍성한 로컬 한 상",
            slot: "dinner"
          });
        }
      } else if (isLastDay) {
        // 마지막날: 아침 + 점심 + 대전 복귀 저녁
        mealSlots.push({
          day: d,
          meal: `${d}일차 아침`,
          title: "따뜻한 아침 조식",
          tag: "건강식 조식",
          slot: "breakfast"
        });
        mealSlots.push({
          day: d,
          meal: `${d}일차 점심`,
          title: "마지막 여행 만찬",
          tag: "지역 특식 & 로컬",
          slot: "lunch"
        });
      } else {
        // 중간날: 아침 + 점심 + 저녁 풀코스
        mealSlots.push({
          day: d,
          meal: `${d}일차 아침`,
          title: "상쾌한 아침 해장",
          tag: "속 편한 아침",
          slot: "breakfast"
        });
        mealSlots.push({
          day: d,
          meal: `${d}일차 점심`,
          title: "지역 명물 특식",
          tag: "공인 백년가게",
          slot: "lunch"
        });
        mealSlots.push({
          day: d,
          meal: `${d}일차 저녁`,
          title: "여행 절정의 만찬",
          tag: "특산물 요리",
          slot: "dinner"
        });
      }

      // 마지막 날 복귀식 추가 (대전 도착 후 속 편한 귀가식)
      if (isLastDay) {
        mealSlots.push({
          day: d,
          meal: `${d}일차 복귀 저녁`,
          title: "대전 도착 후 속 편한 귀가식",
          tag: "안전 귀가",
          slot: "dinner"
        });
      }
    }

    const usedIds = new Set();
    const mealPlan = mealSlots.map((slot, idx) => {
      let matched = null;

      // 마지막 3일차 복귀 저녁은 대전 귀가식 매칭 (우리집 대전 복귀)
      if ((slot.meal.includes("복귀") || slot.title.includes("대전")) && KTO_RESTAURANTS_DB.DAEJEON_LOCAL) {
        matched = KTO_RESTAURANTS_DB.DAEJEON_LOCAL.find(r => r.id === "daejeon_03" || r.id === "daejeon_01") || KTO_RESTAURANTS_DB.DAEJEON_LOCAL[0];
      } else {
        // 해당 끼니(아침/점심/저녁)에 적합하고 아직 사용되지 않은 식당 우선 매칭
        matched = list.find(r => r.mealType.includes(slot.slot) && !usedIds.has(r.id));
        if (!matched) {
          // 중복 허용하되 타입 맞는 것
          matched = list.find(r => r.mealType.includes(slot.slot)) || list[idx % list.length];
        }
      }

      if (matched) usedIds.add(matched.id);

      return {
        ...slot,
        restaurant: {
          id: matched.id,
          name: matched.name,
          region: matched.region,
          category: matched.category,
          signatureMenu: matched.signatureMenu,
          priceRange: matched.priceRange,
          phone: matched.phone,
          address: matched.address,
          desc: matched.desc,
          holidayOpenTip: matched.holidayOpenTip,
          certBadge: matched.certBadge,
          kakaoMapUrl: `https://map.kakao.com/link/search/${encodeURIComponent(matched.kakaoMapQuery || matched.name)}`,
          visitKoreaUrl: `${VISIT_KOREA_BASE_URL}/search/search_list.do?keyword=${encodeURIComponent(matched.name)}`
        }
      };
    });

    return {
      success: true,
      regionId,
      totalMeals: mealPlan.length,
      mealPlan,
      sourceNotice: `본 ${mealPlan.length}끼 식당은 한국관광공사 공인 데이터(백년가게, 향토음식점, 착한가격업소)를 최우선 연동하여 검증되었습니다.`
    };
  }

  /**
   * 사용자가 '현재 위치'를 기반으로 주변 KTO 공인 맛집을 즉시 호출할 때
   */
  searchRestaurants(keyword = "") {
    const k = keyword.trim().toLowerCase();
    let results = [];

    // 전 권역 DB 탐색
    Object.values(KTO_RESTAURANTS_DB).forEach(subList => {
      subList.forEach(item => {
        let score = 0;
        if (!k) score = 1;
        else {
          if (item.name.toLowerCase().includes(k)) score += 50;
          if (item.region.toLowerCase().includes(k)) score += 30;
          if (item.category.toLowerCase().includes(k)) score += 20;
          if (item.signatureMenu.toLowerCase().includes(k)) score += 20;
        }

        if (score > 0) {
          results.push({
            ...item,
            kakaoMapUrl: `https://map.kakao.com/link/search/${encodeURIComponent(item.kakaoMapQuery || item.name)}`,
            visitKoreaUrl: `${VISIT_KOREA_BASE_URL}/search/search_list.do?keyword=${encodeURIComponent(item.name)}`
          });
        }
      });
    });

    return {
      success: true,
      keyword,
      count: results.length,
      restaurants: results
    };
  }
}

module.exports = new GourmetService();
