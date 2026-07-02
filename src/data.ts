export type Project = {
  slug: string
  index: string
  name: string
  type: string
  period: string
  description: string
  contribution: string[]
  focus: string[]
  stack: string[]
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    slug: 'groupeat', index: '01', name: 'Groupeat', type: 'TEAM / BACKEND', period: '2026',
    description: '단체 주문의 탐색부터 결제, 픽업과 정산까지 이어지는 주문 플랫폼입니다. 고객과 사업자 양쪽의 상태 변화가 맞물리는 도메인을 Spring Boot로 구현했습니다.',
    contribution: ['카카오·구글·네이버 OAuth와 JWT 쿠키 인증', '토스페이먼츠 승인·취소 및 비관적 락 적용', '주문 상태 전이, 픽업 완료와 정산 도메인', 'S3 Presigned URL, CloudFront, CI/CD 구성'],
    focus: ['주문·결제·정산의 상태 일관성', '외부 결제 시스템과의 경계 설계', '회원 유형과 가입 단계에 따른 인증 흐름'],
    stack: ['Java 21', 'Spring Boot', 'JPA', 'AWS', 'Docker'],
    links: [{ label: 'repository', href: 'https://github.com/CEOS-Groupeat/groupeat-backend' }],
  },
  {
    slug: 'secause', index: '02', name: 'SeCause', type: 'TEAM / BACKEND', period: '2026',
    description: 'GitHub 저장소의 코드를 분석해 보안 취약점과 수정 가이드를 제공하는 서비스입니다. 정적 분석과 LLM을 연결하는 비동기 파이프라인을 설계하고 있습니다.',
    contribution: ['GitHub OAuth 인가 코드 로그인', 'JWT 인증과 Cross-site 쿠키 설정', 'Refresh Token 해시 저장·재발급·로그아웃', '인증 예외와 운영 CORS 설정 보완'],
    focus: ['분석 Job 비동기 처리와 상태 모델링', '정적 분석 결과와 LLM 해석의 연결', 'GitHub OAuth와 토큰 수명주기'],
    stack: ['Spring Security', 'PostgreSQL', 'FastAPI', 'Docker'],
    links: [{ label: 'backend', href: 'https://github.com/SeCause/SeCause-BE' }, { label: 'analysis', href: 'https://github.com/SeCause/SeCause-Analysis' }],
  },
  {
    slug: 'ai-detector', index: '03', name: 'Is It AI?', type: 'PERSONAL / BACKEND & AI', period: '2025',
    description: '이미지의 AI 생성·위변조 여부를 분석하고 정량 지표와 히트맵으로 의심 영역을 보여주는 1인 개발 서비스입니다.',
    contribution: ['Spring–FastAPI 추론 요청 파이프라인', 'JWT 인증과 사용자별 분석 이력', 'S3 이미지 저장과 MySQL 결과 영속화', 'Docker Compose, Nginx HTTPS, Actions 배포'],
    focus: ['웹 서버와 추론 서버의 책임 분리', '이미지·분석 결과의 저장 흐름', '컨테이너 기반 배포와 운영 구성'],
    stack: ['Java 21', 'FastAPI', 'PyTorch', 'MySQL', 'AWS'],
    links: [{ label: 'repository', href: 'https://github.com/boogiewooki02/AI-Detector-Project' }],
  },
]

export const collaborations = [
  { name: '2024 Hongik Festival', meta: '7-PERSON FRONTEND TEAM', description: '공연·라인업·홍익존·지도 UI, 다국어 콘텐츠와 핀치 줌 인터랙션을 구현하고 운영 일정에 맞춰 팀 QA를 수행했습니다.', stack: 'React / i18next / Styled Components', href: 'https://github.com/boogiewooki02/Festa-Client-Application' },
  { name: 'KAHLUA BAND', meta: '2-PERSON FRONTEND TEAM', description: 'API 연동, STOMP 기반 예약 상태 반영, 관리자 화면과 다양한 기기의 반응형 UI를 지속적으로 개발·보수했습니다.', stack: 'Next.js / TypeScript / STOMP', href: 'https://github.com/boogiewooki02/Homepage_client_ver2.0' },
]
