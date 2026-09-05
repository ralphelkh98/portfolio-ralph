import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { articles } from './articles.js'
import './styles.css'

const BASE = import.meta.env.BASE_URL
const asset = (p) => `${BASE}assets/${p}`

const NAV = [
  ['/', 'Accueil'],
  ['/communication-institutionnelle', 'Institutionnel'],
  ['/editorial-rh', 'Éditorial & RH'],
  ['/communication-entreprise', 'Entreprise'],
  ['/audiovisuel', 'Audiovisuel'],
  ['/publications', 'Publications'],
  ['/parcours', 'Parcours'],
  ['/contact', 'Contact'],
]

const projects = [
  {slug:'football-feminin', section:'institutionnel', title:'Football féminin : égalité, cohésion et marque employeur', org:'Département des Hauts-de-Seine', period:'2024–2025', summary:'Une campagne suivie dans la durée autour du programme Manita : lancement, animation, contenus internes et sociaux, puis bilan des résultats.', image:'images/football-feminin.jpg'},
  {slug:'projet-voltaire', section:'institutionnel', title:'Projet Voltaire', org:'Département des Hauts-de-Seine', period:'2024–2025', summary:'Communication autour d’un programme de formation au français et à l’expression écrite, avec la DRH Formation.', video:'video/projet-voltaire.mp4'},
  {slug:'loona', section:'institutionnel', title:'Loona : raconter l’inclusion par une histoire', org:'Département des Hauts-de-Seine', period:'2024–2025', summary:'Le départ à la retraite de Loona, chien-guide de Jean-Noël Lucas, utilisé comme point d’entrée concret pour parler handicap et inclusion.', image:'images/loona.jpg'},
  {slug:'guide-apprentissage', section:'editorial', title:'Guide de l’apprentissage', org:'Département des Hauts-de-Seine', period:'2025', summary:'Un guide de 28 pages conçu pour donner aux apprentis les informations utiles dès leur arrivée : repères, interlocuteurs, droits et vie au Département.', image:'images/guide-cover.jpg'},
  {slug:'hacktusecu', section:'entreprise', title:'HacktuSecu', org:'Bouygues Telecom', period:'2022–2023', summary:'Quatre éditions d’un bulletin de veille et de sensibilisation à la cybersécurité, rédigées et mises en forme pour un public interne non spécialiste.', image:'images/hack-oct.jpg'},
  {slug:'innodays', section:'entreprise', title:'Innodays @ Bouygues Telecom', org:'Bouygues Telecom', period:'2022–2023', summary:'Reportage vidéo sur un événement interne consacré aux projets et aux équipes d’innovation.', video:'video/innodays.mp4'},
  {slug:'totalenergies', section:'entreprise', title:'Communication interne multiformat', org:'TotalEnergies Raffinage-Chimie', period:'sept.–nov. 2023', summary:'Co-animation d’une newsletter SharePoint, préparation de Teams Live et accompagnement de rendez-vous internes.'},
]

const portraits = [
  {slug:'laura-masson', name:'Laura Masson', subtitle:'Portrait collaborateur', image:'images/laura-masson.jpg', text:'Entretien, rédaction, intégration dans TYPO3 et publication. Le portrait met l’accent sur le parcours, les missions et la réalité du métier.'},
  {slug:'lamine-ndiaye', name:'Lamine Ndiaye', subtitle:'Portrait collaborateur', image:'images/lamine-ndiaye.jpg', text:'Entretien long, rédaction et publication via TYPO3, avec une attention particulière aux liens entre sport, handicap et transmission.'},
  {slug:'aude-poilleux', name:'Aude Poilleux', subtitle:'Portrait collaborateur', text:'Entretien, rédaction, intégration CMS et publication. Le format privilégie la parole et l’expérience professionnelle plutôt qu’un discours institutionnel.'},
]

function getPath(){ return (location.hash.replace(/^#/, '') || '/').split('?')[0] }
function go(path){ location.hash = path }

function App(){
  const [path,setPath] = useState(getPath())
  const [menu,setMenu] = useState(false)
  useEffect(()=>{ const h=()=>{setPath(getPath());setMenu(false);window.scrollTo(0,0)}; addEventListener('hashchange',h); return()=>removeEventListener('hashchange',h)},[])
  const page = useMemo(()=>resolvePage(path),[path])
  return <>
    <Header path={path} menu={menu} setMenu={setMenu}/>
    <main>{page}</main>
    <Footer/>
  </>
}

function Header({path,menu,setMenu}){
  return <header className="site-header"><div className="nav-wrap">
    <a className="brand" href="#/">Ralph El Khoury</a>
    <button className="menu-btn" aria-label="Ouvrir le menu" onClick={()=>setMenu(!menu)}>{menu?'Fermer':'Menu'}</button>
    <nav className={menu?'nav open':'nav'}>{NAV.slice(1).map(([to,label])=><a key={to} href={'#'+to} className={path.startsWith(to)?'active':''}>{label}</a>)}</nav>
  </div></header>
}

function Footer(){return <footer className="footer"><div className="shell footer-in"><div>Ralph El Khoury · Chargé de communication</div><div className="footer-links"><a href="mailto:ralphelkh@gmail.com">ralphelkh@gmail.com</a><a href="tel:+33775286352">+33 7 75 28 63 52</a></div></div></footer>}

function resolvePage(path){
  if(path==='/') return <Home/>
  if(path==='/communication-institutionnelle') return <SectionPage kind="institutionnel" title="Communication institutionnelle & marque employeur" lead="Au Département des Hauts-de-Seine : campagnes internes, marque employeur, égalité, handicap, formation et valorisation des agents."/>
  if(path==='/editorial-rh') return <EditorialPage/>
  if(path==='/communication-entreprise') return <SectionPage kind="entreprise" title="Communication d’entreprise" lead="Chez Bouygues Telecom et TotalEnergies : communication interne, newsletter, veille cybersécurité, événementiel et vidéo."/>
  if(path==='/audiovisuel') return <Audiovisuel/>
  if(path==='/publications') return <Publications/>
  if(path==='/parcours') return <Parcours/>
  if(path==='/contact') return <Contact/>
  if(path.startsWith('/projets/')) return <Project slug={path.split('/')[2]}/>
  if(path.startsWith('/portraits/')) return <Portrait slug={path.split('/')[2]}/>
  if(path.startsWith('/articles/')) return <Article slug={path.split('/')[2]}/>
  return <NotFound/>
}

const Eyebrow=({children})=><div className="eyebrow">{children}</div>
function Hero({eyebrow,title,lead,children}){return <section className="page-hero"><div className="shell"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{lead&&<p className="lede">{lead}</p>}{children}</div></section>}
function Back({to,label='Retour'}){return <a className="back" href={'#'+to}>← {label}</a>}

function Home(){return <>
  <section className="home-hero"><div className="shell home-grid"><div>
    <Eyebrow>Communication institutionnelle · éditoriale · digitale</Eyebrow>
    <h1>Ralph El Khoury</h1><h2>Chargé de communication</h2>
    <div className="intro"><p>Parcours croisé entre communication et journalisme, avec des expériences en collectivité territoriale, grands groupes et médias.</p><p>Au Département des Hauts-de-Seine, j’ai travaillé sur la communication interne et RH, la marque employeur, les réseaux sociaux, l’éditorial web, les campagnes et la production de contenus audiovisuels.</p><p>La formation en journalisme complète cette approche par la recherche, l’interview, le reportage, la veille et la synthèse, en français, arabe et anglais.</p></div>
    <div className="actions"><a className="btn primary" href="#/communication-institutionnelle">Voir les réalisations</a><a className="btn" href="#/contact">Contact</a></div>
  </div><figure className="portrait"><img src={asset('images/ralph-portrait.jpg')} alt="Portrait de Ralph El Khoury"/></figure></div></section>
  <section className="section"><div className="shell"><div className="section-head"><Eyebrow>Sélection</Eyebrow><h2>Réalisations</h2></div><div className="cards five">
    <HomeCard to="/communication-institutionnelle" n="01" title="Communication institutionnelle" text="Football féminin, Projet Voltaire, inclusion et marque employeur."/>
    <HomeCard to="/editorial-rh" n="02" title="Éditorial & RH" text="Guide de l’apprentissage, portraits, rédaction et intégration TYPO3."/>
    <HomeCard to="/communication-entreprise" n="03" title="Communication d’entreprise" text="Bouygues Telecom, HacktuSecu, Innodays et TotalEnergies."/>
    <HomeCard to="/audiovisuel" n="04" title="Audiovisuel" text="Reportages L’Étudiant, formats vidéo et entretiens Radio Orient."/>
    <HomeCard to="/publications" n="05" title="Publications" text="Reportages, portraits et décryptages réalisés en France et au Liban."/>
  </div></div></section>
  <section className="section soft"><div className="shell"><div className="path-strip"><div><Eyebrow>Parcours</Eyebrow><h2>Communication + journalisme</h2></div><div className="path-items"><span>Hauts-de-Seine · 2024–2025</span><span>TotalEnergies · 2023</span><span>Bouygues Telecom · 2022–2023</span><span>Journalisme · 2021–2024</span></div><a className="btn" href="#/parcours">Voir le parcours</a></div></div></section>
</>}
function HomeCard({to,n,title,text}){return <a className="home-card" href={'#'+to}><span>{n}</span><h3>{title}</h3><p>{text}</p><b>Découvrir →</b></a>}

function SectionPage({kind,title,lead}){const items=projects.filter(p=>p.section===kind);return <><Hero eyebrow="Portfolio" title={title} lead={lead}/><section className="section"><div className="shell"><div className="project-list">{items.map((p,i)=><ProjectRow p={p} i={i} key={p.slug}/>)}</div></div></section></>}
function ProjectRow({p,i}){return <a className="project-row" href={'#/projets/'+p.slug}><div className="project-num">0{i+1}</div><div className="project-copy"><div className="meta">{p.org} · {p.period}</div><h2>{p.title}</h2><p>{p.summary}</p><b>Voir le projet →</b></div><div className="project-thumb">{p.image?<img src={asset(p.image)} alt=""/>:<div className="thumb-placeholder">{p.video?'Vidéo':'Projet'}</div>}</div></a>}

function EditorialPage(){return <><Hero eyebrow="Département des Hauts-de-Seine" title="Éditorial, web & contenus RH" lead="Rédaction, portraits, intégration CMS et accompagnement des contenus de recrutement et d’apprentissage."/><section className="section"><div className="shell"><ProjectRow p={projects.find(p=>p.slug==='guide-apprentissage')} i={0}/><div className="section-head spaced"><Eyebrow>Portraits</Eyebrow><h2>Trois entretiens, trois parcours</h2></div><div className="cards three">{portraits.map(p=><a className="portrait-card" href={'#/portraits/'+p.slug} key={p.slug}>{p.image&&<img src={asset(p.image)} alt={p.name}/>}<div><div className="meta">{p.subtitle}</div><h3>{p.name}</h3><p>{p.text}</p><b>Lire →</b></div></a>)}</div></div></section></>}

function Project({slug}){const p=projects.find(x=>x.slug===slug);if(!p)return <NotFound/>; if(slug==='football-feminin')return <Football p={p}/>; if(slug==='guide-apprentissage')return <Guide p={p}/>; if(slug==='hacktusecu')return <Hack p={p}/>; if(slug==='projet-voltaire')return <Voltaire p={p}/>; if(slug==='innodays')return <Innodays p={p}/>; if(slug==='loona')return <Loona p={p}/>; if(slug==='totalenergies')return <TotalEnergies p={p}/>; return <GenericProject p={p}/>}
function ProjectHero({p,back}){return <><Hero eyebrow={`${p.org} · ${p.period}`} title={p.title} lead={p.summary}><Back to={back}/></Hero></>}

function Football({p}){return <><ProjectHero p={p} back="/communication-institutionnelle"/><section className="section"><div className="shell case-grid"><div><img className="hero-media" src={asset('images/football-feminin.jpg')} alt="Entraînement de football féminin au Département des Hauts-de-Seine"/><h2>Une campagne inscrite dans le plan d’égalité professionnelle</h2><p>Le programme est mené avec Manita dans le cadre du plan d’action 2024–2025 pour l’égalité femmes-hommes. La communication accompagne les entraînements et les matchs sur plusieurs mois, du lancement au bilan.</p><p>Contribution : pilotage opérationnel de la communication, rédaction, coordination avec la direction, le secrétariat général chargé de l’égalité et Manita, contenus internes et réseaux sociaux, puis restitution des résultats.</p></div><aside className="metric-box"><Metric n="62" t="joueuses inscrites"/><Metric n="258" t="participations de janvier à fin avril 2025"/><Metric n="93 %" t="jugent l’impact positif sur la vie sociale au travail"/><Metric n="60 %" t="jugent l’impact positif sur confiance et leadership"/></aside></div></section><section className="section soft"><div className="shell"><div className="section-head"><Eyebrow>Bilan</Eyebrow><h2>Des résultats présentés sans surcharge</h2></div><div className="image-trio"><img src={asset('images/football-bilan-1.jpg')} alt="Couverture du bilan Manita"/><img src={asset('images/football-bilan-2.jpg')} alt="Analyse des indicateurs"/><img src={asset('images/football-bilan-3.jpg')} alt="Recommandations et perspectives"/></div><p className="note">Autres repères : 100 % apprécient les sessions et le coaching, 90 % jouaient rarement ou jamais auparavant, 97 % estiment les séances adaptées à leur niveau, 87 % déclarent avoir beaucoup progressé, 40 participantes au webinaire, 25 entraînements et 3 matchs.</p></div></section></>}
function Metric({n,t}){return <div className="metric"><strong>{n}</strong><span>{t}</span></div>}

function Voltaire({p}){return <><ProjectHero p={p} back="/communication-institutionnelle"/><section className="section"><div className="shell two-col"><div><h2>Informer sur une formation utile au quotidien</h2><p>Le travail porte sur la communication autour du parcours de perfectionnement en français proposé aux agents avec la DRH Formation et Projet Voltaire : messages de lancement, relais internes et contenus destinés aux écrans.</p><p>La vidéo ci-contre correspond au support diffusé sur les écrans internes.</p></div><video className="video" controls preload="metadata" src={asset('video/projet-voltaire.mp4')}/></div></section></>}
function Loona({p}){return <><ProjectHero p={p} back="/communication-institutionnelle"/><section className="section"><div className="shell two-col"><img className="hero-media" src={asset('images/loona.jpg')} alt="Loona, chien-guide, avec les équipes"/><div><h2>Un sujet d’inclusion raconté à hauteur d’agent</h2><p>Le départ à la retraite de Loona, chien-guide de Jean-Noël Lucas, agent aveugle à l’accueil téléphonique, permet de parler de handicap à partir d’une histoire concrète plutôt que d’un message général.</p><p>Le contenu associe récit, portrait et politique d’inclusion du Département, avec une écriture destinée à l’intranet et aux supports internes.</p></div></div></section></>}

function Guide({p}){return <><ProjectHero p={p} back="/editorial-rh"/><section className="section"><div className="shell"><div className="two-col align-start"><div><h2>Un support pratique de 28 pages</h2><p>Le guide rassemble les informations nécessaires aux apprentis : fonctionnement du Département, interlocuteurs, parcours, droits, conseils et repères utiles pendant l’année.</p><p>La contribution porte sur la rédaction, la coordination avec la DRH, l’organisation des informations et la production éditoriale du support.</p><a className="btn primary" href={asset('docs/guide-apprentissage.pdf')} target="_blank" rel="noreferrer">Consulter le guide complet — PDF, 28 pages</a></div><div className="guide-previews"><img src={asset('images/guide-cover.jpg')} alt="Couverture du guide"/><img src={asset('images/guide-sommaire.jpg')} alt="Sommaire du guide"/><img src={asset('images/guide-page.jpg')} alt="Page intérieure du guide"/></div></div></div></section></>}

const issues=[
  ['Octobre 2022','n°4','images/hack-oct.jpg','docs/hacktusecu-octobre-2022.pdf'],
  ['Novembre 2022','n°5','images/hack-nov.jpg','docs/hacktusecu-novembre-2022.pdf'],
  ['Décembre 2022','n°6','images/hack-dec.jpg','docs/hacktusecu-decembre-2022.pdf'],
  ['Février 2023','n°7','images/hack-feb.jpg','docs/hacktusecu-fevrier-2023.pdf']]
function Hack({p}){return <><ProjectHero p={p} back="/communication-entreprise"/><section className="section"><div className="shell"><div className="two-col align-start"><div><h2>Veille et sensibilisation</h2><p>HacktuSecu est une newsletter de veille sécurité produite pour la DPPS de Bouygues Telecom. Les quatre éditions retenues couvrent octobre, novembre, décembre 2022 et février 2023.</p><p>Contribution : veille, rédaction et synthèse de sujets techniques, mise en forme éditoriale et diffusion interne.</p></div><div className="note">Chaque édition est consultable directement en PDF. Les miniatures servent uniquement d’aperçu.</div></div><div className="issue-grid">{issues.map(([date,num,img,pdf])=><article className="issue" key={num}><img src={asset(img)} alt={`Couverture HacktuSecu ${num}`}/><div><div className="meta">{date} · {num}</div><h3>HacktuSecu {num}</h3><a className="btn" target="_blank" rel="noreferrer" href={asset(pdf)}>Consulter le PDF complet</a></div></article>)}</div></div></section></>}
function Innodays({p}){return <><ProjectHero p={p} back="/communication-entreprise"/><section className="section"><div className="shell two-col"><div><h2>Reportage sur l’innovation interne</h2><p>Couverture vidéo des Innodays de Bouygues Telecom : tournage sur l’événement, interviews et montage d’un format de restitution destiné aux collaborateurs.</p><p className="note">Le lecteur présente actuellement un extrait optimisé pour le web.</p></div><video className="video" controls preload="metadata" src={asset('video/innodays.mp4')}/></div></section></>}
function TotalEnergies({p}){return <><ProjectHero p={p} back="/communication-entreprise"/><section className="section"><div className="shell article-width"><h2>Communication interne multiformat</h2><p>À TotalEnergies Raffinage-Chimie, la mission combine plusieurs formats : co-animation de la newsletter hebdomadaire sur SharePoint, préparation de deux Teams Live, contenus liés à une journée développement durable et accompagnement d’un rendez-vous innovation destiné à plusieurs sites.</p><p>Le travail porte sur la rédaction, la collecte d’informations, l’organisation éditoriale et la préparation de supports, en lien avec l’équipe communication.</p></div></section></>}
function GenericProject({p}){return <><ProjectHero p={p} back="/"/><section className="section"><div className="shell article-width"><p>{p.summary}</p></div></section></>}

function Portrait({slug}){const p=portraits.find(x=>x.slug===slug);if(!p)return <NotFound/>;return <><Hero eyebrow="Département des Hauts-de-Seine · Éditorial RH" title={p.name} lead={p.text}><Back to="/editorial-rh" label="Éditorial & RH"/></Hero><section className="section"><div className="shell portrait-page">{p.image?<img src={asset(p.image)} alt={p.name}/>:<blockquote>« Le portrait privilégie la parole, l’expérience et la précision du métier. »</blockquote>}<div><h2>Rédaction, CMS et publication</h2><p>Entretien préparé et conduit pour faire émerger les éléments les plus concrets du parcours. Le texte est ensuite rédigé, intégré dans TYPO3 et publié sur les canaux du Département.</p><p>L’objectif n’est pas d’empiler des éléments biographiques, mais de faire comprendre le métier, les missions et la trajectoire de la personne interrogée.</p></div></div></section></>}

function Audiovisuel(){return <><Hero eyebrow="Journalisme audiovisuel" title="Reportages, interviews & radio" lead="Terrain, recherche d’interlocuteurs, micro-trottoirs, interviews et montage dans des contextes de publication rapide."/><section className="section"><div className="shell"><div className="section-head"><Eyebrow>L’Étudiant · mai 2022</Eyebrow><h2>Bac 2022 : deux reportages vidéo</h2></div><div className="video-grid"><VideoEmbed id="toRG3swJJr8" date="10 mai 2022" title="Bac 2022, jour J : comment se sont préparés les lycéens ?" text="Zoé, Adam et Alexandre racontent leur préparation quelques heures avant les épreuves. Reportage de Zineb El Mountassir et Ralph El-Khoury."/><VideoEmbed id="1TxiW9ddYkM" date="13 mai 2022" title="Bac 2022 : les réactions après le deuxième jour" text="Micro-trottoir au lycée Simone-Veil de Boulogne-Billancourt. Contenu cosigné par Zineb El Mountassir, Mélina Khabouz, Jean de Teyssière et Ralph El-Khoury."/></div></div></section><section className="section soft"><div className="shell"><div className="section-head"><Eyebrow>Radio Orient</Eyebrow><h2>Quatre entretiens audio</h2></div><div className="audio-grid"><Audio title="Vaincre l’autisme" file="audio/radio-vaincre-autisme.mp3"/><Audio title="Dawrati — entretien avec Lina Nasr" file="audio/radio-dawrati.mp3"/><Audio title="Festival de Baalbeck — entretien avec Nayla de Freige" file="audio/radio-baalbeck.mp3"/><Audio title="Repas étudiants à 1 € — entretien avec Mélanie Luce (UNEF)" file="audio/radio-unef.mp3"/></div></div></section></>}
function VideoEmbed({id,date,title,text}){return <article className="video-card"><div className="embed"><iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div><div className="meta">{date} · L’Étudiant</div><h3>{title}</h3><p>{text}</p></article>}
function Audio({title,file}){return <article className="audio-card"><div className="meta">Radio Orient</div><h3>{title}</h3><audio controls preload="none" src={asset(file)}/></article>}

function Publications(){return <><Hero eyebrow="Journalisme" title="Publications" lead="Reportages, portraits et décryptages réalisés en France et au Liban."/><section className="section"><div className="shell article-cards">{articles.map(a=><a href={'#/articles/'+a.slug} className="article-card" key={a.slug}><div className="meta">{a.format} · {a.place}{a.place?' · ':''}{a.date}</div><h2>{a.title}</h2><p>{a.standfirst}</p><b>Lire l’article →</b></a>)}</div></section></>}
function Article({slug}){const a=articles.find(x=>x.slug===slug);if(!a)return <NotFound/>;return <><Hero eyebrow={`${a.format}${a.place?' · '+a.place:''} · ${a.date}`} title={a.title} lead={a.standfirst}><Back to="/publications" label="Publications"/></Hero><section className="section"><article className="article-body" dangerouslySetInnerHTML={{__html:a.bodyHtml}}/><div className="article-note">Texte repris à partir de la version d’origine et présenté ici dans un format de lecture web.</div></section></>}

function Parcours(){const rows=[['2024–2025','Département des Hauts-de-Seine','Communication institutionnelle, RH, éditorial web, campagnes, réseaux sociaux, supports et audiovisuel.'],['2023','TotalEnergies Raffinage-Chimie','Communication interne : SharePoint, newsletter, Teams Live et événements.'],['2022–2023','Bouygues Telecom','Communication interne : HacktuSecu, Innodays, contenus et événementiel.'],['2021–2024','Journalisme — Paris & Beyrouth','L’Étudiant, Radio Orient et expériences de rédaction et reportage au Liban.']];return <><Hero eyebrow="Expériences" title="Parcours" lead="Un parcours construit entre communication et journalisme, avec une pratique de la rédaction au centre."/><section className="section"><div className="shell timeline">{rows.map(r=><div className="timeline-row" key={r[0]}><strong>{r[0]}</strong><div><h2>{r[1]}</h2><p>{r[2]}</p></div></div>)}</div></section><section className="section soft"><div className="shell"><div className="skills-grid"><div><Eyebrow>Langues</Eyebrow><h2>Français · Arabe · Anglais</h2></div><div><Eyebrow>Outils</Eyebrow><p>TYPO3 · SharePoint · Adobe Premiere Pro · InDesign · Photoshop · Canva · réseaux sociaux</p></div><div><Eyebrow>Pratique</Eyebrow><p>Rédaction · interview · veille · reportage · vidéo · communication interne · communication institutionnelle</p></div></div></div></section></>}
function Contact(){return <><Hero eyebrow="Contact" title="Échanger" lead="Chargé de communication — communication institutionnelle, éditoriale et digitale."/><section className="section"><div className="shell contact-grid"><a href="mailto:ralphelkh@gmail.com"><span>Email</span><strong>ralphelkh@gmail.com</strong></a><a href="tel:+33775286352"><span>Téléphone</span><strong>+33 7 75 28 63 52</strong></a><a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/ralph-el-khoury-b27296157"><span>LinkedIn</span><strong>Ralph El Khoury</strong></a><div><span>Localisation</span><strong>Île-de-France</strong></div></div></section></>}
function NotFound(){return <Hero eyebrow="404" title="Page introuvable" lead="Cette page n’existe pas ou a été déplacée."><a className="btn" href="#/">Retour à l’accueil</a></Hero>}

createRoot(document.getElementById('root')).render(<App/>)
