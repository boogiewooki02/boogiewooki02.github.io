import { useEffect, useState } from 'react'
import { collaborations, projects, type Project } from './data'
import ProjectDetail from './ProjectDetail'
import GitHubIcon from './GitHubIcon'

const Arrow = () => <span aria-hidden="true">↗</span>

function StatusBar() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()))
    update(); const timer = window.setInterval(update, 30_000)
    return () => window.clearInterval(timer)
  }, [])
  return <div className="status"><span><i /> SYSTEM ONLINE</span><span>SEOUL {time} KST</span></div>
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <header><span className="project-index">[{project.index}]</span><div className="project-heading"><p>{project.type} <b>· CASE STUDY AVAILABLE</b></p><div className="project-title-row"><h3><a href={`#/projects/${project.slug}`}>{project.name}<span className="title-arrow">↗</span></a></h3><div className="repo-links">{project.links.map(link => <a className="github-link" key={link.href} href={link.href} target="_blank" rel="noreferrer"><GitHubIcon /> {link.label} <Arrow /></a>)}</div></div></div><time>{project.period}</time></header>
      <div className="project-body">
        <p className="project-description">{project.description}</p>
        <div className="log-block focus-block"><div className="log-title"><span>ENGINEERING_FOCUS</span><span>0{project.focus.length} TOPICS</span></div><ol>{project.focus.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></div>
      </div>
      <footer><div className="stack">{project.stack.map(item => <span key={item}>{item}</span>)}</div></footer>
      <a className="case-study-link" href={`#/projects/${project.slug}`}><span>프로젝트 상세 보기</span><small>VIEW CASE STUDY</small><b>→</b></a>
    </article>
  )
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash)
  useEffect(() => {
    const onRouteChange = () => { setRoute(window.location.hash); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', onRouteChange)
    return () => window.removeEventListener('hashchange', onRouteChange)
  }, [])
  const projectSlug = route.match(/^#\/projects\/([^#]+)/)?.[1]
  const selectedProject = projects.find(project => project.slug === projectSlug)
  useEffect(() => {
    document.title = selectedProject
      ? `${selectedProject.name} — 김동욱 포트폴리오`
      : '김동욱 — Backend Developer'
  }, [selectedProject])

  if (selectedProject) return <ProjectDetail project={selectedProject} />

  return (
    <div className="app">
      <StatusBar />
      <nav className="nav"><a className="logo" href="#top"><span>~/</span>dwook.dev</a><div><a href="#work">01.work</a><a href="#about">02.about</a><a href="#contact">03.contact</a></div></nav>
      <main>
        <section className="hero" id="top">
          <div className="hero-aside"><span>PORTFOLIO_BUILD</span><strong>v1.0.0</strong></div>
          <div className="hero-main">
            <p className="command"><span>guest@dwook</span>:~$ whoami</p>
            <h1>김동욱<span className="cursor">_</span></h1>
            <p className="role">BACKEND<br />DEVELOPER</p>
            <p className="hero-copy">인증부터 결제, AI 추론까지.<br />복잡한 요구사항을 <strong>일관된 데이터 흐름과<br />견고한 API</strong>로 풀어냅니다.</p>
            <div className="hero-links"><a className="cta" href="#work">$ view_projects <span>↓</span></a><a href="mailto:boogiewooki02@gmail.com">send_mail <Arrow /></a></div>
          </div>
          <div className="hero-code" aria-hidden="true"><pre>{`class Developer {
  focus = "backend";
  values = [
    "consistency",
    "reliability",
    "clarity"
  ];

  build() {
    return flow;
  }
}`}</pre><span className="line-count">01<br/>02<br/>03<br/>04<br/>05<br/>06<br/>07<br/>08<br/>09<br/>10<br/>11<br/>12</span></div>
        </section>

        <section className="section work" id="work">
          <div className="section-title"><p><span>$</span> ls ./selected-work</p><h2>Selected projects</h2><span>03 directories</span></div>
          <div className="projects">{projects.map(project => <ProjectCard key={project.name} project={project} />)}</div>
        </section>

        <section className="section collaboration">
          <div className="section-title"><p><span>$</span> cat collaboration.md</p><h2>Client-side context</h2><span>02 entries</span></div>
          <p className="section-intro">프론트엔드 협업 경험은 API를 사용하는 사람의 관점에서 계약을 설계하고, 경계를 넘어 소통하는 기반이 되었습니다.</p>
          <div className="collab-list">{collaborations.map((item, index) => <article key={item.name}><span>0{index + 1}</span><div><p>{item.meta}</p><h3>{item.name}</h3><p>{item.description}</p><code>{item.stack}</code></div><a className="collab-github" href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.name} GitHub 저장소`}><GitHubIcon /><small>GitHub</small></a></article>)}</div>
        </section>

        <section className="section about" id="about">
          <div className="section-title"><p><span>$</span> cat about.txt</p><h2>How I build</h2><span>read-only</span></div>
          <div className="about-grid"><div className="manifesto"><p>서버 바깥의 맥락까지<br /><strong>연결해서 봅니다.</strong></p><p>도메인 상태와 데이터 정합성, 인증의 수명주기, 배포 이후의 운영까지 고려하며 구현합니다.</p></div><div className="skills"><div><span>01</span><h3>BACKEND</h3><p>Java · Spring Boot · Security · JPA<br />Python · FastAPI</p></div><div><span>02</span><h3>DATA / INFRA</h3><p>MySQL · PostgreSQL · Docker<br />AWS · Nginx · GitHub Actions</p></div><div><span>03</span><h3>FOUNDATION</h3><p>REST API · OAuth 2.0 · JWT<br />Transaction · CI/CD · Git</p></div></div></div>
          <div className="history"><div><time>2022.03 —</time><strong>홍익대학교</strong><span>컴퓨터공학과</span></div><div><time>2025.03 — 09</time><strong>SK Networks AI Camp</strong><span>13기 수료</span></div><div><time>2025.07 —</time><strong>ToBig’s 인공지능·데이터분석 연합동아리</strong><span>24기</span></div><div><time>2026.03 —</time><strong>신촌 연합 IT 창업동아리 CEOS</strong><span>23기 BE</span></div></div>
        </section>
      </main>
      <footer className="footer" id="contact"><p><span>$</span> open contact</p><h2>Let's make it<br /><span>work.</span></h2><a className="mail" href="mailto:boogiewooki02@gmail.com">boogiewooki02@gmail.com <Arrow /></a><div className="footer-bottom"><div><a href="tel:+821049095782">TEL. 010-4909-5782</a><a href="https://github.com/boogiewooki02" target="_blank" rel="noreferrer">GITHUB <Arrow /></a><a href="https://boogiewooki.tistory.com" target="_blank" rel="noreferrer">BLOG <Arrow /></a></div><span>© {new Date().getFullYear()} KIM DONGWOOK</span></div></footer>
    </div>
  )
}
