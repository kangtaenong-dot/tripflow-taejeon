// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const agentEngine = require('./services/agentEngine');
const visitKoreaService = require('./services/visitKoreaService');
const trafficEngine = require('./services/trafficEngine');
const gourmetService = require('./services/gourmetService');
const stayService = require('./services/stayService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. 코스 생성 API
app.post('/api/generate-plan', (req, res) => {
  try {
    const plan = agentEngine.generatePlan(req.body);
    return res.json(plan);
  } catch (error) {
    console.error('Plan generation error:', error);
    return res.status(500).json({ success: false, message: '일정 생성 중 오류가 발생했습니다.' });
  }
});

// 2. 한국관광공사(대한민국 구석구석) 우선 참조 Q&A API
app.post('/api/chat-visitkorea', (req, res) => {
  try {
    const { question } = req.body;
    const response = visitKoreaService.answerQuestion(question);
    return res.json(response);
  } catch (error) {
    console.error('VisitKorea QA error:', error);
    return res.status(500).json({ success: false, message: '한국관광공사 데이터 조회 중 오류가 발생했습니다.' });
  }
});

// 3. 한국도로공사·관광공사 연계 정체 예측 및 골든타임 시뮬레이션 API
app.post('/api/traffic-predict', (req, res) => {
  try {
    const { destinationId = "GANGWON_EAST", direction = "outbound" } = req.body;
    const result = trafficEngine.simulateDepartureTimes(destinationId, direction);
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('Traffic prediction error:', error);
    return res.status(500).json({ success: false, message: '교통 정체 예측 중 오류가 발생했습니다.' });
  }
});

// 4. 한국관광공사 연계 7~9끼 식도락 로드맵 API
app.post('/api/restaurants/meal-plan', (req, res) => {
  try {
    const { regionId = "WEST_COAST_SEOCHON", days = 3 } = req.body || {};
    const plan = gourmetService.generateMealPlan(regionId, days);
    return res.json(plan);
  } catch (error) {
    console.error('Meal plan error:', error);
    return res.status(500).json({ success: false, message: '식도락 로드맵 생성 중 오류가 발생했습니다.' });
  }
});

// 5. 내 위치/경유지 기준 실시간 KTO 공인 맛집 검색 API
app.post('/api/restaurants/search', (req, res) => {
  try {
    const { keyword = "" } = req.body;
    const results = gourmetService.searchRestaurants(keyword);
    return res.json(results);
  } catch (error) {
    console.error('Restaurant search error:', error);
    return res.status(500).json({ success: false, message: '식당 검색 중 오류가 발생했습니다.' });
  }
});

// 6. 한국관광 품질인증(KQ) 및 한옥스테이 숙박 API
app.all('/api/stays/list', (req, res) => {
  try {
    const regionId = (req.body && req.body.regionId) || req.query.regionId || "WEST_COAST_SEOCHON";
    const results = stayService.getStaysForRegion(regionId);
    return res.json(results);
  } catch (error) {
    console.error('Stays list error:', error);
    return res.status(500).json({ success: false, message: '숙소 목록 조회 중 오류가 발생했습니다.' });
  }
});

app.post('/api/stays/search', (req, res) => {
  try {
    const { keyword = "" } = req.body;
    const results = stayService.searchStays(keyword);
    return res.json(results);
  } catch (error) {
    console.error('Stays search error:', error);
    return res.status(500).json({ success: false, message: '숙소 검색 중 오류가 발생했습니다.' });
  }
});

// 2. 대전 출발 특화 추석 연휴 추천 프리셋 목록 API (수평 및 남쪽 방향 중심)
app.get('/api/presets', (req, res) => {
  const presets = [
    {
      id: "preset_west_coast",
      title: "🌊 [수평 좌측] 서해안 낭만 & 꽃게·대하 3일 코스",
      subtitle: "보령·원산도·서천·군산 (서천공주선 70분 바다 직행! 정체 0%)",
      tag: "대전 출발 만족도 1위",
      params: {
        season: "가을",
        days: 3,
        companion: "가족",
        themes: ["맛집", "자연", "힐링"],
        startLocation: "대전/세종/충청",
        pace: "relaxed",
        transport: "car",
        customRequest: "보령 서천 군산 서해안"
      }
    },
    {
      id: "preset_inland_healing",
      title: "🌲 [수평 우측 & 남쪽] 대청호·속리산·무주·완주 힐링 3일 코스",
      subtitle: "대청호 억새, 법주사 세조길 단풍, 구천동 계곡, 아원고택 (45분 소요)",
      tag: "정체 0% 무장애 힐링",
      params: {
        season: "가을",
        days: 3,
        companion: "부모님",
        themes: ["힐링", "자연", "역사"],
        startLocation: "대전/세종/충청",
        pace: "relaxed",
        transport: "car",
        customRequest: "대청호 속리산 무주 완주"
      }
    },
    {
      id: "preset_namdo",
      title: "🌾 [남쪽 방향] 남도 황금갈대 & 여수 밤바다 3일 코스",
      subtitle: "전주·담양·순천만·여수 (호남고속도로 남행 1시간 40분 직행)",
      tag: "자연·미식 끝판왕",
      params: {
        season: "가을",
        days: 3,
        companion: "가족",
        themes: ["자연", "맛집", "감성"],
        startLocation: "대전/세종/충청",
        pace: "relaxed",
        transport: "car",
        customRequest: "여수 순천 담양 남도"
      }
    },
    {
      id: "preset_gyeongju",
      title: "🍁 [남동쪽 방향] 영남 천년고도 역사 & 동해 3일 코스",
      subtitle: "대구·경주·포항 (경부선 남행 2시간대 쾌속, 첨성대 핑크뮬리)",
      tag: "부모님·연인 추천",
      params: {
        season: "가을",
        days: 3,
        companion: "부모님",
        themes: ["역사", "힐링", "맛집"],
        startLocation: "대전/세종/충청",
        pace: "relaxed",
        transport: "car",
        customRequest: "경주 포항 영남"
      }
    }
  ];

  res.json({ success: true, presets });
});

// 3. 상태 확인
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', service: 'MyTrip Copilot Agent' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 [MyTrip Copilot] 국내 여행 에이전트 서비스 실행 중!`);
  console.log(`👉 로컬 PC 접속:   http://localhost:${PORT}`);
  console.log(`👉 스마트폰 접속:   http://211.107.214.12:${PORT}`);
  console.log(`====================================================`);
});
