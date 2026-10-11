// services/stayService.js
// 한국관광공사(KTO) 한국관광 품질인증(KQ) 및 한옥스테이, 안심숙소 공인 데이터베이스

const KTO_STAYS_DB = {
  // 1. 충남 서해안 (보령·서천·군산) 권역
  WEST_COAST_SEOCHON: [
    {
      id: "stay_boryeong_01",
      name: "보령 한화리조트 대천 파로스",
      region: "충남 보령 대천해수욕장 앞",
      category: "오션뷰 리조트 / 가족형",
      certBadge: "🏛️ KTO 한국관광 품질인증(KQ) & 안심숙소",
      priceRange: "150,000원 ~ 280,000원",
      phone: "041-931-5500",
      address: "충남 보령시 해수욕장3길 11-10",
      desc: "대천해수욕장 도보 2분 거리. 지중해 그리스 산토리니 풍의 밝고 쾌적한 객실. 부모님, 아이와 함께하는 추석 가족 여행 최적 숙소.",
      checkIn: "15:00",
      checkOut: "11:00",
      holidayTip: "추석 연휴 사우나 및 조식 뷔페 정상 운영",
      kakaoMapUrl: "https://map.kakao.com/link/search/한화리조트대천파로스",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=한화리조트대천"
    },
    {
      id: "stay_seocheon_01",
      name: "서천 이하복 고택 한옥스테이 (중요민속문화재)",
      region: "충남 서천 기산면",
      category: "전통 한옥스테이 / 문화재",
      certBadge: "🏛️ 문화재청 & KTO 공인 전통 한옥체험",
      priceRange: "120,000원 ~ 180,000원",
      phone: "041-951-4110",
      address: "충남 서천군 기산면 신산리 113",
      desc: "조선 후기 중부지방 전통 양반가 가옥의 원형을 보존한 고즈넉한 명품 한옥. 마당 가득 귀뚜라미 소리와 별빛 힐링.",
      checkIn: "15:00",
      checkOut: "11:00",
      holidayTip: "전통 다도 체험 및 고택 해설 무료 제공",
      kakaoMapUrl: "https://map.kakao.com/link/search/서천이하복고택",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=이하복고택"
    },
    {
      id: "stay_gunsan_01",
      name: "군산 여미랑 (등록문화재 일본식 가옥 게스트하우스)",
      region: "충남·전북 군산 월명동",
      category: "근대건축 감성 숙소 / 정원 뷰",
      certBadge: "🏛️ KTO 공인 이색 테마 숙소",
      priceRange: "60,000원 ~ 140,000원",
      phone: "063-446-2703",
      address: "전북 군산시 구영6길 13",
      desc: "군산 근대역사거리 중심에 위치한 전통 다다미방과 정원이 어우러진 등록문화재 숙소. 도보로 이성당, 초원사진관 탐방 가능.",
      checkIn: "16:00",
      checkOut: "10:30",
      holidayTip: "연휴 기간 마당 연못 조명 야간 개장",
      kakaoMapUrl: "https://map.kakao.com/link/search/군산여미랑",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=군산여미랑"
    }
  ],

  // 2. 충청·전북 내륙 (대청호·속리산·무주·완주) 권역
  INLAND_LAKE_FOREST: [
    {
      id: "stay_inland_01",
      name: "보은 속리산 숲체험휴양마을",
      region: "충북 보은 속리산면",
      category: "국립공원 숲속 통나무집",
      certBadge: "🏛️ 산림청 & KTO 공인 웰니스 숙소",
      priceRange: "100,000원 ~ 220,000원",
      phone: "043-540-3220",
      address: "충북 보은군 속리산면 속리산로 596",
      desc: "속리산 말티재 자락 피톤치드 편백나무 통나무집. 모노레일과 숲속 산책로가 연결되어 부모님 힐링 코스로 최고.",
      checkIn: "15:00",
      checkOut: "11:00",
      holidayTip: "추석 연휴 산책로 및 모노레일 정상 운행",
      kakaoMapUrl: "https://map.kakao.com/link/search/속리산숲체험휴양마을",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=속리산숲체험휴양마을"
    },
    {
      id: "stay_inland_02",
      name: "완주 소양 아원고택 & 아원스테이",
      region: "전북 완주 소양면",
      category: "감성 한옥 미술관 스테이",
      certBadge: "🏛️ KTO 한국관광 100선 & 고품격 한옥",
      priceRange: "270,000원 ~ 450,000원",
      phone: "063-241-8195",
      address: "전북 완주군 소양면 송광수만로 516-7",
      desc: "250년 된 진주 고택을 이축한 종남산 뷰의 걸작. 갤러리와 현대적 건축, 조용한 산사 같은 정취가 공존하는 전국 1위 감성 한옥.",
      checkIn: "16:00",
      checkOut: "10:30",
      holidayTip: "투숙객 전용 미술관 야간 프라이빗 관람 포함",
      kakaoMapUrl: "https://map.kakao.com/link/search/완주아원고택",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=아원고택"
    },
    {
      id: "stay_inland_03",
      name: "무주 구천동 덕유산 리조트 가족호텔",
      region: "전북 무주 구천동 자락",
      category: "마운틴 리조트 / 계곡 산책",
      certBadge: "🏛️ KTO 품질인증 대규모 복합 숙소",
      priceRange: "130,000원 ~ 250,000원",
      phone: "063-322-9000",
      address: "전북 무주군 설천면 만선로 185",
      desc: "덕유산 국립공원 천혜의 계곡을 품은 알프스풍 호텔. 곤돌라를 타고 덕유산 설천봉·향적봉에 올라 파노라마 조망 가능.",
      checkIn: "15:00",
      checkOut: "11:00",
      holidayTip: "덕유산 관광 곤돌라 추석 연휴 무휴 운행",
      kakaoMapUrl: "https://map.kakao.com/link/search/무주덕유산리조트",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=무주덕유산리조트"
    }
  ],

  // 3. 호남 남도 (전주·담양·순천·여수) 권역
  HONAM_NAMDO: [
    {
      id: "stay_namdo_01",
      name: "전주 한옥마을 학인당 (전북민속문화재 제8호)",
      region: "전북 전주 한옥마을",
      category: "궁궐형 전통 고택 스테이",
      certBadge: "🏛️ KTO 명품 한옥스테이 1호 & 문화재",
      priceRange: "180,000원 ~ 350,000원",
      phone: "063-284-9929",
      address: "전북 전주시 완산구 향교길 45",
      desc: "1908년 궁중 목수가 건축한 100여 년 역사의 대저택. 한옥마을 가장 깊은 울림을 전해주는 최고 권위의 전통 숙소.",
      checkIn: "15:00",
      checkOut: "11:00",
      holidayTip: "고택 종손의 아침 차담 및 다과 무료 서비스",
      kakaoMapUrl: "https://map.kakao.com/link/search/전주학인당",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=학인당"
    },
    {
      id: "stay_namdo_02",
      name: "여수 소노캄 여수 (구 엠블호텔)",
      region: "전남 여수 오동도 입구",
      category: "5성급 럭셔리 오션뷰 호텔",
      certBadge: "🏛️ KTO 품질인증 5성급 최상급 숙소",
      priceRange: "220,000원 ~ 420,000원",
      phone: "1588-4888",
      address: "전남 여수시 오동도로 111",
      desc: "오동도와 여수 엑스포 바다가 한눈에 내려다보이는 특급 호텔. 해상 케이블카와 낭만포차거리 도보 이동 가능.",
      checkIn: "15:00",
      checkOut: "11:00",
      holidayTip: "추석 연휴 전 객실 여수 밤바다 전망 완비",
      kakaoMapUrl: "https://map.kakao.com/link/search/소노캄여수",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=소노캄여수"
    },
    {
      id: "stay_namdo_03",
      name: "순천만 에코촌 유스호스텔 (순천시 공영 한옥)",
      region: "전남 순천 순천만습지 인근",
      category: "친환경 공영 한옥스테이",
      certBadge: "🏛️ 순천시 공영 & KTO 안심숙소",
      priceRange: "70,000원 ~ 130,000원",
      phone: "061-749-4816",
      address: "전남 순천시 해룡면 에코촌길 70",
      desc: "전통 구들장 온돌과 황토, 편백나무로만 지은 순천시 직영 한옥. 순천만 갈대밭 산책 전후 피로 회복에 최적.",
      checkIn: "15:00",
      checkOut: "11:00",
      holidayTip: "추석 연휴 정상 운영 (순천만국가정원 5분 거리)",
      kakaoMapUrl: "https://map.kakao.com/link/search/순천만에코촌유스호스텔",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=순천만에코촌"
    }
  ],

  // 4. 영남 동남권 (경주·포항) 권역
  GYEONGJU_POHANG: [
    {
      id: "stay_gyeongju_01",
      name: "경주 황남관 한옥호텔",
      region: "경북 경주 황리단길 입구",
      category: "전통 한옥 부티크 호텔",
      certBadge: "🏛️ KTO 한국관광 품질인증(KQ) 우수숙소",
      priceRange: "160,000원 ~ 280,000원",
      phone: "054-620-5000",
      address: "경북 경주시 포석로 1038",
      desc: "대릉원과 황리단길 바로 앞. 웅장한 2층 한옥 루프탑에서 즐기는 전통 정원과 야경. 한복 체험 서비스 제공.",
      checkIn: "15:00",
      checkOut: "11:00",
      holidayTip: "황리단길 야간 산책 및 대릉원 천마총 도보 3분",
      kakaoMapUrl: "https://map.kakao.com/link/search/황남관한옥호텔",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=황남관"
    },
    {
      id: "stay_gyeongju_02",
      name: "경주 라한셀렉트 경주 (보문호수 오션뷰)",
      region: "경북 경주 보문관광단지",
      category: "5성급 호수 전망 럭셔리 호텔",
      certBadge: "🏛️ KTO 품질인증 5성 호텔 & 안심숙박",
      priceRange: "210,000원 ~ 390,000원",
      phone: "054-748-2233",
      address: "경북 경주시 보문로 338",
      desc: "보문호수 산책로와 바로 연결되는 경주 대표 특급호텔. 북스토어 '경주산책'과 실내 수영장 완비.",
      checkIn: "15:00",
      checkOut: "11:00",
      holidayTip: "보문호수 둘레길 가을 아침 조깅 코스 직결",
      kakaoMapUrl: "https://map.kakao.com/link/search/라한셀렉트경주",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=라한셀렉트경주"
    }
  ],

  // 5. 대전 자택 인근 힐링 스테이 (출발/복귀 전후)
  DAEJEON_LOCAL: [
    {
      id: "stay_daejeon_01",
      name: "호텔 오노마 대전 오토그래프 컬렉션",
      region: "대전 유성구 도룡동 (엑스포공원)",
      category: "5성급 메리어트 럭셔리 호텔",
      certBadge: "🏛️ 대전 대표 5성급 랜드마크 & KTO 인증",
      priceRange: "240,000원 ~ 380,000원",
      phone: "042-259-8000",
      address: "대전 유성구 엑스포로 1",
      desc: "신세계 엑스포 타워에 위치한 갑천 파노라마 뷰 호텔. 대전 출발 전이나 여행 후 가족 호캉스로 최고.",
      checkIn: "15:00",
      checkOut: "11:00",
      holidayTip: "한빛탑 음악분수 및 갑천 억새밭 야경 감상",
      kakaoMapUrl: "https://map.kakao.com/link/search/호텔오노마대전",
      visitKoreaUrl: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=호텔오노마"
    }
  ]
};

class StayService {
  /**
   * 권역별 추천 품질인증 숙소 목록 반환
   */
  getStaysForRegion(regionId = "WEST_COAST_SEOCHON") {
    const list = KTO_STAYS_DB[regionId] || KTO_STAYS_DB.WEST_COAST_SEOCHON;
    return {
      success: true,
      regionId,
      count: list.length,
      stays: list
    };
  }

  /**
   * 위치 및 키워드 기반 숙소 검색
   */
  searchStays(keyword = "") {
    const k = keyword.trim().toLowerCase();
    let results = [];

    Object.values(KTO_STAYS_DB).forEach(subList => {
      subList.forEach(stay => {
        let matched = false;
        if (!k) matched = true;
        else if (
          stay.name.toLowerCase().includes(k) ||
          stay.region.toLowerCase().includes(k) ||
          stay.category.toLowerCase().includes(k) ||
          stay.desc.toLowerCase().includes(k)
        ) {
          matched = true;
        }

        if (matched) results.push(stay);
      });
    });

    return {
      success: true,
      keyword,
      count: results.length,
      stays: results
    };
  }
}

module.exports = new StayService();
