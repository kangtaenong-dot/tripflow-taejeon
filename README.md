# 🚗 TripFlow Korea (대한민국 교통·식도락·숙박 올인원 AI 컨시어지)

> **No-Traffic Concierge & KTO Certified Gourmet/Stays**  
> 대전 출발 특화 정체 회피 동선, 한국관광공사(KTO) 빅데이터 기반 7~9끼 로컬 미식 로드맵, 한국관광 품질인증(KQ) 안심 숙소·한옥스테이를 스마트폰 모바일 반응형으로 제공하는 지능형 여행 에이전트입니다.

---

## 🌟 핵심 특징 & 기능

1. **🚦 교통 골든타임 & 실시간 우회 시뮬레이션**
   - 대전 출발 기준 수평(보령/서천/군산) 및 남쪽(전주/담양/순천/여수, 대구/경주/포항) 우선 경로 추천
   - 시간대별 고속도로 정체 위험도(LOW/MODERATE/HIGH) 시뮬레이션 및 출발 골든타임 제시 (최대 35% 시간 단축)

2. **🍲 경로보다 100배 중요한 7~9끼 KTO 공인 식도락 로드맵**
   - 여행 기간(당일 2~3끼, 1박2일 4~5끼, 2박3일 7~9끼, 3박4일 10~12끼)에 맞춘 끼니별(아침/점심/저녁) 공인 맛집 자동 배정
   - 한국관광공사(VisitKorea) 및 중소벤처기업부 인증 **백년가게**, 안심식당 매핑
   - 내 위치/경유지 기준 실시간 KTO 공인 식당 검색 및 전화/카카오맵 원클릭 연동

3. **🏡 한국관광 품질인증(KQ) & 한옥스테이 숙박 큐레이션**
   - 1박 2일 이상 일정 시 권역별 한국관광공사 공인 KQ 안심 숙소 및 감성 한옥스테이 자동 추천

4. **📍 누적 경로 체이닝 (Journey Memory Tracker)**
   - 1일차 도착/숙박지를 자동으로 기억하여 2일차 및 3일차 경로를 출발지(대전)가 아닌 직전 숙박지에서 연속하여 이어가는 현실적 로드맵 보장

5. **📱 Stitch Mobile-First 반응형 UI/UX**
   - 상단 헤더: 대전 출발 인디케이터, 테마/시즌 모달(추석/단풍/봄꽃/여름바다), 원형 커스텀 프로필 아바타
   - 메인 대시보드: 교통안내 카드와 숙박·식사 안내 카드의 2대 허브 분기 및 원클릭 복귀
   - 여행 기간 탭: [당일치기], [1박 2일], [2박 3일], [3박 4일] 즉시 전환 세그먼트

---

## 🚀 Render 무료 배포 가이드 (GitHub + Render.com)

Render(https://render.com)는 Node.js 웹 애플리케이션을 무료로 호스팅할 수 있는 글로벌 클라우드 플랫폼입니다.

### [방법 A] Render Blueprint 1-클릭 배포 (가장 추천)
본 저장소에는 `render.yaml` 설정 파일이 이미 포함되어 있어 별도 설정 없이 바로 배포됩니다.

1. **GitHub에 저장소(Repository) 생성 후 코드 푸시**:
   ```bash
   git init
   git add .
   git commit -m "feat: TripFlow Korea initial release"
   git branch -M main
   git remote add origin https://github.com/{본인-깃허브-아이디}/{저장소-이름}.git
   git push -u origin main
   ```
2. **Render(https://render.com) 로그인** (GitHub 계정으로 간편 가입).
3. 상단 **[New +]** 버튼 클릭 ➡️ **[Blueprint]** 선택.
4. 방금 푸시한 GitHub 저장소를 선택(Connect)합니다.
5. Render가 프로젝트 내 `render.yaml`을 자동 감지합니다. **[Apply]** 버튼을 누르면 빌드 및 배포가 자동으로 시작됩니다!
6. 배포 완료 후 `https://tripflow-korea.onrender.com` 형태의 영구 공개 HTTPS 주소가 발급됩니다.

---

### [방법 B] Render Web Service 직접 생성 (수동 방식)
1. Render 대시보드에서 **[New +]** ➡️ **[Web Service]** 클릭.
2. 본인의 GitHub 저장소 연결 (`Connect`).
3. 배포 설정 입력:
   * **Name**: `tripflow-korea` (원하는 이름)
   * **Region**: `Singapore (Southeast Asia)` (한국에서 가장 빠른 응답속도)
   * **Branch**: `main`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
   * **Instance Type**: `Free` ($0/month)
4. 환경 변수 (Environment Variables):
   * `NODE_ENV` = `production`
   * `PORT` = `10000` (Render 내부 기본 포트)
5. **[Create Web Service]** 클릭 ➡️ 1~2분 내 배포 완료!

> 💡 **Render 무료 플랜 팁 (슬립 방지)**:  
> Render Free 웹 서비스는 15분 동안 방문자가 없으면 인스턴스가 대기 상태(Sleep)로 들어가며, 다음 요청 시 30~50초의 콜드 스타트가 발생할 수 있습니다. 상시 깨워두려면 [UptimeRobot](https://uptimerobot.com) 같은 무료 모니터링 서비스에 배포된 URL의 `/api/status` 경로를 5~10분 주기로 등록해두면 항상 즉시 응답합니다.

---

## 💻 로컬 PC 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 로컬 서버 실행
node server.js

# 3. 브라우저 접속
# http://localhost:3000
```

---

## 📁 프로젝트 구조

```
OAAG_006(0916)_여행에이전트/
├── public/                 # 프론트엔드 정적 파일
│   ├── index.html          # Stitch TripFlow Korea 반응형 메인 UI
│   ├── app_stitch.js       # 양방향 내비게이션, 경로 체이닝, API 연동
│   ├── app.js              # 레거시 백업 스크립트
│   └── images/             # 프로필 아바타 등 이미지 리소스
├── services/               # 백엔드 핵심 비즈니스 로직
│   ├── agentEngine.js      # 대전 출발 특화 & 다일정 경로 체이닝 엔진
│   ├── gourmetService.js   # KTO 7~9끼 식도락 로드맵 & 백년가게 검색
│   ├── stayService.js      # 한국관광 품질인증(KQ) 및 한옥스테이 매핑
│   ├── trafficEngine.js    # 도로공사/관광공사 연계 정체 골든타임 예측
│   └── visitKoreaService.js# 대한민국 구석구석 Q&A 엔진
├── render.yaml             # Render Blueprint 1-클릭 클라우드 배포 명세서
├── package.json            # Node.js 패키지 의존성 및 실행 스크립트
├── .gitignore              # Git 형상관리 제외 설정 (node_modules, logs 등)
├── server.js               # Express API 서버 (포트 3000 / 클라우드 PORT 동적 매핑)
└── README.md               # 프로젝트 매뉴얼 및 배포 가이드
```

---

## 📜 라이선스
MIT License
