// public/app.js
// MyTrip Copilot - 트래픽 골든타임 & 한국관광공사 연동 클라이언트 스크립트

let currentPlanData = null;

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  loadPresets();
  setupPlannerEventListeners();
  setupTrafficEventListeners();
  setupQaEventListeners();
});

// 1. 네비게이션 탭 전환 (3개 탭: 플래너, 트래픽, Q&A)
function setupTabs() {
  const tabPlannerBtn = document.getElementById('tabPlannerBtn');
  const tabTrafficBtn = document.getElementById('tabTrafficBtn');
  const tabQaBtn = document.getElementById('tabQaBtn');

  const plannerView = document.getElementById('plannerView');
  const trafficView = document.getElementById('trafficView');
  const qaView = document.getElementById('qaView');

  function resetActive() {
    tabPlannerBtn.classList.remove('active');
    tabTrafficBtn.classList.remove('active');
    tabQaBtn.classList.remove('active');
    plannerView.style.display = 'none';
    trafficView.style.display = 'none';
    qaView.style.display = 'none';
  }

  tabPlannerBtn.addEventListener('click', () => {
    resetActive();
    tabPlannerBtn.classList.add('active');
    plannerView.style.display = 'grid';
  });

  tabTrafficBtn.addEventListener('click', () => {
    resetActive();
    tabTrafficBtn.classList.add('active');
    trafficView.style.display = 'block';
    // 탭 열릴 때 기본 시뮬레이션 1회 자동 실행
    runTrafficSimulation();
  });

  tabQaBtn.addEventListener('click', () => {
    resetActive();
    tabQaBtn.classList.add('active');
    qaView.style.display = 'block';
  });
}

// 2. 추천 프리셋 목록 로드
async function loadPresets() {
  const container = document.getElementById('presetsContainer');
  try {
    const res = await fetch('/api/presets');
    const data = await res.json();
    if (data.success && data.presets) {
      container.innerHTML = '';
      data.presets.forEach(preset => {
        const card = document.createElement('div');
        card.className = 'preset-card';
        card.innerHTML = `
          <div class="preset-title-row">
            <span class="preset-title">${preset.title}</span>
            <span class="preset-tag">${preset.tag}</span>
          </div>
          <div class="preset-subtitle">${preset.subtitle}</div>
        `;
        card.addEventListener('click', () => {
          applyPresetAndSubmit(preset.params);
        });
        container.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Preset load error:', err);
    container.innerHTML = '<div style="color:red;font-size:0.85rem;">추천 목록을 불러올 수 없습니다.</div>';
  }
}

// 프리셋 선택 시 폼에 적용 후 즉시 플랜 생성
function applyPresetAndSubmit(params) {
  if (params.season) document.getElementById('seasonSelect').value = params.season;
  if (params.days) document.getElementById('daysSelect').value = params.days;
  if (params.startLocation) document.getElementById('startLocation').value = params.startLocation;
  if (params.transport) document.getElementById('transport').value = params.transport;
  if (params.customRequest) document.getElementById('customRequest').value = params.customRequest;

  if (params.companion) {
    const compRadio = document.querySelector(`input[name="companion"][value="${params.companion}"]`);
    if (compRadio) compRadio.checked = true;
  }

  if (params.pace) {
    const paceRadio = document.querySelector(`input[name="pace"][value="${params.pace}"]`);
    if (paceRadio) paceRadio.checked = true;
  }

  if (params.themes && Array.isArray(params.themes)) {
    const checkboxes = document.querySelectorAll('input[name="theme"]');
    checkboxes.forEach(cb => {
      cb.checked = params.themes.includes(cb.value);
    });
  }

  document.getElementById('tabPlannerBtn').click();
  generatePlanFromForm();
}

// 3. 플래너 이벤트 리스너 등록
function setupPlannerEventListeners() {
  const form = document.getElementById('tripForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generatePlanFromForm();
  });

  document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
  });

  document.getElementById('copyShareBtn').addEventListener('click', () => {
    copyPlanToClipboard();
  });

  document.getElementById('saveBookmarkBtn').addEventListener('click', () => {
    saveBookmark();
  });
}

// 4. 폼 데이터를 모아 API 호출
async function generatePlanFromForm() {
  const btn = document.getElementById('generateBtn');
  const originalBtnText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span>🔄 트래픽 예측 & 관광공사 데이터 분석 중...</span>';

  const season = document.getElementById('seasonSelect').value;
  const days = parseInt(document.getElementById('daysSelect').value, 10);
  const startLocation = document.getElementById('startLocation').value;
  const transport = document.getElementById('transport').value;
  const customRequest = document.getElementById('customRequest').value.trim();

  const companion = document.querySelector('input[name="companion"]:checked')?.value || '가족';
  const pace = document.querySelector('input[name="pace"]:checked')?.value || 'relaxed';

  const themeCheckboxes = document.querySelectorAll('input[name="themeChecked"], input[name="theme"]:checked');
  const themes = Array.from(themeCheckboxes).map(cb => cb.value);

  const payload = {
    season,
    days,
    startLocation,
    transport,
    companion,
    pace,
    themes,
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
      currentPlanData = data;
      renderPlan(data);
    } else {
      alert('일정을 생성하지 못했습니다: ' + (data.message || '다시 시도해 주세요.'));
    }
  } catch (err) {
    console.error('Plan generation failed:', err);
    alert('서버와 통신 중 오류가 발생했습니다.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalBtnText;
  }
}

// 5. 결과 렌더링
function renderPlan(data) {
  document.getElementById('emptyState').style.display = 'none';
  const container = document.getElementById('resultContainer');
  container.style.display = 'block';

  // 트래픽 골든타임 히어로 박스 렌더링
  if (data.trafficSimulation && data.trafficSimulation.goldenTime) {
    const gt = data.trafficSimulation.goldenTime;
    document.getElementById('savedTimeBadge').innerText = `⏱️ 피크 대비 약 ${gt.savedTimeText} 절약 가능`;
    document.getElementById('trafficHeroTitle').innerText = `🌟 추천 출발 시간: ${gt.bestTimeLabel} (예상 ${gt.bestEstimatedText})`;
    document.getElementById('trafficHeroDesc').innerText = `연휴 첫날 피크 정체(${gt.worstTimeLabel}, 예상 ${gt.worstEstimatedText}) 대비 약 ${gt.savedTimeText}을 도로 위에서 절약할 수 있습니다.`;

    const detourInfo = document.getElementById('trafficRoutesInfo');
    detourInfo.innerHTML = `
      <strong>🛣️ 주요 고속도로:</strong> ${data.trafficSimulation.highways.join(', ')}<br>
      <strong>💡 추천 우회로:</strong> ${data.trafficSimulation.detourRoute} (${data.trafficSimulation.detourSavingTip})
    `;
    document.getElementById('trafficHeroCard').style.display = 'block';
  } else {
    document.getElementById('trafficHeroCard').style.display = 'none';
  }

  // 상단 요약
  document.getElementById('summaryBadge').innerText = `${data.meta.season} • ${data.meta.days}일 연휴 • ${data.meta.companion} 동행`;
  document.getElementById('destinationTitle').innerText = data.region.name;
  document.getElementById('destinationVibe').innerText = `✨ 분위기: ${data.region.vibe}`;
  document.getElementById('agentSummaryText').innerText = data.agentSummary;
  document.getElementById('holidayTipText').innerText = data.region.holidayTip;

  // 타임라인 일차별 렌더링
  const timelineSection = document.getElementById('timelineSection');
  timelineSection.innerHTML = '';

  data.itinerary.forEach(dayItem => {
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';
    dayCard.innerHTML = `
      <div class="day-header">
        <div class="day-title-group">
          <span class="day-badge">${dayItem.day}일차</span>
          <h3 class="day-title">${dayItem.title}</h3>
        </div>
        <div class="companion-advice-badge">
          ${dayItem.companionNote || ''}
        </div>
      </div>
      <div class="day-schedule">
        <!-- 오전 -->
        <div class="schedule-item">
          <div class="time-slot slot-morning">🌅 오전</div>
          <div>
            <div class="spot-name-area">
              <span class="spot-name">${dayItem.morning.spot}</span>
              <span class="spot-cert-tag">🏛️ 한국관광공사 공인</span>
            </div>
            <div class="spot-desc">${dayItem.morning.desc}</div>
          </div>
          <div class="btn-actions-group">
            <a href="${dayItem.morning.visitKoreaUrl}" target="_blank" class="btn-visitkorea" title="한국관광공사 공식 홈페이지에서 상세 정보 확인">🏛️ 관광공사 정보</a>
            <a href="${dayItem.morning.mapUrl}" target="_blank" class="btn-map">🗺️ 카카오맵</a>
          </div>
        </div>

        <!-- 점심 -->
        <div class="schedule-item">
          <div class="time-slot slot-lunch">🍚 점심 맛집</div>
          <div>
            <div class="spot-name-area">
              <span class="spot-name">${dayItem.lunch.spot}</span>
            </div>
            <div class="spot-desc">${dayItem.lunch.desc}</div>
          </div>
          <div class="btn-actions-group">
            <a href="${dayItem.lunch.mapUrl}" target="_blank" class="btn-map">🗺️ 카카오맵</a>
          </div>
        </div>

        <!-- 오후 -->
        <div class="schedule-item">
          <div class="time-slot slot-afternoon">🚗 오후 탐방</div>
          <div>
            <div class="spot-name-area">
              <span class="spot-name">${dayItem.afternoon.spot}</span>
              <span class="spot-cert-tag">🏛️ 한국관광공사 공인</span>
            </div>
            <div class="spot-desc">${dayItem.afternoon.desc}</div>
          </div>
          <div class="btn-actions-group">
            <a href="${dayItem.afternoon.visitKoreaUrl}" target="_blank" class="btn-visitkorea" title="한국관광공사 공식 홈페이지에서 상세 정보 확인">🏛️ 관광공사 정보</a>
            <a href="${dayItem.afternoon.mapUrl}" target="_blank" class="btn-map">🗺️ 카카오맵</a>
          </div>
        </div>

        <!-- 카페/티타임 -->
        <div class="schedule-item">
          <div class="time-slot slot-cafe">☕ 카페·뷰</div>
          <div>
            <div class="spot-name-area">
              <span class="spot-name">${dayItem.cafe.spot}</span>
            </div>
            <div class="spot-desc">${dayItem.cafe.desc}</div>
          </div>
          <div class="btn-actions-group">
            <a href="${dayItem.cafe.mapUrl}" target="_blank" class="btn-map">🗺️ 카카오맵</a>
          </div>
        </div>

        <!-- 저녁 -->
        <div class="schedule-item">
          <div class="time-slot slot-dinner">🍲 저녁 만찬</div>
          <div>
            <div class="spot-name-area">
              <span class="spot-name">${dayItem.dinner.spot}</span>
            </div>
            <div class="spot-desc">${dayItem.dinner.desc}</div>
          </div>
          <div class="btn-actions-group">
            <a href="${dayItem.dinner.mapUrl}" target="_blank" class="btn-map">🗺️ 카카오맵</a>
          </div>
        </div>

        <!-- 야경 & 숙소 -->
        <div class="schedule-item">
          <div class="time-slot slot-night">🌙 야경 & 숙소</div>
          <div>
            <div class="spot-name-area">
              <span class="spot-name">${dayItem.night.spot}</span>
            </div>
            <div class="spot-desc">${dayItem.night.desc}</div>
          </div>
          <span class="stay-info">🏡 권장 숙소: ${dayItem.night.stayArea}</span>
        </div>
      </div>
    `;
    timelineSection.appendChild(dayCard);
  });

  // 준비물 체크리스트
  const packingUl = document.getElementById('packingListUl');
  packingUl.innerHTML = '';
  data.packingList.forEach(item => {
    const li = document.createElement('li');
    li.innerText = item;
    packingUl.appendChild(li);
  });

  // 교통 가이드
  document.getElementById('peakHoursText').innerText = data.trafficAdvice.peakHours;
  document.getElementById('trafficStrategyText').innerText = data.trafficAdvice.strategy;
  document.getElementById('tollTipText').innerText = data.trafficAdvice.tollTip;

  document.getElementById('resultPanel').scrollIntoView({ behavior: 'smooth' });
}

// 6. 카카오톡 공유용 텍스트 복사
function copyPlanToClipboard() {
  if (!currentPlanData) return;

  const d = currentPlanData;
  let text = `[MyTrip Copilot] ${d.meta.season} 추석 연휴 여행 코스\n`;
  text += `🚦 도로 정체 회피 & 한국관광공사 공인 데이터 연동\n`;
  text += `📍 목적지: ${d.region.name}\n`;
  text += `👥 동행: ${d.meta.companion} | ⏱️ 일정: ${d.meta.days}일 코스\n`;

  if (d.trafficSimulation && d.trafficSimulation.goldenTime) {
    const gt = d.trafficSimulation.goldenTime;
    text += `🌟 추천 출발 골든타임: ${gt.bestTimeLabel} (피크 대비 ${gt.savedTimeText} 절약)\n`;
  }
  text += `💡 특징: ${d.region.vibe}\n\n`;

  d.itinerary.forEach(day => {
    text += `=========================\n`;
    text += `📅 [Day ${day.day}] ${day.title}\n`;
    text += `• 오전: ${day.morning.spot}\n`;
    text += `• 점심: ${day.lunch.spot}\n`;
    text += `• 오후: ${day.afternoon.spot}\n`;
    text += `• 카페: ${day.cafe.spot}\n`;
    text += `• 저녁: ${day.dinner.spot}\n`;
    text += `• 야경/숙박: ${day.night.spot} (${day.night.stayArea})\n\n`;
  });

  text += `🚗 명절 교통 팁: ${d.trafficAdvice.peakHours}\n`;
  text += `🎒 추천 준비물: ${d.packingList.slice(0, 4).join(', ')} 등\n`;

  navigator.clipboard.writeText(text).then(() => {
    alert('📋 일정이 텍스트로 클립보드에 복사되었습니다!\n카카오톡이나 메모장에 붙여넣기(Ctrl+V)하세요.');
  }).catch(err => {
    console.error('Copy failed:', err);
    alert('클립보드 복사에 실패했습니다.');
  });
}

// 7. 브라우저 로컬 저장
function saveBookmark() {
  if (!currentPlanData) return;
  try {
    const saved = JSON.parse(localStorage.getItem('my_trip_plans') || '[]');
    saved.unshift({
      date: new Date().toLocaleDateString(),
      plan: currentPlanData
    });
    localStorage.setItem('my_trip_plans', JSON.stringify(saved.slice(0, 10)));
    alert('⭐ 이 일정이 내 브라우저에 안전하게 보관되었습니다!');
  } catch (e) {
    console.error(e);
  }
}

// 8. 트래픽 시뮬레이터 이벤트 리스너 & 렌더링
function setupTrafficEventListeners() {
  const simBtn = document.getElementById('trafficSimulateBtn');
  simBtn.addEventListener('click', () => {
    runTrafficSimulation();
  });
}

async function runTrafficSimulation() {
  const destSelect = document.getElementById('trafficDestSelect');
  const destinationId = destSelect.value;
  const direction = document.querySelector('input[name="trafficDirection"]:checked')?.value || 'outbound';

  const simBtn = document.getElementById('trafficSimulateBtn');
  simBtn.disabled = true;
  simBtn.innerHTML = '<span>계산 중...</span>';

  try {
    const res = await fetch('/api/traffic-predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationId, direction })
    });

    const data = await res.json();
    if (data.success) {
      renderTrafficSimulation(data);
    }
  } catch (err) {
    console.error('Traffic simulation error:', err);
  } finally {
    simBtn.disabled = false;
    simBtn.innerHTML = '<span>정체 시뮬레이션 계산</span><span>⚡</span>';
  }
}

function renderTrafficSimulation(data) {
  const gt = data.goldenTime;

  // 대형 골든타임 카드
  document.getElementById('goldenBestHour').innerText = gt.bestTimeLabel;
  document.getElementById('goldenBestDuration').innerText = `예상 소요시간: 약 ${gt.bestEstimatedText}`;
  document.getElementById('goldenSaveText').innerText = `⏱️ 피크 시간 대비 약 ${gt.savedTimeText} 절약!`;

  document.getElementById('goldenWorstHour').innerText = gt.worstTimeLabel;
  document.getElementById('goldenWorstDuration').innerText = `예상 소요시간: 약 ${gt.worstEstimatedText} (도로 정체 극심)`;

  // 주요 고속도로 태그
  const hwBox = document.getElementById('highwayTagsBox');
  hwBox.innerHTML = '';
  data.highways.forEach(hw => {
    const span = document.createElement('span');
    span.className = 'highway-tag';
    span.innerText = hw;
    hwBox.appendChild(span);
  });

  // 24H 타임라인 막대 차트
  const barsContainer = document.getElementById('trafficBarsContainer');
  barsContainer.innerHTML = '';

  const maxMin = Math.max(...data.simulationTimeline.map(item => item.estimatedMinutes));

  data.simulationTimeline.forEach(item => {
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.title = `출발: ${item.timeLabel} | 소요: ${item.estimatedDurationText} (${item.status})`;

    // 높이 백분율 계산 (최대 높이의 30%~100% 사이)
    const heightPercent = Math.max(Math.round((item.estimatedMinutes / maxMin) * 100), 25);

    col.innerHTML = `
      <span class="bar-min-label" style="color:${item.statusColor}">${item.estimatedDurationText}</span>
      <div class="bar-fill" style="height:${heightPercent}%; background-color:${item.statusColor};"></div>
      <span class="bar-time">${item.timeLabel}</span>
    `;

    barsContainer.appendChild(col);
  });

  // 우회로 카드
  document.getElementById('detourRouteText').innerText = data.detourRoute;
  document.getElementById('detourTipText').innerText = `💡 ${data.detourSavingTip}`;
}

// 9. 한국관광공사 AI Q&A 이벤트 및 렌더링
function setupQaEventListeners() {
  const qaForm = document.getElementById('qaForm');
  const qaInput = document.getElementById('qaQuestionInput');
  const quickBtns = document.querySelectorAll('.qa-chip-btn');

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      qaInput.value = btn.innerText;
      submitQaQuestion(btn.innerText);
    });
  });

  qaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = qaInput.value.trim();
    if (q) submitQaQuestion(q);
  });
}

async function submitQaQuestion(question) {
  const submitBtn = document.getElementById('qaSubmitBtn');
  const container = document.getElementById('qaResultsContainer');

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>한국관광공사 탐색 중...</span>';

  container.innerHTML = `
    <div class="qa-placeholder">
      <span class="qa-placeholder-icon">🏛️</span>
      <p>한국관광공사 공식 홈페이지(<strong>korean.visitkorea.or.kr</strong>)의 최신 관광 데이터를 탐색 및 분석하고 있습니다...</p>
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
    } else {
      container.innerHTML = `<div class="qa-placeholder" style="color:red;">답변을 불러오지 못했습니다.</div>`;
    }
  } catch (err) {
    console.error('QA Error:', err);
    container.innerHTML = `<div class="qa-placeholder" style="color:red;">통신 오류가 발생했습니다.</div>`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>질문하기</span><span>🔍</span>';
  }
}

function renderQaResult(data) {
  const container = document.getElementById('qaResultsContainer');

  let spotsHtml = '';
  if (data.recommendedSpots && data.recommendedSpots.length > 0) {
    spotsHtml = `
      <div class="qa-spots-grid">
        ${data.recommendedSpots.map(s => `
          <div class="qa-spot-item">
            <div>
              <div class="qa-spot-item-header">
                <span class="qa-spot-item-title">${s.name}</span>
                <span class="qa-spot-item-cat">${s.category}</span>
              </div>
              <p class="qa-spot-item-desc">${s.desc}</p>
              <p style="font-size:0.8rem;color:#0f766e;margin-bottom:8px;">💡 <strong>명절 팁:</strong> ${s.holidayNote}</p>
            </div>
            <div class="qa-spot-item-footer">
              <span style="font-size:0.75rem;color:#64748b;">${s.region} 권역</span>
              <a href="${s.officialUrl}" target="_blank" class="btn-visitkorea">🏛️ 대한민국 구석구석 공식 정보</a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="qa-response-card">
      <div class="qa-source-badge">
        🏛️ 한국관광공사 대한민국 구석구석 (korean.visitkorea.or.kr) 우선 참조 답변
      </div>
      <div class="qa-answer-content">
        ${data.answer.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:#0f766e;font-weight:bold;">$1 ↗</a>')}
      </div>
      <div style="margin-top:20px;">
        <h4 style="font-size:1rem;color:#0f172a;margin-bottom:12px;">📌 한국관광공사 공인 추천 명소 카드</h4>
        ${spotsHtml}
      </div>
    </div>
  `;
}
