import type { Project } from './data'
import GitHubIcon from './GitHubIcon'

function GroupeatDetail({ project }: { project: Project }) {
  return (
    <div className="detail-page">
      <header className="detail-nav"><a href="#/">← cd ~/portfolio</a><span>projects/groupeat</span></header>
      <main>
        <section className="detail-hero groupeat-hero">
          <p><span>guest@dwook</span>:~/projects/groupeat$ cat case-study.md</p>
          <div className="detail-heading"><span>[01]</span><div><small>TEAM / BACKEND · 2026</small><h1>Groupeat</h1></div></div>
          <p className="detail-summary">단체 주문에서 결제, 점주 승인, 픽업과 정산까지 이어지는 흐름을 상태 중심으로 설계한 주문 플랫폼입니다.</p>
          <div className="detail-stack">{project.stack.map(item => <span key={item}>{item}</span>)}</div>
        </section>

        <section className="case-overview">
          <div><p className="case-label">MY FOCUS</p><h2>흐름이 끊기지 않는<br />주문 시스템 만들기</h2></div>
          <div className="case-overview-copy"><p>주문 서비스의 어려움은 API 개수가 아니라, <strong>서로 다른 상태가 정확한 순서로 함께 움직여야 한다는 점</strong>에 있었습니다. 결제 승인과 취소는 외부 시스템에서 일어나고, 내부에는 주문·결제·정산 상태가 남습니다.</p><p>저는 기능을 각각 구현하기보다 상태 전이의 허용 조건과 외부 결제 결과를 내부 데이터에 반영하는 경계를 중심으로 설계했습니다.</p></div>
        </section>

        <nav className="case-index" aria-label="Groupeat 상세 목차">
          <a href="#/projects/groupeat" onClick={e => { e.preventDefault(); document.querySelector('#order-flow')?.scrollIntoView({ behavior: 'smooth' }) }}><span>01</span> 주문 상태 전이</a>
          <a href="#/projects/groupeat" onClick={e => { e.preventDefault(); document.querySelector('#toss-payment')?.scrollIntoView({ behavior: 'smooth' }) }}><span>02</span> 토스페이먼츠 연동</a>
          <a href="#/projects/groupeat" onClick={e => { e.preventDefault(); document.querySelector('#auth-flow')?.scrollIntoView({ behavior: 'smooth' }) }}><span>03</span> 로그인과 회원가입</a>
        </nav>

        <section className="case-chapter" id="order-flow">
          <header><p><span>01</span> ORDER STATE TRANSITION</p><h2>상태가 곧<br />비즈니스 규칙이 되도록</h2></header>
          <div className="state-flow" aria-label="주문 상태 흐름">
            <div><small>주문 생성</small><strong>PENDING</strong></div><i>→</i><div><small>결제 승인</small><strong>PAID</strong></div><i>→</i><div><small>점주 승인</small><strong>ACCEPTED</strong></div><i>→</i><div><small>픽업 완료</small><strong>COMPLETED</strong></div>
            <span className="reject-path">PAID → REJECTED · 결제 취소 동반</span>
          </div>
          <div className="decision-grid">
            <article><p className="case-label">CONCERN</p><h3>모든 요청이 상태를 바꿀 수는 없다</h3><p>점주의 승인과 거절은 결제가 완료된 <code>PAID</code> 주문에만, 픽업 완료는 <code>ACCEPTED</code> 주문에만 허용했습니다. 컨트롤러의 호출 순서에 기대지 않고 서비스가 현재 상태를 직접 검증합니다.</p></article>
            <article><p className="case-label">DECISION</p><h3>상태 변경과 후속 작업을 한 경계에</h3><p>픽업 완료 시 주문을 <code>COMPLETED</code>로 바꾸고 정산을 생성합니다. 선결제는 점주 지급, 현장결제는 수수료 청구로 구분하며, 주문별 정산 존재 여부를 확인해 중복 생성을 방지했습니다.</p></article>
          </div>
          <div className="code-note"><span>IMPLEMENTATION NOTE</span><code>PAID → accept() / reject()<br />ACCEPTED → completePickup() + createSettlementIfAbsent()</code></div>
        </section>

        <section className="case-chapter" id="toss-payment">
          <header><p><span>02</span> TOSS PAYMENTS</p><h2>외부 결제와 내부 상태 사이의<br />불확실성 줄이기</h2></header>
          <div className="payment-sequence">
            <div><span>01</span><strong>PREPARE</strong><p>사용자·금액·현재 상태 검증</p></div><b>→</b><div><span>02</span><strong>REQUEST</strong><p>토스 결제 승인 API 호출</p></div><b>→</b><div><span>03</span><strong>VERIFY</strong><p>상태·주문번호·금액 대조</p></div><b>→</b><div><span>04</span><strong>COMMIT</strong><p>Payment DONE, Order PAID</p></div>
          </div>
          <div className="decision-grid three">
            <article><p className="case-label">TRANSACTION</p><h3>외부 API 호출과 DB 트랜잭션 분리</h3><p>승인 전 검증과 승인 결과 저장을 각각 짧은 트랜잭션으로 분리했습니다. 네트워크 응답을 기다리는 동안 DB 트랜잭션을 오래 유지하지 않도록 외부 호출은 그 사이에서 수행합니다.</p></article>
            <article><p className="case-label">VALIDATION</p><h3>클라이언트 값을 그대로 신뢰하지 않기</h3><p>로그인 사용자와 결제 소유자, 요청 금액과 서버 저장 금액을 먼저 비교합니다. 토스 응답도 <code>DONE</code> 상태인지, 주문번호와 최종 금액이 일치하는지 다시 검증합니다.</p></article>
            <article><p className="case-label">IDEMPOTENCY</p><h3>중복 승인 요청을 구분해서 처리</h3><p>이미 완료된 결제에 같은 <code>paymentKey</code>가 들어오면 저장된 응답을 반환하고, 다른 키라면 비정상 요청으로 거절합니다. 결제 준비 단계에서는 상태를 <code>IN_PROGRESS</code>로 전환합니다.</p></article>
          </div>
        </section>

        <section className="case-chapter" id="auth-flow">
          <header><p><span>03</span> AUTH &amp; SIGNUP</p><h2>로그인 성공 이후에도<br />회원의 상태는 다르다</h2></header>
          <div className="auth-router">
            <div className="provider"><small>OAUTH PROVIDER</small><span>KAKAO</span><span>GOOGLE</span><span>NAVER</span></div>
            <b>→</b>
            <div className="auth-branches"><div><strong>ACTIVE</strong><p>Access·Refresh Token 발급 후 사용자 유형별 화면으로 이동</p></div><div><strong>SIGNUP_IN_PROGRESS</strong><p>고객·사업자 유형에 맞는 다음 가입 단계로 복귀</p></div><div><strong>NEW USER</strong><p>소셜 정보를 담은 단기 Signup Token으로 가입 시작</p></div></div>
          </div>
          <div className="decision-grid">
            <article><p className="case-label">FLOW DESIGN</p><h3>소셜 로그인과 서비스 가입을 분리</h3><p>OAuth 인증 성공을 곧바로 회원가입 완료로 간주하지 않았습니다. 공통 단계에서 휴대폰 인증과 필수 약관을 검증한 뒤 고객 또는 사업자 프로필을 입력하도록 구성했습니다. 가입 도중 이탈한 사용자는 <code>SIGNUP_IN_PROGRESS</code> 상태로 유지하고, 다시 로그인하면 회원 유형에 맞는 다음 가입 단계로 복귀시킵니다.</p></article>
            <article><p className="case-label">SECURITY</p><h3>용도가 다른 토큰을 분리</h3><p>가입 전에는 소셜 식별 정보를 담은 Signup Token을 사용하고, 활성 회원에게만 Access·Refresh Token을 발급합니다. 인증 토큰은 <code>HttpOnly</code> 쿠키로 전달하며 운영 환경에 맞춰 Secure·SameSite·Domain을 설정할 수 있게 구성했습니다.</p></article>
          </div>
        </section>

        <section className="case-retro"><p className="case-label">WHAT THIS PROJECT SHOWS</p><h2>단순히 결제 API를 붙이는 것이 아니라,<br /><span>실패할 수 있는 경계를 설계했습니다.</span></h2><div><p>주문·결제·정산이 어떤 조건에서 움직여야 하는지 코드로 제한하고, 외부 시스템의 응답을 내부 상태로 받아들이기 전에 다시 검증했습니다.</p><p>동시에 현재 구조로 완전히 해결하지 못한 분산 트랜잭션 구간을 숨기지 않고 후속 과제로 남겼습니다.</p></div></section>

        <section className="detail-end"><p>END OF CASE STUDY</p><h2>Continue exploring.</h2><div><a href="#/">← Main page</a><a className="github-link" href="https://github.com/CEOS-Groupeat/groupeat-backend" target="_blank" rel="noreferrer"><GitHubIcon /> GitHub Repository ↗</a></div></section>
      </main>
    </div>
  )
}

function SeCauseDetail({ project }: { project: Project }) {
  return (
    <div className="detail-page">
      <header className="detail-nav"><a href="#/">← cd ~/portfolio</a><span>projects/secause</span></header>
      <main>
        <section className="detail-hero secause-hero">
          <p><span>guest@dwook</span>:~/projects/secause$ cat case-study.md</p>
          <div className="detail-heading"><span>[02]</span><div><small>TEAM / BACKEND · 2026 · IN PROGRESS</small><h1>SeCause</h1></div></div>
          <p className="detail-summary">정적 분석과 LLM을 결합해 코드의 보안 취약점을 찾고, 보안 지식이 부족한 개발자도 이해할 수 있는 수정 가이드를 제공하는 서비스입니다.</p>
          <div className="detail-stack">{project.stack.map(item => <span key={item}>{item}</span>)}</div>
        </section>

        <section className="case-overview">
          <div><p className="case-label">MY ROLE</p><h2>비동기 분석 Job의<br />생성·실행·상태 관리</h2></div>
          <div className="case-overview-copy"><p>SeCause는 정적 분석과 LLM을 결합해 코드 취약점의 원인과 수정 방향을 설명하는 팀 프로젝트입니다.</p><p>저는 이 서비스에서 <strong>장시간 실행되는 코드 분석을 웹 요청과 분리하는 비동기 파이프라인</strong>을 담당합니다. GitHub OAuth와 JWT 인증 기반을 먼저 구현했고, 분석 서버와 API 서버 사이의 작업 상태·실패·결과 전달 경계를 설계하고 있습니다.</p></div>
        </section>

        <section className="case-chapter secause-pipeline" id="analysis-pipeline">
          <header><p><span>01</span> ASYNC ANALYSIS PIPELINE <small className="phase-tag">DESIGNED · IMPLEMENTATION NEXT</small></p><h2>코드 분석을 비동기 Job으로<br />처리하는 파이프라인</h2></header>
          <div className="planned-flow" aria-label="계획된 비동기 분석 흐름">
            <div><small>01 · REQUEST</small><strong>Repository 등록</strong><p>GitHub 저장소와 분석 요청 생성</p></div><i>→</i><div><small>02 · QUEUE</small><strong>비동기 작업 전달</strong><p>요청 상태를 저장하고 분석 서버에 위임</p></div><i>→</i><div><small>03 · ANALYZE</small><strong>정적 분석 + LLM</strong><p>취약점 탐지, 보안 문서 검색, 해석 생성</p></div><i>→</i><div><small>04 · RESULT</small><strong>결과 영속화</strong><p>대시보드·Diff 화면을 위한 결과 저장</p></div>
          </div>
          <div className="owner-box"><div><p className="case-label">WHY ASYNC</p><h3>동기 HTTP 처리에서 분석 Job을 분리합니다.</h3></div><p>정적 분석과 LLM 호출을 HTTP 요청 안에서 모두 수행하면 응답 timeout과 외부 API 장애에 취약합니다. API 서버는 분석 Job을 생성한 뒤 즉시 식별자를 반환하고, 분석 서버는 별도 실행 단위로 작업을 처리하며, 클라이언트는 Job 상태와 결과를 조회하는 구조로 설계했습니다.</p></div>
          <div className="decision-grid three">
            <article><p className="case-label">CONCERN 01</p><h3>HTTP timeout과 분석 실행 분리</h3><p>API 응답과 분석 실행의 수명을 분리합니다. 분석 요청 API는 Job ID를 반환하고, 진행 상태와 결과는 별도 조회 API로 제공하는 방식을 계획했습니다.</p></article>
            <article><p className="case-label">CONCERN 02</p><h3>파이프라인 단계별 상태 모델링</h3><p>코드 수집, 정적 분석, 보안 문서 검색, LLM 생성 단계마다 실패할 수 있습니다. Job 상태와 실패 단계를 저장해 재시도 여부와 사용자 응답을 판단할 수 있어야 합니다.</p></article>
            <article><p className="case-label">CONCERN 03</p><h3>재시도 시 중복 결과 저장 방지</h3><p>동일 Job이 재실행되더라도 분석 결과가 중복 저장되지 않도록 Job ID를 기준으로 멱등성을 보장할 계획입니다. 메시징 기술과 구체적인 재시도 정책은 아직 확정하지 않았습니다.</p></article>
          </div>
        </section>

        <section className="case-chapter" id="analysis-design">
          <header><p><span>02</span> RESULT NORMALIZATION</p><h2>Semgrep·CodeQL 결과를<br />공통 스키마로 정규화</h2></header>
          <div className="analysis-layers">
            <article><span>DETECT</span><h3>Raw result 수집</h3><p>Semgrep 또는 CodeQL에서 취약점 후보와 코드 위치가 포함된 도구별 결과를 수집합니다.</p></article>
            <article><span>NORMALIZE</span><h3>공통 DTO 변환</h3><p>파일 경로, 시작·종료 라인, CWE ID, 위험도, 코드 조각을 공통 분석 결과 DTO로 매핑합니다.</p></article>
            <article><span>ENRICH</span><h3>RAG context 구성</h3><p>CWE ID와 취약점 유형을 기준으로 OWASP·CWE 문서를 검색해 LLM 입력 context를 구성합니다.</p></article>
            <article><span>STORE</span><h3>분석 결과 영속화</h3><p>정규화한 결과와 LLM 수정 제안을 저장하고, 조회 API가 도구 종류와 무관한 응답을 반환하도록 합니다.</p></article>
          </div>
          <aside className="tradeoff planned"><span>MY DECISION</span><p>Semgrep과 CodeQL의 원본 응답을 DB나 API 스펙으로 직접 사용하지 않고 공통 DTO로 변환합니다. 분석 도구가 추가되거나 교체되어도 저장 모델과 프론트엔드 응답 계약을 변경하지 않는 것이 목적입니다.</p></aside>
        </section>

        <section className="case-chapter" id="product-flow">
          <header><p><span>03</span> RESULT PERSISTENCE &amp; API</p><h2>분석 결과 저장 모델과<br />조회 API 설계</h2></header>
          <div className="result-layout">
            <div className="result-window"><header><span>analysis-result.json</span><i>PLANNED UI</i></header><div><p><small>SEVERITY</small><b>HIGH</b></p><p><small>TYPE</small><b>SQL Injection</b></p><p><small>LOCATION</small><b>src/user/repository.ts:42</b></p></div></div>
            <div><p className="case-label">RESPONSE SCHEMA</p><h3>대시보드와 Diff 화면에 필요한<br />필드를 API 계약으로 정의합니다.</h3><p>취약점 유형, 위험도, 파일 경로, 시작·종료 라인, 원본 코드, 수정 제안을 분석 결과 모델에 저장합니다. 프로젝트별 분석 이력과 개별 취약점은 Job ID를 기준으로 조회하는 API 구조를 계획했습니다.</p></div>
          </div>
        </section>

        <section className="case-retro"><p className="case-label">ENGINEERING FOCUS</p><h2>비동기 Job 상태 관리와<br /><span>분석 결과 정규화·영속화</span></h2><div><p>분석 요청 API, Job 상태 모델, 단계별 실패 처리, 결과 저장과 조회 API로 이어지는 백엔드 파이프라인을 담당합니다.</p><p>현재 GitHub OAuth와 JWT 인증은 구현했으며, 분석 파이프라인은 설계 내용을 기준으로 구현할 예정입니다.</p></div></section>

        <section className="detail-end"><p>END OF CASE STUDY</p><h2>Continue exploring.</h2><div><a href="#/">← Main page</a><a className="github-link" href="https://github.com/SeCause/SeCause-BE" target="_blank" rel="noreferrer"><GitHubIcon /> Backend Repository ↗</a><a className="github-link" href="https://github.com/SeCause/SeCause-Analysis" target="_blank" rel="noreferrer"><GitHubIcon /> Analysis Repository ↗</a></div></section>
      </main>
    </div>
  )
}

function AiDetectorDetail({ project }: { project: Project }) {
  return (
    <div className="detail-page">
      <header className="detail-nav"><a href="#/">← cd ~/portfolio</a><span>projects/ai-detector</span></header>
      <main>
        <section className="detail-hero ai-hero">
          <p><span>guest@dwook</span>:~/projects/ai-detector$ cat case-study.md</p>
          <div className="detail-heading"><span>[03]</span><div><small>1-PERSON PROJECT · BACKEND &amp; AI · 2025</small><h1>Is It AI?</h1></div></div>
          <p className="detail-summary">이미지의 AI 생성·위변조 여부를 분류하고, 정량 지표와 Grad-CAM 히트맵을 함께 제공하는 이미지 분석 서비스입니다.</p>
          <p className="solo-badge"><span>01</span> 1인 개발 · 서비스 기획부터 모델 연동과 배포까지</p>
          <div className="detail-stack">{project.stack.map(item => <span key={item}>{item}</span>)}</div>
        </section>

        <section className="case-overview">
          <div><p className="case-label">PERSONAL PROJECT</p><h2>모델 추론을<br />웹 서비스로 운영하기</h2></div>
          <div className="case-overview-copy"><p>모델의 분류 결과를 화면에 출력하는 데서 끝내지 않고, 이미지 업로드부터 추론 요청, 결과 영속화와 사용자별 이력 조회까지 직접 구현했습니다.</p><p>백엔드 관점에서 가장 중요하게 다룬 부분은 <strong>API 서버와 추론 서버의 책임 분리</strong>, <strong>이미지와 분석 결과의 저장 방식</strong>, 그리고 <strong>모델을 포함한 배포 환경</strong>이었습니다.</p></div>
        </section>

        <section className="case-chapter" id="service-boundary">
          <header><p><span>01</span> SERVICE BOUNDARY</p><h2>Spring API와 FastAPI<br />추론 서버 분리</h2></header>
          <div className="architecture-flow ai-flow">
            <div><small>CLIENT</small><strong>이미지 업로드</strong><p>분석 요청과 결과 조회</p></div><i>→</i><div><small>SPRING BOOT</small><strong>서비스 오케스트레이션</strong><p>인증·S3 업로드·이력·결과 저장</p></div><i>→</i><div><small>FASTAPI</small><strong>모델 추론</strong><p>SwinV2·Grad-CAM·지표 계산</p></div><i>→</i><div><small>S3 / MYSQL</small><strong>결과 영속화</strong><p>이미지 파일과 분석 메타데이터 분리</p></div>
          </div>
          <div className="decision-grid">
            <article><p className="case-label">RESPONSIBILITY</p><h3>비즈니스 로직과 ML 런타임 분리</h3><p>Spring은 사용자, 인증, 분석 이력과 데이터 영속화를 담당합니다. PyTorch 의존성이 필요한 추론은 Python FastAPI 서버에 격리해 각 서버가 자신의 런타임과 책임에 집중하도록 구성했습니다.</p></article>
            <article><p className="case-label">CONTRACT</p><h3>URL 기반 서버 간 통신</h3><p>Spring이 원본 이미지를 S3에 먼저 저장하고 URL을 FastAPI에 전달합니다. FastAPI는 이미지를 내려받아 추론한 뒤 히트맵을 S3에 업로드하고, 지표와 히트맵 URL을 JSON으로 반환합니다.</p></article>
          </div>
          <div className="code-note"><span>API CONTRACT</span><code>POST /predict &#123; image_url &#125;<br />→ label · confidence · SSIM · LPIPS · RM · PVR · heatmapUrl</code></div>
        </section>

        <section className="case-chapter" id="analysis-result">
          <header><p><span>02</span> ANALYSIS RESULT</p><h2>분류 결과에<br />근거 데이터를 추가</h2></header>
          <div className="metric-layout">
            <div className="metric-console"><header><span>result.json</span><i>COMPLETED</i></header><pre>{`{
  "label": 2,
  "state": "Mid Risk",
  "confidence": 0.9412,
  "ssim": 0.8124,
  "lpips": 0.1763,
  "rm": 0.018421,
  "pvr": 3.72,
  "heatmapUrl": "s3://..."
}`}</pre></div>
            <div><p className="case-label">WHY MORE THAN A LABEL</p><h3>결과를 해석할 수 있는 정보로 반환</h3><p>4개 클래스와 confidence만으로는 모델이 이미지의 어느 부분에 반응했는지 알기 어렵습니다. Grad-CAM 히트맵을 생성하고 SSIM, LPIPS, RM, PVR 지표를 함께 반환해 분석 결과를 여러 관점에서 확인하도록 했습니다.</p></div>
          </div>
          <div className="analysis-layers ai-metrics">
            <article><span>CLASSIFICATION</span><h3>SwinV2</h3><p>이미지를 4개 상태로 분류하고 softmax 기반 confidence를 계산합니다.</p></article>
            <article><span>LOCALIZATION</span><h3>Grad-CAM</h3><p>마지막 Swin Transformer block을 대상으로 모델 반응 영역을 히트맵으로 생성합니다.</p></article>
            <article><span>SIMILARITY</span><h3>SSIM · LPIPS</h3><p>구조적·지각적 유사도를 모델 출력에서 복원해 분석 응답에 포함합니다.</p></article>
            <article><span>RESIDUAL</span><h3>RM · PVR</h3><p>고주파 잔차의 평균과 강한 peak 비율을 계산해 추가 지표로 제공합니다.</p></article>
          </div>
        </section>

        <section className="case-chapter" id="persistence">
          <header><p><span>03</span> STORAGE &amp; HISTORY</p><h2>파일과 분석 메타데이터를<br />분리해 저장</h2></header>
          <div className="storage-map">
            <article><span>S3</span><h3>Binary object</h3><ul><li>사용자가 업로드한 원본 이미지</li><li>FastAPI가 생성한 Grad-CAM 히트맵</li><li>추론 서버가 시작할 때 내려받는 모델 가중치</li></ul></article>
            <article><span>MYSQL</span><h3>Analysis metadata</h3><ul><li>PROCESSING · COMPLETED · FAILED 상태</li><li>분류 결과와 정량 지표</li><li>원본·히트맵 S3 URL과 생성 시각</li></ul></article>
          </div>
          <div className="decision-grid">
            <article><p className="case-label">HISTORY</p><h3>사용자별 분석 이력 관리</h3><p>회원의 분석 요청을 생성 시각 역순으로 조회하고 상세 결과를 다시 확인할 수 있게 했습니다. 이력 삭제 시 DB 레코드뿐 아니라 원본 이미지와 히트맵 객체도 S3에서 함께 삭제합니다.</p></article>
            <article><p className="case-label">STATE</p><h3>분석 생명주기를 상태로 저장</h3><p>요청 생성 시 <code>PROCESSING</code>, 정상 응답 시 <code>COMPLETED</code>, 추론 서버 예외 시 <code>FAILED</code>로 전이하도록 분석 상태를 모델링했습니다.</p></article>
          </div>
        </section>

        <section className="case-chapter" id="deployment">
          <header><p><span>04</span> DEPLOYMENT</p><h2>모델 가중치를 이미지에서 분리한<br />컨테이너 배포</h2></header>
          <div className="deployment-grid">
            <article><span>01</span><h3>Docker Compose</h3><p>Spring, FastAPI, MySQL을 컨테이너로 구성하고 Nginx를 통해 HTTPS와 reverse proxy를 적용했습니다.</p></article>
            <article><span>02</span><h3>Model on S3</h3><p>모델 가중치를 Docker image에 포함하지 않고 FastAPI 시작 시 S3에서 내려받습니다. 로컬 파일이 있으면 재사용해 불필요한 다운로드를 피합니다.</p></article>
            <article><span>03</span><h3>GitHub Actions</h3><p>Spring image를 빌드해 Docker Hub에 push하고, EC2에서 새 image를 pull해 재기동하는 배포 흐름을 구성했습니다.</p></article>
          </div>
        </section>

        <section className="case-chapter improvement-section">
          <header><p><span>05</span> RETROSPECTIVE</p><h2>동작하는 파이프라인에서<br />운영 가능한 파이프라인으로</h2></header>
          <div className="improvement-box"><p className="case-label">CURRENT LIMITATION</p><h3>동기 추론 호출과 트랜잭션 범위</h3><p>현재 Spring 서비스는 WebClient의 <code>block()</code>으로 추론 완료를 기다리고, 분석 요청 메서드 전체에 DB 트랜잭션이 적용됩니다. 추론 시간이 길어지면 HTTP 연결과 트랜잭션을 함께 오래 점유하며, 예외 발생 시 <code>FAILED</code> 상태 변경도 rollback될 수 있습니다.</p><div><strong>NEXT</strong><span>분석 요청을 비동기 Job으로 분리</span><span>외부 API 호출 전후의 트랜잭션 경계 축소</span><span>timeout·retry·실패 상태 영속화 정책 추가</span></div></div>
        </section>

        <section className="case-retro"><p className="case-label">ENGINEERING FOCUS</p><h2>모델을 호출하는 API가 아니라,<br /><span>분석 결과가 남는 서비스를 구현했습니다.</span></h2><div><p>Spring과 FastAPI의 책임을 분리하고 S3·MySQL에 결과를 영속화해 사용자별 분석 이력까지 연결했습니다.</p><p>1인 개발로 인증, 추론 API, 저장소와 배포 환경까지 구성하며 모델 서빙에서 운영 경계가 왜 중요한지 확인했습니다.</p></div></section>

        <section className="detail-end"><p>END OF CASE STUDY</p><h2>Continue exploring.</h2><div><a href="#/">← Main page</a><a className="github-link" href="https://github.com/boogiewooki02/AI-Detector-Project" target="_blank" rel="noreferrer"><GitHubIcon /> GitHub Repository ↗</a></div></section>
      </main>
    </div>
  )
}

export default function ProjectDetail({ project }: { project: Project }) {
  if (project.slug === 'groupeat') return <GroupeatDetail project={project} />
  if (project.slug === 'secause') return <SeCauseDetail project={project} />
  if (project.slug === 'ai-detector') return <AiDetectorDetail project={project} />
  return null
}
