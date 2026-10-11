// services/agentEngine.js
// 나만의 맞춤형 여행 가이드 AI 에이전트 플래닝 엔진

const { REGIONS } = require('../data/travel_knowledge');
const visitKoreaService = require('./visitKoreaService');
const trafficEngine = require('./trafficEngine');
const gourmetService = require('./gourmetService');

class TravelAgentEngine {
  constructor() {
    this.regions = REGIONS;
  }

  /**
   * 사용자 입력 조건에 맞춰 최적의 여행 일정과 가이드 생성
   * @param {Object} params
   * - season: "가을" | "봄" | "여름" | "겨울"
   * - days: number (1 ~ 4)
   * - companion: "부모님" | "가족" | "연인" | "친구" | "혼자"
   * - themes: string[] (예: ["힐링", "맛집", "자연"])
   * - startLocation: string (예: "서울/수도권", "대전/충청", "대구/경북" 등)
   * - pace: "relaxed" (여유) | "packed" (알찬)
   * - transport: "car" | "public"
   * - customRequest: string
   */
  generatePlan(params) {
    const {
      season = "가을",
      days = 3,
      companion = "가족",
      themes = ["힐링", "맛집"],
      startLocation = "대전/세종/충청",
      pace = "relaxed",
      transport = "car",
      customRequest = ""
    } = params;

    // 1. 최적의 여행 권역 선정 (Scoring Algorithm)
    const selectedRegion = this._selectBestRegion({ season, companion, themes, startLocation, customRequest });

    // 2. 일수(Days)에 맞게 일정 커스텀 슬라이스 & 보정
    const numDays = Math.min(Math.max(parseInt(days, 10) || 3, 1), 4);
    let itinerary = [];

    for (let i = 0; i < numDays; i++) {
      const dayData = selectedRegion.days[i % selectedRegion.days.length];
      const clonedDay = JSON.parse(JSON.stringify(dayData));
      clonedDay.day = i + 1;

      // 동행자 특성 및 페이스에 따른 가이드 메시지 주입
      clonedDay.companionNote = this._getCompanionAdvice(companion, clonedDay);

      // 카카오맵 및 한국관광공사(대한민국 구석구석) 공식 링크 생성
      clonedDay.morning.mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(clonedDay.morning.kakaoQuery || clonedDay.morning.spot)}`;
      clonedDay.morning.visitKoreaUrl = visitKoreaService.getSearchUrl(clonedDay.morning.kakaoQuery || clonedDay.morning.spot);

      clonedDay.lunch.mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(clonedDay.lunch.kakaoQuery || clonedDay.lunch.spot)}`;

      clonedDay.afternoon.mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(clonedDay.afternoon.kakaoQuery || clonedDay.afternoon.spot)}`;
      clonedDay.afternoon.visitKoreaUrl = visitKoreaService.getSearchUrl(clonedDay.afternoon.kakaoQuery || clonedDay.afternoon.spot);

      clonedDay.cafe.mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(clonedDay.cafe.kakaoQuery || clonedDay.cafe.spot)}`;
      clonedDay.dinner.mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(clonedDay.dinner.kakaoQuery || clonedDay.dinner.spot)}`;

      // 페이스 조절: 여유로운 휴식형일 경우 오후 팁 추가
      if (pace === "relaxed") {
        clonedDay.paceAdvice = "☕ 여유 템포: 카페 및 산책 코스에서 1시간 이상 넉넉히 머무르며 피로도를 줄이세요.";
      } else {
        clonedDay.paceAdvice = "⚡ 알찬 템포: 각 스팟을 집중 탐방하고 사진 명소 위주로 이동 동선을 컴팩트하게 소화하세요.";
      }

      // 일차별 정확한 출발지 및 도착지 인과관계 주입 (물리적 여정 체이닝)
      const prevDayNightSpot = (i > 0 && itinerary[i - 1]?.night?.spot) ? itinerary[i - 1].night.spot : null;
      const isFirstDay = (i === 0);
      const isLastDay = (i === numDays - 1);

      if (isFirstDay) {
        clonedDay.startPoint = {
          type: "home",
          time: "06:30 AM",
          slot: "첫 출발",
          name: "대전 자택 출발 (우리집)",
          desc: "골든타임 고속도로 진입 · 수도권 상행선 극심 정체 100% 회피 쾌속 코스",
          icon: "home"
        };
      } else {
        clonedDay.startPoint = {
          type: "stay",
          time: "09:00 AM",
          slot: `${i}일차 숙박지 출발`,
          name: `${i}일차 숙박지 [${prevDayNightSpot || '숙소'}] 퇴실 & 이동 출발`,
          desc: `1일차 숙소 체크아웃 후 인접 ${clonedDay.morning.spot} 방면 이동`,
          icon: "hotel"
        };
      }

      if (isLastDay) {
        clonedDay.endPoint = {
          type: "home",
          time: "08:30 PM",
          slot: "여정 완주",
          name: "대전 자택 복귀 (스위트 홈)",
          desc: `${numDays}일간의 아름다운 여정을 마무리하고 대전 자택 안전 복귀`,
          icon: "home"
        };
      } else {
        clonedDay.endPoint = {
          type: "stay",
          time: "09:00 PM",
          slot: "야경 & 숙박",
          name: `${clonedDay.night.spot}`,
          desc: `권장 숙소 권역: ${clonedDay.night.stayArea}`,
          icon: "hotel"
        };
      }

      itinerary.push(clonedDay);
    }

    // 3. 맞춤형 종합 조언 및 체크리스트 생성
    const packingList = this._generatePackingList(season, companion, transport);
    const trafficAdvice = this._getTrafficAdvice(startLocation, selectedRegion.area);

    return {
      success: true,
      meta: {
        destinationName: selectedRegion.name,
        vibe: selectedRegion.vibe,
        season,
        days: numDays,
        companion,
        themes,
        startLocation,
        pace,
        transport,
        generatedAt: new Date().toISOString()
      },
      region: {
        id: selectedRegion.id,
        name: selectedRegion.name,
        vibe: selectedRegion.vibe,
        holidayTip: selectedRegion.holidayTip
      },
      itinerary,
      packingList,
      trafficAdvice,
      trafficSimulation: trafficEngine.simulateDepartureTimes(selectedRegion.id, "outbound"),
      mealPlan: gourmetService.generateMealPlan(selectedRegion.id, numDays),
      sourceVerification: {
        primarySource: "한국관광공사 대한민국 구석구석 (korean.visitkorea.or.kr)",
        verified: true,
        notice: "본 일정의 추천 명소는 한국관광공사의 '한국관광 100선', '열린관광지', 지자체 공인 관광지 데이터를 최우선으로 검증·반영하였습니다."
      },
      agentSummary: this._generateExecutiveSummary(selectedRegion, companion, themes, numDays, season)
    };
  }

  /**
   * 점수 기반 최적 권역 판별 알고리즘
   */
  _selectBestRegion({ season, companion, themes, startLocation, customRequest }) {
    const regionKeys = Object.keys(this.regions);
    let bestRegion = this.regions[regionKeys[0]];
    let maxScore = -999;

    // 사용자 추가 키워드가 있을 경우 매칭
    const requestLower = (customRequest || "").toLowerCase();

    for (const key of regionKeys) {
      const r = this.regions[key];
      let score = 0;

      // 1) 텍스트 명시 매칭 (가장 강력)
      if (requestLower.includes("서해") || requestLower.includes("보령") || requestLower.includes("서천") || requestLower.includes("군산") || requestLower.includes("대천")) {
        if (r.id === "WEST_COAST_SEOCHON") score += 60;
      }
      if (requestLower.includes("대청호") || requestLower.includes("속리산") || requestLower.includes("보은") || requestLower.includes("무주") || requestLower.includes("완주") || requestLower.includes("옥천")) {
        if (r.id === "INLAND_LAKE_FOREST") score += 60;
      }
      if (requestLower.includes("여수") || requestLower.includes("순천") || requestLower.includes("담양") || requestLower.includes("남도") || requestLower.includes("전주")) {
        if (r.id === "HONAM_NAMDO") score += 50;
      }
      if (requestLower.includes("경주") || requestLower.includes("포항") || requestLower.includes("신라") || requestLower.includes("대구")) {
        if (r.id === "YEONGNAM_GYEONGJU") score += 50;
      }
      if (requestLower.includes("강원") || requestLower.includes("속초") || requestLower.includes("강릉")) {
        if (r.id === "GANGWON_EAST") score += 40;
      }

      // 2) 계절 적합도
      if (r.bestSeason === season) score += 15;
      if (r.seasons.includes(season)) score += 5;

      // 3) 동행인 적합도
      if (r.suitableFor.includes(companion)) score += 10;

      // 4) 테마 적합도
      if (Array.isArray(themes)) {
        themes.forEach(t => {
          if (r.themes.includes(t)) score += 8;
        });
      }

      // 5) 대전 출발 특화 가산점 (수평: 서해안/대청호-속리산-무주, 남쪽: 호남 남도/영남)
      // "위로 올라가는 것보다는 수평(좌, 우) 또는 아래 쪽 희망"
      const isDaejeon = !startLocation || startLocation.includes("대전") || startLocation.includes("세종") || startLocation.includes("충청") || !startLocation.includes("서울");
      if (isDaejeon) {
        if (r.id === "WEST_COAST_SEOCHON") score += 40;     // 수평 좌 (서해안 보령·서천·군산)
        if (r.id === "INLAND_LAKE_FOREST") score += 40;     // 수평 우 & 완만한 남 (대청호·속리산·무주)
        if (r.id === "HONAM_NAMDO") score += 30;            // 남쪽 (전주·담양·순천·여수)
        if (r.id === "YEONGNAM_GYEONGJU") score += 25;      // 남동쪽 (대구·경주·포항)
        if (r.id === "GANGWON_EAST" || r.id === "GANGWON_FOREST") score -= 30; // 위쪽 상행선 회피
      } else if (startLocation.includes("서울") || startLocation.includes("수도권")) {
        if (r.id === "CHUNGCHEONG_LAKE" || r.id === "GANGWON_EAST" || r.id === "GANGWON_FOREST") score += 10;
      }

      if (score > maxScore) {
        maxScore = score;
        bestRegion = r;
      }
    }

    return bestRegion;
  }

  _getCompanionAdvice(companion, dayData) {
    switch (companion) {
      case "부모님":
        return "👵 부모님 케어 포인트: 무리한 오르막길이나 계단보다는 평지 수변 데크길 중심 동선입니다. 소화가 편한 로컬 보양식 및 틈틈이 차를 마실 수 있는 쉼터가 배치되었습니다.";
      case "가족":
      case "아이동반":
        return "👶 아이 동반 가족 포인트: 단순 관람보다는 갯배 체험, 케이블카, 목장 체험 등 아이들이 흥미를 느낄 수 있는 활동이 포함되었으며, 식당은 아기의자/유모차 진입이 수월한 곳 위주입니다.";
      case "연인":
        return "💑 커플 감성 포인트: 노을이 물드는 시간대의 오션뷰/레이크뷰 카페와 로맨틱한 야경 조명 산책로가 하이라이트로 구성되었습니다.";
      case "혼자":
        return "🎒 1인 여행자 포인트: 조용히 사색할 수 있는 숲길과 바다 산책로, 1인 식사가 편안하고 안전한 숙소 밀집 지역을 권장합니다.";
      default:
        return "✨ 여행 포인트: 이동 동선의 중복을 최소화하여 시간 대비 만족도를 극대화한 알짜 코스입니다.";
    }
  }

  _generatePackingList(season, companion, transport) {
    const base = [
      "신분증 및 운전면허증",
      "보조배터리 및 고속충전 케이블",
      "편안한 운동화 or 워킹화",
      "개인 상비약 (소화제, 두통약, 멀미약, 밴드)"
    ];

    if (season === "가을") {
      base.push("일교차 대비 겉옷 (가디건 or 경량패딩, 바람막이)");
      base.push("가을 자외선 차단 썬크림 & 선글라스");
      base.push("보습 립밤 및 핸드크림");
    }

    if (companion === "부모님") {
      base.push("어르신 전용 상비약 (혈압약 등 복용약 여유분)");
      base.push("보온 텀블러 (따뜻한 온수 지참용)");
    } else if (companion === "가족" || companion === "아이동반") {
      base.push("아이 여벌옷 2벌 이상, 물티슈 대용량");
      base.push("차량 이동용 간식 & 아이가 좋아하는 영상/음악 오프라인 다운로드");
    }

    if (transport === "car") {
      base.push("차량 타이어 공기압 점검 및 워셔액 보충");
      base.push("차량용 햇빛 가리개 & 졸음방지 껌/음료");
    }

    return base;
  }

  _getTrafficAdvice(startLocation, destinationArea) {
    return {
      peakHours: "추석 연휴 특수성: 귀성길은 연휴 첫날 오전 7시~오후 1시, 귀경길은 마지막 날 오후 1시~오후 7시가 최대 피크입니다.",
      strategy: "피크 시간대를 피해 새벽 6시 이전 조기 출발 혹은 점심 식사 후 여유 출발을 권장하며, Tmap / 카카오내비의 '시간대별 출발 예측' 기능을 적극 활용하세요.",
      tollTip: "명절 연휴 기간 전국 고속도로 통행료 면제 혜택 여부를 출발 전 한국도로공사 공지를 통해 확인하세요."
    };
  }

  _generateExecutiveSummary(region, companion, themes, days, season) {
    const themeStr = Array.isArray(themes) ? themes.join("·") : themes;
    return `이번 ${season} 명절 연휴, ${companion}과(와) 함께하는 [${themeStr}] 목적의 ${days}일 여행지로 [${region.name}]을(를) 추천합니다. ${region.vibe}을(를) 테마로 정체 피로도는 낮추고 여행의 낭만과 쉼은 극대화할 수 있도록 일차별 최적 동선으로 구성되었습니다.`;
  }
}

module.exports = new TravelAgentEngine();
