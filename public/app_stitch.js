// public/app_stitch.js
// Stitch TripFlow Korea UI/UX 연동 인터랙티브 스크립트
// - 대시보드 메인 화면 & 2대 대메뉴 (교통안내 / 숙박·식사 안내) 허브 연동
// - 서브화면 진입 및 "대시보드로 나가기" 양방향 네비게이션
// - 누적 경로 기억 (Journey Memory Tracker)
// - 한국관광공사(KTO) 공인 7~9끼 식도락 및 품질인증 숙소·한옥스테이 매핑

let currentTripData = null;
let currentDayData = null;
let currentMealPlanData = null;
let currentMealFilter = "all";
let currentStayData = null;

let currentSelectedDays = 3;
let currentSeason = "가을";
let currentSeasonBadge = "추석 연휴 특수";
let currentRegionId = "WEST_COAST_SEOCHON";

// LocalStorage 기반 방문 및 식사 완료 상태 관리
let visitedStops = new Set();
let completedMeals = new Set();

try {
  const savedStops = localStorage.getItem('tripflow_visited_stops');
  if (savedStops) visitedStops = new Set(JSON.parse(savedStops));

  const savedMeals = localStorage.getItem('tripflow_completed_meals');
  if (savedMeals) completedMeals = new Set(JSON.parse(savedMeals));
} catch (e) {
  console.warn('LocalStorage load warning:', e);
}

document.addEventListener('DOMContentLoaded', () => {
  setupBottomNav();
  setupDashboardHeroButtons();
  setupBackButtonEvents();
  setupStayDiningTabs();
  setupHeaderSeasonModal();
  setupDaysSegment();
  loadPresets();
  setupFilterChips();
  setupFormEvents();
  setupQaEvents();
  setupJourneyEvents();
  setupGourmetEvents();
  setupStayEvents();
  loadInitialTraffic();

  // 최초 로딩 시 기본 맛집 및 숙소 세팅
  loadInitialGourmetAndStays();
});

// ==========================================================
// 1. 하단 iOS 네비게이션 탭 전환 & 뷰 라우팅 (대시보드 포함)
// ==========================================================
function switchView(targetId) {
  const navBtns = document.querySelectorAll('.nav-btn');
  const views = {
    viewDashboard: document.getElementById('viewDashboard'),
    viewTraffic: document.getElementById('viewTraffic'),
    viewStayDining: document.getElementById('viewStayDining'),
    viewItinerary: document.getElementById('viewItinerary'),
    viewQa: document.getElementById('viewQa')
  };

  // 탭 활성화 상태 변경
  navBtns.forEach(b => {
    if (b.getAttribute('data-target') === targetId) {
      b.classList.add('active', 'text-slate-900');
      b.classList.remove('text-slate-400');
    } else {
      b.classList.remove('active', 'text-slate-900');
      b.classList.add('text-slate-400');
    }
  });

  // 뷰 표시 전환
  Object.keys(views).forEach(vKey => {
    if (views[vKey]) {
      if (vKey === targetId) {
        views[vKey].classList.remove('hidden');
      } else {
        views[vKey].classList.add('hidden');
      }
    }
  });

  // 스크롤 상단 이동
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupBottomNav() {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      switchView(targetId);
    });
  });

  // 로고 클릭 시 대시보드로 복귀
  const logoBtn = document.getElementById('btnLogoHome');
  if (logoBtn) {
    logoBtn.addEventListener('click', () => switchView('viewDashboard'));
  }
}

// ==========================================================
// 2. 대시보드 2대 대메뉴 및 퀵 카드 클릭 이벤트
// ==========================================================
function setupDashboardHeroButtons() {
  // A. 대메뉴 1: 교통안내 (길안내)
  const btnTraffic = document.getElementById('dashBtnTraffic');
  if (btnTraffic) {
    btnTraffic.addEventListener('click', () => switchView('viewTraffic'));
  }

  // B. 대메뉴 2: 숙박과 식사 안내
  const btnStayDining = document.getElementById('dashBtnStayDining');
  if (btnStayDining) {
    btnStayDining.addEventListener('click', () => switchView('viewStayDining'));
  }

  // C. 3일 추천 일정 & 발자취 카드
  const btnItinerary = document.getElementById('dashBtnItinerary');
  if (btnItinerary) {
    btnItinerary.addEventListener('click', () => switchView('viewItinerary'));
  }

  // D. 한국관광공사 AI 비서 카드
  const btnQa = document.getElementById('dashBtnQa');
  if (btnQa) {
    btnQa.addEventListener('click', () => switchView('viewQa'));
  }
}

// 서브화면 상단의 "← 메인 대시보드로 나가기" 공통 이벤트
function setupBackButtonEvents() {
  const backBtns = document.querySelectorAll('.btn-back-dashboard');
  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchView('viewDashboard');
    });
  });
}

// ==========================================================
// 3. 숙박·식사 서브화면 내부 탭 스위처 ([식도락] vs [안심숙박])
// ==========================================================
function setupStayDiningTabs() {
  const tabBtnDining = document.getElementById('tabBtnDining');
  const tabBtnStay = document.getElementById('tabBtnStay');
  const panelDining = document.getElementById('panelDining');
  const panelStay = document.getElementById('panelStay');

  if (tabBtnDining && tabBtnStay && panelDining && panelStay) {
    tabBtnDining.addEventListener('click', () => {
      tabBtnDining.className = 'flex-1 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all active';
      tabBtnStay.className = 'flex-1 py-2.5 rounded-xl text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:text-slate-900';
      panelDining.classList.remove('hidden');
      panelStay.classList.add('hidden');
    });

    tabBtnStay.addEventListener('click', () => {
      tabBtnStay.className = 'flex-1 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all active';
      tabBtnDining.className = 'flex-1 py-2.5 rounded-xl text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:text-slate-900';
      panelStay.classList.remove('hidden');
      panelDining.classList.add('hidden');
    });
  }
}

// ==========================================================
// 3-B. 상단 시즌/테마 배너 모달 & 원클릭 일수(Days) 세그먼트
// ==========================================================
function setupHeaderSeasonModal() {
  const badgeBtn = document.getElementById('btnHeaderSeasonBadge');
  const modal = document.getElementById('modalSeasonTheme');
  const closeBtn = document.getElementById('btnCloseSeasonModal');

  if (badgeBtn && modal) {
    badgeBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  const seasonOptions = document.querySelectorAll('.btn-season-opt');
  seasonOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      seasonOptions.forEach(o => {
        o.className = 'btn-season-opt p-3 rounded-2xl border border-slate-200 hover:border-slate-400 text-left flex flex-col gap-1 transition-all cursor-pointer';
      });
      opt.className = 'btn-season-opt p-3 rounded-2xl border-2 border-amber-500 bg-amber-50/50 text-left flex flex-col gap-1 transition-all cursor-pointer';

      const season = opt.getAttribute('data-season') || '가을';
      const badgeText = opt.getAttribute('data-badge') || '추석 연휴 특수';

      currentSeason = season;
      currentSeasonBadge = badgeText;

      const badgeElem = document.getElementById('headerSeasonBadgeText');
      if (badgeElem) badgeElem.innerText = badgeText;

      const seasonSelect = document.getElementById('mSeasonSelect');
      if (seasonSelect) seasonSelect.value = season;

      modal.classList.add('hidden');

      // 시즌 변경 시 일정 자동 재생성
      generatePlan();
    });
  });
}

function setupDaysSegment() {
  const daySegmentBtns = document.querySelectorAll('.btn-day-segment');
  daySegmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const days = parseInt(btn.getAttribute('data-days'), 10) || 3;
      setDurationDays(days);
    });
  });
}

function setDurationDays(days) {
  currentSelectedDays = days;

  // 1. 세그먼트 버튼 UI 활성화
  const daySegmentBtns = document.querySelectorAll('.btn-day-segment');
  daySegmentBtns.forEach(b => {
    const d = parseInt(b.getAttribute('data-days'), 10);
    if (d === days) {
      b.className = 'btn-day-segment active py-2 rounded-lg text-xs font-black bg-slate-900 text-white shadow-xs transition-all text-center';
    } else {
      b.className = 'btn-day-segment py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition-all text-center';
    }
  });

  // 2. 하단 폼의 select 값 동기화
  const daysSelect = document.getElementById('mDaysSelect');
  if (daysSelect) daysSelect.value = days;

  // 3. 대시보드 카드 레이블 동적 변경
  const summaryElem = document.getElementById('dashDurationSummary');
  const trafficTag = document.getElementById('dashTrafficDaysTag');
  const mealCountBadge = document.getElementById('dashDiningMealCountBadge');
  const stayNightBadge = document.getElementById('dashStayNightCountBadge');
  const diningDesc = document.getElementById('dashDiningDesc');

  let durationText = "";
  let mealText = "";
  let stayText = "";

  if (days === 1) {
    durationText = "당일치기 (2~3끼)";
    mealText = "당일 2~3끼";
    stayText = "당일 (숙박 없음)";
    if (trafficTag) trafficTag.innerText = "당일 힐링 코스";
    if (diningDesc) diningDesc.innerText = "길에서 시간 버리지 않는 실시간 트래픽과 당일 2~3끼 로컬 식도락 안내";
  } else if (days === 2) {
    durationText = "1박 2일 (4~5끼)";
    mealText = "4~5끼 식사";
    stayText = "1박 (인증 숙소)";
    if (trafficTag) trafficTag.innerText = "1박 2일 코스";
    if (diningDesc) diningDesc.innerText = "경로보다 100배 중요한 2일간 4~5끼 식도락 로드맵(백년가게)과 KTO 품질인증 안심 숙소 안내";
  } else if (days === 3) {
    durationText = "2박 3일 (7~9끼)";
    mealText = "7~9끼 식사";
    stayText = "2박 (한옥·호텔)";
    if (trafficTag) trafficTag.innerText = "3일 연휴 코스";
    if (diningDesc) diningDesc.innerText = "경로보다 100배 중요한 3일간 7~9끼 식도락 로드맵(백년가게)과 한국관광 품질인증(KQ) 안심 숙소·한옥스테이 통합 안내";
  } else if (days === 4) {
    durationText = "3박 4일 (10~12끼)";
    mealText = "10~12끼 식사";
    stayText = "3박 (명품 투숙)";
    if (trafficTag) trafficTag.innerText = "4일 힐링 코스";
    if (diningDesc) diningDesc.innerText = "경로보다 100배 중요한 4일간 10~12끼 식도락 로드맵과 한국관광 품질인증 숙소 안내";
  }

  if (summaryElem) summaryElem.innerText = durationText;
  if (mealCountBadge) mealCountBadge.innerText = mealText;
  if (stayNightBadge) stayNightBadge.innerText = stayText;

  // 4. 식도락 로드맵 및 일정 재생성
  generatePlan();
}

// ==========================================================
// 4. 추천 프리셋 로드 (대전 출발 수평/남쪽)
// ==========================================================
async function loadPresets() {
  const container = document.getElementById('mobilePresetList');
  try {
    const res = await fetch('/api/presets');
    const data = await res.json();
    if (data.success && data.presets) {
      container.innerHTML = '';
      data.presets.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'p-3 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between cursor-pointer hover:border-teal-600 transition-all';
        card.innerHTML = `
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-slate-900">${p.title}</span>
              <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">${p.tag}</span>
            </div>
            <span class="text-[11px] text-slate-500 mt-0.5">${p.subtitle}</span>
          </div>
          <span class="material-symbols-outlined text-teal-700 text-[20px]">arrow_forward_ios</span>
        `;
        card.addEventListener('click', () => {
          applyPresetAndRun(p.params);
        });
        container.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Preset loading failed:', err);
  }
}

function applyPresetAndRun(params) {
  if (params.season) {
    document.getElementById('mSeasonSelect').value = params.season;
    currentSeason = params.season;
  }
  if (params.days) {
    currentSelectedDays = params.days;
    document.getElementById('mDaysSelect').value = params.days;
  }
  if (params.startLocation) document.getElementById('mStartLocation').value = params.startLocation;
  if (params.customRequest) document.getElementById('mCustomRequest').value = params.customRequest;

  if (params.companion) {
    document.querySelectorAll('.comp-chip').forEach(chip => {
      if (chip.getAttribute('data-val') === params.companion) {
        chip.click();
      }
    });
  }

  // 일수 세그먼트 UI 동기화
  const daySegmentBtns = document.querySelectorAll('.btn-day-segment');
  daySegmentBtns.forEach(b => {
    const d = parseInt(b.getAttribute('data-days'), 10);
    if (d === currentSelectedDays) {
      b.className = 'btn-day-segment active py-2 rounded-lg text-xs font-black bg-slate-900 text-white shadow-xs transition-all text-center';
    } else {
      b.className = 'btn-day-segment py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition-all text-center';
    }
  });

  generatePlan(true);
}

function setupFilterChips() {
  const compChips = document.querySelectorAll('.comp-chip');
  compChips.forEach(chip => {
    chip.addEventListener('click', () => {
      compChips.forEach(c => {
        c.classList.remove('bg-slate-900', 'text-white', 'shadow-xs');
        c.classList.add('bg-slate-100', 'text-slate-600');
      });
      chip.classList.remove('bg-slate-100', 'text-slate-600');
      chip.classList.add('bg-slate-900', 'text-white', 'shadow-xs');
    });
  });

  const themeChips = document.querySelectorAll('.theme-chip');
  themeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.classList.contains('bg-emerald-800')) {
        chip.classList.remove('bg-emerald-800', 'text-white');
        chip.classList.add('bg-slate-100', 'text-slate-600');
      } else {
        chip.classList.add('bg-emerald-800', 'text-white');
        chip.classList.remove('bg-slate-100', 'text-slate-600');
      }
    });
  });
}

function setupFormEvents() {
  const form = document.getElementById('mobileTripForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generatePlan(true);
  });

  document.getElementById('mPrintBtn').addEventListener('click', () => window.print());
  document.getElementById('mCopyBtn').addEventListener('click', () => copyToClipboard());
}

async function generatePlan(shouldSwitchView = false) {
  const btn = document.getElementById('mGenerateBtn');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span><span>대전 출발 최적 경로 & 식도락 분석 중...</span>';

  const season = document.getElementById('mSeasonSelect').value;
  const days = parseInt(document.getElementById('mDaysSelect').value, 10);
  const startLocation = document.getElementById('mStartLocation').value;
  const transport = document.getElementById('mTransport').value;
  const customRequest = document.getElementById('mCustomRequest').value.trim();

  const activeComp = document.querySelector('.comp-chip.bg-slate-900')?.getAttribute('data-val') || '가족';
  const activeThemes = Array.from(document.querySelectorAll('.theme-chip.bg-emerald-800')).map(c => c.getAttribute('data-val'));

  const payload = {
    season,
    days,
    startLocation,
    transport,
    companion: activeComp,
    themes: activeThemes,
    customRequest
  };

  try {
    const res = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      currentTripData = data;
      currentRegionId = data.region.id;

      // 대시보드 권역 레이블 갱신
      const heroElem = document.getElementById('dashHeroRegion');
      if (heroElem) heroElem.innerText = data.region.name;

      renderItinerary(data);

      // 식도락 로드맵 갱신
      if (data.mealPlan) {
        currentMealPlanData = data.mealPlan;
        renderMealPlanCards(currentMealPlanData);
      } else {
        loadMealPlanForRegion(data.region.id, days);
      }

      // 해당 권역 추천 숙소 자동 갱신
      loadStaysForRegion(data.region.id);

      // 일정 화면으로 전환 (폼 제출 또는 프리셋 클릭 시)
      if (shouldSwitchView) {
        switchView('viewItinerary');
      }
    } else {
      alert('일정을 생성하지 못했습니다.');
    }
  } catch (err) {
    console.error('Plan error:', err);
    alert('서버 연결 중 오류가 발생했습니다.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// ==========================================================
// 5. 3일 일정 & 누적 여정 트래커 (Journey Memory Tracker)
// ==========================================================
function renderItinerary(data) {
  document.getElementById('itineraryTitle').innerText = data.region.name;
  document.getElementById('itineraryVibe').innerText = `✨ ${data.region.vibe}`;
  document.getElementById('itineraryDaysTag').innerText = `${data.meta.days}일 연휴 코스`;

  if (data.trafficSimulation && data.trafficSimulation.goldenTime) {
    const gt = data.trafficSimulation.goldenTime;
    document.getElementById('plannerSavedTimeBadge').innerText = `${gt.savedTimeText} 단축`;
    document.getElementById('plannerGoldenTimeBig').innerText = gt.bestTimeLabel.split('~')[0].trim();
    document.getElementById('plannerEstimatedDuration').innerText = gt.bestEstimatedText;
  }

  const dayTabsContainer = document.getElementById('dayTabsContainer');
  dayTabsContainer.innerHTML = '';

  data.itinerary.forEach((dayItem, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `day-filter-btn flex-1 py-2 rounded-xl text-xs font-bold transition-all ${idx === 0 ? 'bg-slate-900 text-white shadow-xs active' : 'bg-slate-100 text-slate-600'}`;
    btn.innerText = `Day ${dayItem.day}`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.day-filter-btn').forEach(b => {
        b.className = 'day-filter-btn flex-1 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-600';
      });
      btn.className = 'day-filter-btn flex-1 py-2 rounded-xl text-xs font-bold transition-all bg-slate-900 text-white shadow-xs active';
      currentDayData = dayItem;
      renderDayStream(dayItem);
      updateJourneyMemoryBar();
    });
    dayTabsContainer.appendChild(btn);
  });

  if (data.itinerary.length > 0) {
    currentDayData = data.itinerary[0];
    renderDayStream(data.itinerary[0]);
    updateJourneyMemoryBar();
  }
}

function renderDayStream(day) {
  const container = document.getElementById('timelineCardsContainer');
  container.innerHTML = '';

  const totalDays = (currentTripData && currentTripData.meta && currentTripData.meta.days) || currentSelectedDays || 3;
  const isFirstDay = (day.day === 1);
  const isLastDay = (day.day === totalDays);

  // 직전 일차 숙박지 명칭 확인
  const prevDayStaySpot = (!isFirstDay && currentTripData && currentTripData.itinerary && currentTripData.itinerary[day.day - 2]?.night?.spot)
    ? currentTripData.itinerary[day.day - 2].night.spot
    : null;

  // 1. 아침 출발 스팟 (1일차: 대전 자택 출발 / 2일차 이상: 직전 숙박지 퇴실 & 이동 출발)
  const startStop = {
    key: `d${day.day}_start`,
    time: isFirstDay ? "06:30 AM" : "09:00 AM",
    slot: isFirstDay ? "첫 출발" : `${day.day}일차 숙소 출발`,
    spot: isFirstDay
      ? (day.startPoint?.name || "🏡 대전 자택 출발 (우리집) · 골든타임 진입")
      : (day.startPoint?.name || `🛏️ ${day.day - 1}일차 숙박지 [${prevDayStaySpot ? prevDayStaySpot.slice(0, 12) : '숙소'}] 퇴실 & 이동 출발`),
    desc: isFirstDay
      ? (day.startPoint?.desc || "서천공주선/호남선 진입 · 수도권 상행선 극심 정체를 100% 회피하는 대전 출발 쾌속 코스")
      : (day.startPoint?.desc || `1일차 숙소 체크아웃 후 인접 ${day.morning.spot} 방면 이동 (정체 0% 로컬 쾌속 연결)`),
    icon: isFirstDay ? "departure_board" : "hotel",
    map: null,
    kto: null,
    isStart: true,
    badge: isFirstDay ? "🟢 대전 출발 쾌속" : `🛏️ ${day.day - 1}일차 숙소 출발`
  };

  const stops = [
    startStop,
    {
      key: `d${day.day}_morning`,
      time: "09:30 AM",
      slot: "오전 힐링",
      spot: day.morning.spot,
      desc: day.morning.desc,
      icon: "forest",
      map: day.morning.mapUrl,
      kto: day.morning.visitKoreaUrl
    },
    {
      key: `d${day.day}_lunch`,
      time: "12:30 PM",
      slot: "점심 맛집",
      spot: day.lunch.spot,
      desc: day.lunch.desc,
      icon: "restaurant",
      map: day.lunch.mapUrl,
      kto: null
    },
    {
      key: `d${day.day}_afternoon`,
      time: "03:00 PM",
      slot: "오후 탐방",
      spot: day.afternoon.spot,
      desc: day.afternoon.desc,
      icon: "landscape",
      map: day.afternoon.mapUrl,
      kto: day.afternoon.visitKoreaUrl
    },
    {
      key: `d${day.day}_cafe`,
      time: "05:30 PM",
      slot: "카페 쉼표",
      spot: day.cafe.spot,
      desc: day.cafe.desc,
      icon: "coffee",
      map: day.cafe.mapUrl,
      kto: null
    },
    {
      key: `d${day.day}_dinner`,
      time: "07:30 PM",
      slot: "저녁 만찬",
      spot: day.dinner.spot,
      desc: day.dinner.desc,
      icon: "dinner_dining",
      map: day.dinner.mapUrl,
      kto: null
    }
  ];

  // 마지막 밤: 마지막 날이면 대전 자택 복귀, 중간 날이면 숙박지 체크인
  if (isLastDay) {
    stops.push({
      key: `d${day.day}_return`,
      time: "08:30 PM",
      slot: "여정 완주",
      spot: day.endPoint?.name || "🏡 대전 자택 안전 귀가 및 여정 완료",
      desc: day.endPoint?.desc || `상행선 정체 회피 쾌속 복귀 · ${totalDays}일간의 모든 일정을 안전하게 마무리하고 귀가 (속 편한 귀가식: 대전 오씨칼국수/솔밭묵집)`,
      icon: "home",
      map: null,
      kto: null,
      isEnd: true,
      badge: "🎉 여정 완주"
    });
  } else {
    stops.push({
      key: `d${day.day}_night`,
      time: "09:00 PM",
      slot: `${day.day}일차 숙박`,
      spot: day.night.spot,
      desc: `권장 숙소 권역: ${day.night.stayArea} (한국관광 품질인증·한옥스테이)`,
      icon: "hotel",
      map: null,
      kto: null,
      badge: `🏨 ${day.day}일차 숙소`
    });
  }

  stops.forEach((stop) => {
    const isVisited = visitedStops.has(stop.key);

    const card = document.createElement('div');
    card.className = 'relative pl-6';
    card.innerHTML = `
      <div class="absolute left-1.5 top-3.5 w-4 h-4 rounded-full ${isVisited ? 'bg-emerald-600 ring-4 ring-emerald-100' : (stop.isStart ? 'bg-teal-700' : (stop.isEnd ? 'bg-amber-600' : 'bg-slate-900'))} text-white flex items-center justify-center -translate-x-1/2 shadow-xs transition-all">
        ${isVisited ? '<span class="material-symbols-outlined text-[10px]">check</span>' : '<span class="w-2 h-2 rounded-full bg-white"></span>'}
      </div>

      <div class="rounded-2xl bg-white p-3.5 shadow-xs border ${isVisited ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-100'} flex flex-col gap-2 transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-black text-slate-800">${stop.time}</span>
            <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">${stop.slot}</span>
          </div>
          <div class="flex items-center gap-1">
            ${isVisited ? '<span class="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">✔ 방문 완료</span>' : ''}
            ${stop.kto ? '<span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">🏛️ KTO 공인</span>' : ''}
            ${stop.badge ? `<span class="text-[10px] font-bold ${stop.isStart ? 'text-teal-800 bg-teal-50' : (stop.isEnd ? 'text-amber-900 bg-amber-100' : 'text-indigo-800 bg-indigo-50')} px-2 py-0.5 rounded-full">${stop.badge}</span>` : ''}
          </div>
        </div>

        <h4 class="text-sm font-extrabold text-slate-900 ${isVisited ? 'line-through text-slate-500' : ''}">${stop.spot}</h4>
        <p class="text-xs text-slate-600 leading-snug">${stop.desc}</p>

        <div class="flex items-center justify-between pt-1.5 border-t border-slate-100 mt-1">
          <button type="button" class="btn-checkin-toggle flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition-all ${isVisited ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'}" data-key="${stop.key}" data-spot="${stop.spot}">
            <span class="material-symbols-outlined text-[14px]">${isVisited ? 'check_circle' : 'radio_button_unchecked'}</span>
            <span>${isVisited ? '방문 완료' : '방문 완료 체크'}</span>
          </button>

          <div class="flex items-center gap-1.5 ml-auto">
            ${stop.kto ? `<a href="${stop.kto}" target="_blank" class="text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg flex items-center gap-0.5">🏛️ KTO ↗</a>` : ''}
            ${stop.map ? `<a href="${stop.map}" target="_blank" class="text-[11px] font-bold text-slate-900 bg-amber-300 hover:bg-amber-400 px-2.5 py-1 rounded-lg flex items-center gap-0.5">🗺️ 길찾기</a>` : ''}
          </div>
        </div>
      </div>
    `;

    const checkinBtn = card.querySelector('.btn-checkin-toggle');
    checkinBtn.addEventListener('click', () => {
      toggleStopVisited(stop.key, stop.spot);
    });

    container.appendChild(card);
  });
}

function toggleStopVisited(key, spotName) {
  if (visitedStops.has(key)) {
    visitedStops.delete(key);
  } else {
    visitedStops.add(key);
  }

  try {
    localStorage.setItem('tripflow_visited_stops', JSON.stringify(Array.from(visitedStops)));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }

  if (currentDayData) {
    renderDayStream(currentDayData);
  }
  updateJourneyMemoryBar();
}

function updateJourneyMemoryBar() {
  if (!currentTripData || !currentTripData.itinerary) return;

  const totalDays = currentTripData.itinerary.length;
  let allStops = [];

  currentTripData.itinerary.forEach((d, idx) => {
    const isFirst = (idx === 0);
    const isLast = (idx === totalDays - 1);

    if (isFirst) {
      allStops.push({
        key: `d${d.day}_start`,
        day: d.day,
        spotShort: "대전 출발",
        fullSpot: "🏡 대전 자택 출발 (우리집)"
      });
    } else {
      const prevStay = currentTripData.itinerary[idx - 1]?.night?.spot || `${idx}일차 숙박지`;
      allStops.push({
        key: `d${d.day}_start`,
        day: d.day,
        spotShort: `${idx}일차숙소`,
        fullSpot: `🛏️ ${idx}일차 숙소 [${prevStay.slice(0, 10)}] 출발`
      });
    }

    allStops.push({ key: `d${d.day}_morning`, day: d.day, spotShort: d.morning.spot.slice(0, 7), fullSpot: d.morning.spot });
    allStops.push({ key: `d${d.day}_lunch`, day: d.day, spotShort: d.lunch.spot.slice(0, 7), fullSpot: d.lunch.spot });
    allStops.push({ key: `d${d.day}_afternoon`, day: d.day, spotShort: d.afternoon.spot.slice(0, 7), fullSpot: d.afternoon.spot });
    allStops.push({ key: `d${d.day}_dinner`, day: d.day, spotShort: d.dinner.spot.slice(0, 7), fullSpot: d.dinner.spot });

    if (!isLast) {
      allStops.push({
        key: `d${d.day}_night`,
        day: d.day,
        spotShort: `${d.day}일차숙박`,
        fullSpot: `🏨 ${d.day}일차 숙박 [${d.night.spot.slice(0, 10)}]`
      });
    } else {
      allStops.push({
        key: `d${d.day}_return`,
        day: d.day,
        spotShort: "대전 복귀",
        fullSpot: "🏡 대전 자택 안전 복귀"
      });
    }
  });

  const totalStops = allStops.length;
  const visitedCount = Array.from(visitedStops).filter(k => allStops.some(s => s.key === k)).length;
  const pct = Math.min(Math.round((visitedCount / totalStops) * 100), 100);

  const progressBar = document.getElementById('journeyProgressBar');
  if (progressBar) progressBar.style.width = `${pct}%`;

  const progressPct = document.getElementById('journeyProgressPct');
  if (progressPct) progressPct.innerText = `${pct}%`;

  const progressLabel = document.getElementById('journeyProgressLabel');
  if (progressLabel) progressLabel.innerText = `총 ${totalStops}개 여정 마일스톤 중 ${visitedCount}곳 통과`;

  const chainList = document.getElementById('journeyChainList');
  if (!chainList) return;
  chainList.innerHTML = '';

  let currentAnchorSpot = null;
  let nextRecommendedSpot = null;

  allStops.forEach((stop, idx) => {
    if (idx > 0) {
      const arrow = document.createElement('span');
      arrow.className = 'text-slate-300 font-black shrink-0 text-[10px]';
      arrow.innerText = '➔';
      chainList.appendChild(arrow);
    }

    const isVisited = visitedStops.has(stop.key);
    const isCurrent = !isVisited && !currentAnchorSpot;

    if (isCurrent) {
      currentAnchorSpot = stop.fullSpot;
      nextRecommendedSpot = allStops[idx + 1]?.fullSpot || "대전 자택 복귀";
    }

    const badge = document.createElement('div');
    badge.className = `shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
      isVisited
        ? 'bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-300'
        : isCurrent
          ? 'bg-teal-800 text-white font-black ring-2 ring-teal-400 animate-pulse'
          : 'bg-slate-100 text-slate-500'
    }`;
    badge.innerHTML = `
      <span>${isVisited ? '✔' : (isCurrent ? '📍' : '⏳')}</span>
      <span>${stop.spotShort}</span>
    `;
    chainList.appendChild(badge);
  });

  const anchorElem = document.getElementById('journeyCurrentAnchor');
  const adviceElem = document.getElementById('journeyNextAdvice');

  const isAllDone = visitedCount === totalStops;

  if (visitedCount === 0) {
    if (anchorElem) anchorElem.innerText = `📍 첫 출발 대기: 대전 자택 (우리집)`;
    if (adviceElem) adviceElem.innerText = `골든타임(06:15 AM)에 대전에서 출발하여 상행선 정체를 회피합니다. 첫 경유지 도착 후 [방문 완료]를 누르면 실시간 누적 동선 관리가 시작됩니다.`;
  } else if (isAllDone) {
    if (anchorElem) anchorElem.innerText = `🎉 ${totalDays}일 전 일정 완주: 대전 자택 안전 복귀 완료!`;
    if (adviceElem) adviceElem.innerText = `대전 자택에서 출발하여 ${totalDays}일간의 모든 경유지를 무사히 다녀오셨습니다. 속 편한 귀가식으로 대전 솔밭묵집이나 오씨칼국수에서 여정을 마무리하세요.`;
  } else {
    if (anchorElem) anchorElem.innerText = `📍 현재 체류/진행 중: [${currentAnchorSpot || '경유지'}]`;
    if (adviceElem) adviceElem.innerText = `💡 대전 자택 출발 ➔ ${visitedCount}곳 방문 완료! 지나온 발자취(숙박지 포함)를 기억한 상태에서 다음 목적지인 [${nextRecommendedSpot}] 및 최종 대전 복귀까지 전체 동선이 연속적으로 관리됩니다.`;
  }
}

function setupJourneyEvents() {
  const resetBtn = document.getElementById('btnResetJourney');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('모든 방문 완료 기록을 초기화하시겠습니까?')) {
        visitedStops.clear();
        try {
          localStorage.removeItem('tripflow_visited_stops');
        } catch (e) {}
        if (currentDayData) renderDayStream(currentDayData);
        updateJourneyMemoryBar();
      }
    });
  }
}

// ==========================================================
// 6. 식사(맛집) 로직 & 7~9끼 로드맵
// ==========================================================
function setupGourmetEvents() {
  const locChips = document.querySelectorAll('#gourmetQuickLocs .loc-chip');
  locChips.forEach(chip => {
    chip.addEventListener('click', () => {
      locChips.forEach(c => {
        c.className = 'loc-chip px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors';
      });
      chip.className = 'loc-chip active px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition-colors';

      const loc = chip.getAttribute('data-loc');
      searchGourmetByKeyword(loc);
    });
  });

  const searchInput = document.getElementById('gourmetSearchInput');
  const searchBtn = document.getElementById('btnGourmetSearch');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const q = searchInput.value.trim();
      if (q) searchGourmetByKeyword(q);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = searchInput.value.trim();
        if (q) searchGourmetByKeyword(q);
      }
    });
  }

  const mealFilters = document.querySelectorAll('.meal-day-filter');
  mealFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      mealFilters.forEach(b => {
        b.className = 'meal-day-filter flex-1 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold';
      });
      btn.className = 'meal-day-filter flex-1 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold active';

      currentMealFilter = btn.getAttribute('data-meal-day');
      if (currentMealPlanData) {
        renderMealPlanCards(currentMealPlanData);
      }
    });
  });
}

async function searchGourmetByKeyword(keyword) {
  const container = document.getElementById('gourmetSearchResults');
  if (!container) return;

  container.innerHTML = `
    <div class="p-6 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5 bg-slate-50 rounded-2xl">
      <span class="material-symbols-outlined text-amber-600 animate-spin text-[22px]">progress_activity</span>
      <span>한국관광공사 공인 백년가게·안심식당 데이터를 호출하는 중입니다...</span>
    </div>
  `;

  try {
    const res = await fetch('/api/restaurants/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword })
    });

    const data = await res.json();
    if (data.success && data.restaurants && data.restaurants.length > 0) {
      container.innerHTML = '';
      data.restaurants.forEach(r => {
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-2 hover:border-amber-400 transition-all';
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-slate-900">${r.name}</span>
            <span class="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">${r.category}</span>
          </div>

          <div class="flex items-center gap-1.5 text-[11px] text-teal-800 font-bold">
            <span>${r.certBadge}</span>
            <span class="text-slate-400">·</span>
            <span class="text-slate-600">${r.region}</span>
          </div>

          <div class="p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-950 flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-black text-amber-900">🍲 시그니처: ${r.signatureMenu}</span>
              <span class="text-[11px] font-bold text-slate-500">${r.priceRange}</span>
            </div>
            <span class="text-[11px] text-amber-800 font-bold">💡 추석 연휴: ${r.holidayOpenTip}</span>
          </div>

          <p class="text-xs text-slate-600 leading-snug">${r.desc}</p>
          <div class="text-[10px] text-slate-400">📍 ${r.address} (전화: ${r.phone})</div>

          <div class="flex items-center gap-2 pt-1 border-t border-slate-100 mt-1">
            <a href="tel:${r.phone}" class="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">call</span>
              <span>전화/영업확인</span>
            </a>
            <a href="${r.visitKoreaUrl}" target="_blank" class="text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <span>🏛️ KTO 상세 ↗</span>
            </a>
            <a href="${r.kakaoMapUrl}" target="_blank" class="text-[11px] font-bold text-slate-900 bg-amber-300 hover:bg-amber-400 px-2.5 py-1 rounded-lg flex items-center gap-1 ml-auto">
              <span>🗺️ 길찾기</span>
            </a>
          </div>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = `
        <div class="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
          '${keyword}' 관련 공인 맛집 결과가 없습니다. 다른 지역명이나 메뉴를 검색해 보세요.
        </div>
      `;
    }
  } catch (err) {
    console.error('Restaurant search error:', err);
    container.innerHTML = `<div class="p-4 text-xs text-red-600 bg-red-50 rounded-xl">맛집 데이터 호출 중 오류가 발생했습니다.</div>`;
  }
}

async function loadMealPlanForRegion(regionId, days = currentSelectedDays) {
  try {
    const res = await fetch('/api/restaurants/meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regionId, days: days || currentSelectedDays })
    });
    const data = await res.json();
    if (data.success) {
      currentMealPlanData = data;
      renderMealPlanCards(data);
    }
  } catch (err) {
    console.error('Meal plan fetch error:', err);
  }
}

function renderMealPlanCards(mealPlanData) {
  const container = document.getElementById('mealPlanCardsContainer');
  if (!container || !mealPlanData || !mealPlanData.mealPlan) return;

  container.innerHTML = '';
  const totalMeals = mealPlanData.mealPlan.length;

  let filtered = mealPlanData.mealPlan;
  if (currentMealFilter !== "all") {
    const targetDay = parseInt(currentMealFilter, 10);
    filtered = mealPlanData.mealPlan.filter(m => m.day === targetDay);
  }

  const completedCount = completedMeals.size;
  document.getElementById('mealProgressText').innerText = `${completedCount} / ${totalMeals}끼 완료`;

  filtered.forEach((meal, idx) => {
    const mealKey = `meal_d${meal.day}_${meal.slot}_${idx}`;
    const isDone = completedMeals.has(mealKey);
    const r = meal.restaurant;

    const card = document.createElement('div');
    card.className = `p-3.5 rounded-2xl bg-white border ${isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-100'} shadow-xs flex flex-col gap-2 transition-all`;

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <span class="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">${meal.meal}</span>
          <span class="text-xs font-bold text-slate-800">${meal.title}</span>
        </div>
        <span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">${meal.tag}</span>
      </div>

      <div class="flex items-baseline justify-between pt-1">
        <h4 class="text-sm font-extrabold text-slate-900 ${isDone ? 'line-through text-slate-500' : ''}">${r.name}</h4>
        <span class="text-[11px] font-bold text-slate-500">${r.region}</span>
      </div>

      <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-slate-900">🍲 ${r.signatureMenu}</span>
          <span class="font-bold text-amber-800 text-[11px]">${r.priceRange}</span>
        </div>
        <div class="text-[11px] text-emerald-800 font-bold">${r.certBadge}</div>
        <div class="text-[11px] text-amber-900 font-bold">💡 ${r.holidayOpenTip}</div>
      </div>

      <p class="text-xs text-slate-600 leading-snug">${r.desc}</p>

      <div class="flex items-center justify-between pt-1.5 border-t border-slate-100 mt-1">
        <button type="button" class="btn-meal-check flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all ${isDone ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'}" data-key="${mealKey}">
          <span class="material-symbols-outlined text-[14px]">${isDone ? 'check_circle' : 'radio_button_unchecked'}</span>
          <span>${isDone ? '식사 완료' : '식사 완료 체크'}</span>
        </button>

        <div class="flex items-center gap-1.5 ml-auto">
          <a href="tel:${r.phone}" class="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg flex items-center gap-0.5">
            <span class="material-symbols-outlined text-[13px]">call</span>
            <span>전화</span>
          </a>
          <a href="${r.kakaoMapUrl}" target="_blank" class="text-[11px] font-bold text-slate-900 bg-amber-300 hover:bg-amber-400 px-2 py-1 rounded-lg flex items-center gap-0.5">
            <span>🗺️ 길찾기</span>
          </a>
        </div>
      </div>
    `;

    const mealCheckBtn = card.querySelector('.btn-meal-check');
    mealCheckBtn.addEventListener('click', () => {
      toggleMealDone(mealKey);
    });

    container.appendChild(card);
  });
}

function toggleMealDone(mealKey) {
  if (completedMeals.has(mealKey)) {
    completedMeals.delete(mealKey);
  } else {
    completedMeals.add(mealKey);
  }

  try {
    localStorage.setItem('tripflow_completed_meals', JSON.stringify(Array.from(completedMeals)));
  } catch (e) {}

  if (currentMealPlanData) {
    renderMealPlanCards(currentMealPlanData);
  }
}

// ==========================================================
// 7. 숙박(호텔/한옥스테이) 로직 (KTO 품질인증)
// ==========================================================
function setupStayEvents() {
  const stayChips = document.querySelectorAll('#stayQuickLocs .stay-loc-chip');
  stayChips.forEach(chip => {
    chip.addEventListener('click', () => {
      stayChips.forEach(c => {
        c.className = 'stay-loc-chip px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors';
      });
      chip.className = 'stay-loc-chip active px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition-colors';

      const loc = chip.getAttribute('data-stay-loc');
      searchStaysByKeyword(loc);
    });
  });
}

async function loadStaysForRegion(regionId) {
  try {
    const res = await fetch('/api/stays/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regionId })
    });
    const data = await res.json();
    if (data.success) {
      renderStaysCards(data.stays);
    }
  } catch (err) {
    console.error('Stays fetch error:', err);
  }
}

async function searchStaysByKeyword(keyword) {
  const container = document.getElementById('staysListContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="p-6 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5 bg-slate-50 rounded-2xl">
      <span class="material-symbols-outlined text-indigo-600 animate-spin text-[22px]">progress_activity</span>
      <span>한국관광 품질인증(KQ) 숙소 데이터를 조회하는 중입니다...</span>
    </div>
  `;

  try {
    const res = await fetch('/api/stays/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword })
    });
    const data = await res.json();
    if (data.success && data.stays && data.stays.length > 0) {
      renderStaysCards(data.stays);
    } else {
      container.innerHTML = `
        <div class="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
          '${keyword}' 관련 인증 숙소가 없습니다. 다른 권역을 선택해 보세요.
        </div>
      `;
    }
  } catch (err) {
    console.error('Stays search error:', err);
    container.innerHTML = `<div class="p-4 text-xs text-red-600 bg-red-50 rounded-xl">숙소 데이터 조회 중 오류가 발생했습니다.</div>`;
  }
}

function renderStaysCards(stays) {
  const container = document.getElementById('staysListContainer');
  if (!container) return;
  container.innerHTML = '';

  stays.forEach(stay => {
    const card = document.createElement('div');
    card.className = 'p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-2 hover:border-indigo-400 transition-all';
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-xs font-black text-slate-900">${stay.name}</span>
        <span class="text-[10px] font-extrabold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-full">${stay.category}</span>
      </div>

      <div class="flex items-center gap-1.5 text-[11px] text-teal-800 font-bold">
        <span>${stay.certBadge}</span>
        <span class="text-slate-400">·</span>
        <span class="text-slate-600">${stay.region}</span>
      </div>

      <div class="p-2 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <span class="font-black text-indigo-900">🛏️ 1박 기준: ${stay.priceRange}</span>
          <span class="text-[11px] font-bold text-slate-500">입실 ${stay.checkIn} / 퇴실 ${stay.checkOut}</span>
        </div>
        <span class="text-[11px] text-indigo-800 font-bold">💡 추석 편의: ${stay.holidayTip}</span>
      </div>

      <p class="text-xs text-slate-600 leading-snug">${stay.desc}</p>
      <div class="text-[10px] text-slate-400">📍 ${stay.address} (전화: ${stay.phone})</div>

      <div class="flex items-center gap-2 pt-1 border-t border-slate-100 mt-1">
        <a href="tel:${stay.phone}" class="text-[11px] font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">call</span>
          <span>전화/예약확인</span>
        </a>
        <a href="${stay.visitKoreaUrl}" target="_blank" class="text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
          <span>🏛️ KTO 상세 ↗</span>
        </a>
        <a href="${stay.kakaoMapUrl}" target="_blank" class="text-[11px] font-bold text-slate-900 bg-amber-300 hover:bg-amber-400 px-2.5 py-1 rounded-lg flex items-center gap-1 ml-auto">
          <span>🗺️ 길찾기</span>
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

// 최초 로딩 시 기본 세팅
function loadInitialGourmetAndStays() {
  searchGourmetByKeyword("보령");
  loadMealPlanForRegion(currentRegionId, currentSelectedDays);
  loadStaysForRegion(currentRegionId);
}

// ==========================================================
// 8. 교통 트래픽 히트맵
// ==========================================================
async function loadInitialTraffic() {
  try {
    const res = await fetch('/api/traffic-predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationId: 'WEST_COAST_SEOCHON', direction: 'outbound' })
    });
    const data = await res.json();
    if (data.success) {
      renderTrafficHeatmap(data);
    }
  } catch (err) {
    console.error('Traffic error:', err);
  }
}

function renderTrafficHeatmap(data) {
  const bars = document.getElementById('mTrafficBars');
  if (!bars) return;
  bars.innerHTML = '';

  const maxMin = Math.max(...data.simulationTimeline.map(i => i.estimatedMinutes));

  data.simulationTimeline.forEach(item => {
    const col = document.createElement('div');
    col.className = 'flex-1 min-w-[28px] h-full flex flex-col justify-end items-center relative group cursor-pointer';
    col.title = `${item.timeLabel}: 예상 ${item.estimatedDurationText} (${item.status})`;

    const heightPct = Math.max(Math.round((item.estimatedMinutes / maxMin) * 100), 25);

    col.innerHTML = `
      <div class="w-full rounded-t-sm transition-all" style="height: ${heightPct}%; background-color: ${item.statusColor};"></div>
      <span class="text-[9px] font-bold text-slate-400 mt-1">${item.hour}시</span>
    `;
    bars.appendChild(col);
  });

  const detourText = document.getElementById('mDetourText');
  if (detourText) detourText.innerText = data.detourRoute;
}

// ==========================================================
// 9. 한국관광공사 AI Q&A
// ==========================================================
function setupQaEvents() {
  const form = document.getElementById('mQaForm');
  const input = document.getElementById('mQaInput');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) runQa(q);
  });

  document.querySelectorAll('.qa-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.innerText.trim();
      runQa(btn.innerText.trim());
    });
  });
}

async function runQa(question) {
  const container = document.getElementById('mQaResults');
  const submitBtn = document.getElementById('mQaSubmitBtn');

  submitBtn.disabled = true;
  submitBtn.innerText = '탐색중...';

  container.innerHTML = `
    <div class="p-6 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
      <span class="material-symbols-outlined text-teal-700 animate-spin text-[24px]">progress_activity</span>
      <span>한국관광공사 대한민국 구석구석 공식 데이터를 우선 탐색 중입니다...</span>
    </div>
  `;

  try {
    const res = await fetch('/api/chat-visitkorea', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    if (data.success) {
      renderQaResult(data);
    }
  } catch (err) {
    console.error('QA error:', err);
    container.innerHTML = `<div class="p-4 text-xs text-red-600 bg-red-50 rounded-xl">조회 중 오류가 발생했습니다.</div>`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = '질문';
  }
}

function renderQaResult(data) {
  const container = document.getElementById('mQaResults');

  let spotsHtml = '';
  if (data.recommendedSpots && data.recommendedSpots.length > 0) {
    spotsHtml = data.recommendedSpots.map(s => `
      <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black text-slate-900">${s.name}</span>
          <span class="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">${s.category}</span>
        </div>
        <p class="text-xs text-slate-600 leading-snug">${s.desc}</p>
        <div class="flex items-center justify-between pt-1 mt-1 border-t border-slate-200">
          <span class="text-[10px] text-amber-800 font-bold">💡 ${s.holidayNote}</span>
          <a href="${s.officialUrl}" target="_blank" class="text-[10px] font-extrabold text-teal-700 hover:underline">공식 상세정보 ↗</a>
        </div>
      </div>
    `).join('');
  }

  container.innerHTML = `
    <div class="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-3">
      <div class="flex items-center gap-1.5 text-xs font-extrabold text-teal-800">
        <span class="material-symbols-outlined text-[16px]">verified</span>
        <span>한국관광공사 공인 추천 결과</span>
      </div>
      <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line">${data.answer}</p>
      ${spotsHtml ? `<div class="flex flex-col gap-2 mt-1">${spotsHtml}</div>` : ''}
    </div>
  `;
}

// ==========================================================
// 10. 카카오톡 공유 복사
// ==========================================================
function copyToClipboard() {
  if (!currentTripData) return;
  const d = currentTripData;
  let text = `[TripFlow Korea] 🏡 대전 출발 3일 연휴 스마트 여행 & 7~9끼 식도락 가이드\n`;
  text += `📍 목적지: ${d.region.name}\n`;
  text += `👥 동행: ${d.meta.companion} | ⏱️ 일정: ${d.meta.days}일 연휴\n`;
  text += `🟢 경로 특성: 상행선 정체 회피 (수평/남쪽 쾌속)\n\n`;

  if (d.trafficSimulation && d.trafficSimulation.goldenTime) {
    text += `🌟 추천 골든타임: ${d.trafficSimulation.goldenTime.bestTimeLabel}\n`;
    text += `⏱️ 절약 시간: 약 ${d.trafficSimulation.goldenTime.savedTimeText}\n\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📅 3일 추천 일정 (발자취 기억 연동)\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  d.itinerary.forEach(day => {
    text += `[Day ${day.day}] ${day.title}\n`;
    text += `• 오전: ${day.morning.spot}\n`;
    text += `• 점심: ${day.lunch.spot}\n`;
    text += `• 오후: ${day.afternoon.spot}\n`;
    text += `• 숙소: ${day.night.spot}\n\n`;
  });

  if (currentMealPlanData && currentMealPlanData.mealPlan) {
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🍚 한국관광공사 공인 7~9끼 식도락 로드맵\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    currentMealPlanData.mealPlan.forEach(m => {
      text += `[${m.meal}] ${m.restaurant.name} (${m.restaurant.region})\n`;
      text += `• 대표메뉴: ${m.restaurant.signatureMenu}\n`;
      text += `• 추석연휴: ${m.restaurant.holidayOpenTip}\n`;
      text += `• 연락처: ${m.restaurant.phone}\n\n`;
    });
  }

  text += `\n※ TripFlow Korea 대시보드에서 실시간 길안내와 숙박·식사를 확인하세요!`;

  navigator.clipboard.writeText(text).then(() => {
    alert('📋 3일 일정과 한국관광공사 공인 7~9끼 식당 로드맵이 복사되었습니다!\n카카오톡에 붙여넣기(Ctrl+V)하세요.');
  }).catch(() => {
    alert('복사에 실패했습니다.');
  });
}
