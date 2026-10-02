import { useMemo, useRef, useState } from "react";
import {
  Activity, BookOpen, Heart, ClipboardList, Search, ShieldCheck,
  Stethoscope, ChartNoAxesColumn, CalendarDays, Leaf, ArrowRight,
  Info, RotateCcw, ZoomIn, ZoomOut, Microscope, Droplets,
  CheckCircle2, Move, ExternalLink, Flower2,
} from "lucide-react";
import "./App.css";

const IMG = {
  pair: "/images/pcos-vs-healthy-uterus.jpeg",
  ovary: "/images/pcos-vs-healthy-ovary.png",
};

const effects = [
  { title: "Insulin resistance", img: "/images/effects/insulin-resistance.webp", tag: "Metabolic", icon: "◉",
    description: "Cells respond less to insulin, which can push the body to make more of it." },
  { title: "Androgen excess", img: "/images/effects/androgen-excess.webp", tag: "Hormonal", icon: "≈",
    description: "Raised androgens can show up as acne, hair fall and unwanted hair." },
  { title: "Irregular ovulation", img: "/images/effects/irregular-ovulation.webp", tag: "Cycle", icon: "≋",
    description: "Follicles that stall can mean ovulation is late or missed, so cycles become unpredictable." },
  { title: "Many small follicles", img: "/images/effects/many-small-follicles.webp", tag: "On the ovary", icon: "✿",
    description: "Often called cysts, these are follicles that have not matured. They can be seen on ultrasound." },
];

const tabs = [
  { name: "Both systems", icon: Activity },
  { name: "PCOS-affected", icon: Droplets },
  { name: "Healthy", icon: Leaf },
  { name: "Ovary close-up", icon: Microscope },
];

const hotspots = [
  { x: "27%", y: "60%", label: "Multiple small follicles",
    text: "Many small follicles ring the PCOS ovary instead of one maturing." },
  { x: "85%", y: "46%", label: "Dominant follicle",
    text: "In a typical cycle, one follicle becomes dominant, matures and releases an egg." },
];

function view(tab) {
  if (tab === "Ovary close-up") return { src: IMG.ovary, ratio: "1408/768", size: "cover", pos: "center" };
  if (tab === "PCOS-affected") return { src: IMG.pair, ratio: "704/768", size: "200% 100%", pos: "0 0", narrow: true };
  if (tab === "Healthy") return { src: IMG.pair, ratio: "704/768", size: "200% 100%", pos: "100% 0", narrow: true };
  return { src: IMG.pair, ratio: "1408/768", size: "cover", pos: "center" };
}


const CASES = {
  short: { name: "Shortened cycle", range: "about 15 days", src: "/images/cycle-short.jpg", ratio: "339/559" },
  typical: { name: "Typical cycle", range: "21–35 days", src: IMG.ovary, ratio: "704/768", size: "200% 100%", pos: "100% 0" },
  extended: { name: "Extended cycle", range: "about 42 days", src: "/images/cycle-extended.jpg", ratio: "337/559" },
  prolonged: { name: "Prolonged cycle", range: "90+ days", src: "/images/cycle-prolonged.jpg", ratio: "339/559" },
};
const caseFor = (d) => (d < 21 ? "short" : d <= 35 ? "typical" : d <= 65 ? "extended" : "prolonged");

function CycleCase({ res, zoom }) {
  const [sel, setSel] = useState(res.case);
  const bg = (c) => ({ backgroundImage: `url(${c.src})`, backgroundSize: c.size || "cover", backgroundPosition: c.pos || "center" });
  const c = CASES[sel];
  return (
    <div className="case-wrap">
      <div className="case-main" role="img" aria-label={`${c.name}, ${c.range}`}
        style={{ ...bg(c), aspectRatio: c.ratio, transform: `scale(${zoom})` }}>
        {sel === res.case && <span className="count-chip">● Your cycle · {res.cycle} days</span>}
      </div>
      <div className="case-thumbs">
        {Object.keys(CASES).map((k) => (
          <button key={k} className={`thumb ${k === res.case ? "mine" : ""}`} aria-pressed={sel === k} onClick={() => setSel(k)}>
            <i style={bg(CASES[k])} /><span>{CASES[k].name}<small>{CASES[k].range}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Anatomy({ tab, zoom, setTab, res }) {
  const [hot, setHot] = useState(0);
  const v = view(tab);
  const close = tab === "Ovary close-up";
  const showRes = res && ((tab === "PCOS-affected" && res.kind === "pcos") || (tab === "Healthy" && res.kind === "healthy"));
  return (
    <div className="anatomy-stage">
      <div className="anatomy-note note-left">
        <strong>● &nbsp;{showRes ? "Your illustrative read" : close ? hotspots[hot].label : tab}</strong>
        <p>{showRes ? `${CASES[res.case].name} · ${res.cycle} days` : close ? hotspots[hot].text : "Educational illustration"}</p>
      </div>
      <div className="anatomy-note note-right">
        <strong>● &nbsp;{showRes ? "Illustrative only" : "Appearance varies"}</strong>
        <p>{showRes ? "Not a measurement or a diagnosis" : "Only a doctor can diagnose PCOS"}</p>
      </div>
      <div className="model-canvas">
        {showRes ? (
          <CycleCase key={`${res.case}-${res.cycle}`} res={res} zoom={zoom} />
        ) : (
        <div
          className="stage-img"
          role="img"
          aria-label={`${tab} illustration`}
          style={{
            backgroundImage: `url(${v.src})`,
            aspectRatio: v.ratio,
            backgroundSize: v.size,
            backgroundPosition: v.pos,
            maxWidth: v.narrow ? "340px" : "100%",
            transform: `scale(${zoom})`,
          }}
        >
          {close && hotspots.map((h, i) => (
            <button key={h.label} className={`dot ${hot === i ? "on" : ""}`} aria-label={h.label}
              style={{ left: h.x, top: h.y }} onClick={() => setHot(i)} />
          ))}
        </div>
        )}
      </div>
      <div className="drag-hint"><Move size={13} /> {close ? "Tap a marker to explore" : "Switch views using the tabs above"}</div>
      <button className="inside-button" onClick={() => setTab(close ? "Both systems" : "Ovary close-up")}>
        {close ? "Back to the full system" : "See the ovary up close"}
        <ArrowRight size={19} />
      </button>
    </div>
  );
}

function cycleLabel(d) {
  if (d === null) return "Choose a cycle length";
  if (d < 21) return "Shorter than the typical range";
  if (d <= 35) return "Within the typical 21–35 day range";
  return "Longer than the typical range";
}

export default function App() {
  const [status, setStatus] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [years, setYears] = useState(null);
  const [res, setRes] = useState(null);
  const centerRef = useRef(null);
  const [tab, setTab] = useState("Both systems");
  const [zoom, setZoom] = useState(1);
  const [showRead, setShowRead] = useState(false);
  const [measure, setMeasure] = useState(false);
  const [mini, setMini] = useState("Cycle");
  const [search, setSearch] = useState("");

  const cycles = useMemo(() => (cycle && years ? Math.round((years * 365) / cycle) : null), [cycle, years]);
  const ready = status !== null && cycle !== null && years !== null;

  function runRead() {
    setShowRead(true);
    if (!ready) return;
    const pcos = cycle > 35;
    setRes({ kind: pcos ? "pcos" : "healthy", case: caseFor(cycle), cycle, years, status, label: cycleLabel(cycle) });
    setTab(pcos ? "PCOS-affected" : "Healthy");
    setZoom(1);
    setTimeout(() => centerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }
  const filtered = effects.filter((e) =>
    `${e.title} ${e.tag} ${e.description}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="site">
      <header className="topbar">
        <a href="#" className="logo">
          <span className="logo-lungs">✿</span>
          <span><strong>Saamya</strong><small>Balance, measured.</small></span>
        </a>
        <nav className="main-nav">
          <a className="nav-active" href="#simulator"><Activity /> Hormone Read</a>
          <a href="#learn"><BookOpen /> Learn</a>
          <a href="#stories"><Heart /> Ecosystem</a>
          <a href="#resources"><ClipboardList /> Business case</a>
        </nav>
        <label className="search-box">
          <Search size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics, e.g. insulin, follicles..." aria-label="Search topics" />
        </label>
        <button className="safety-icon" title="Health information"><ShieldCheck size={22} /></button>
        <span className="top-message">Measurement is what<br /> makes it work.</span>
      </header>

      <main className="dashboard" id="simulator">
        <aside className="left-column">
          <div className="panel intro-panel">
            <span className="eyebrow">A LITTLE ABOUT YOU</span>
            <h1>Your hormone profile</h1>
            <p>Explore how PCOS can show up, and how measuring it helps.</p>

            <div className="input-card">
              <div className="input-title"><span className="input-icon"><Stethoscope /></span><strong>Where are you on your PCOS journey?</strong></div>
              <div className="segmented">
                {["Exploring", "Suspected", "Diagnosed"].map((o) => (
                  <button key={o} className={status === o ? "selected" : ""} onClick={() => setStatus(o)}>{o}</button>
                ))}
              </div>
            </div>

            <div className="input-card">
              <div className="input-title"><span className="input-icon"><ChartNoAxesColumn /></span><strong>Usual cycle length</strong></div>
              <div className="slider-value"><strong>{cycle ?? "—"}</strong><span>days</span></div>
              <input type="range" min="15" max="90" value={cycle ?? 28} className={cycle === null ? "untouched" : ""} onChange={(e) => setCycle(Number(e.target.value))} aria-label="Cycle length in days" />
              <div className="range-labels"><span>15</span><span>35</span><span>60</span><span>90</span></div>
              <p className="helper">Count from the first day of one period to the first day of the next.</p>
            </div>

            <div className="input-card">
              <div className="input-title"><span className="input-icon"><CalendarDays /></span><strong>Years managing it</strong></div>
              <div className="slider-value"><strong>{years ?? "—"}</strong><span>years</span></div>
              <input type="range" min="1" max="15" value={years ?? 3} className={years === null ? "untouched" : ""} onChange={(e) => setYears(Number(e.target.value))} aria-label="Years managing PCOS" />
              <div className="range-labels"><span>1</span><span>5</span><span>10</span><span>15</span></div>
              <p className="helper">Since diagnosis, or since your symptoms began.</p>
            </div>

            <button className={`quit-link ${ready ? "ready" : ""}`} onClick={runRead}>
              <span className="input-icon"><Leaf /></span>
              <span><strong>Want to know if it's working?</strong><small>Take the free Hormone Read.</small></span>
              <ArrowRight size={21} />
            </button>
            {showRead && (
              <div className="quit-expanded" aria-live="polite">
                {!ready
                  ? "Choose your journey status, usual cycle length and years managing it first, then press this again."
                  : res && `${res.label}. The centre now shows the ${CASES[res.case].name.toLowerCase()} case (${CASES[res.case].range}) for your ${res.cycle}-day cycle. Tap the small cards to compare the other patterns. This is a teaching example, not a diagnosis. A doctor needs blood tests and often an ultrasound.`}
              </div>
            )}
          </div>

          <div className="panel exposure-panel">
            <h3><ChartNoAxesColumn size={18} /> Your profile summary</h3>
            <div className="pack-number">≈ {cycles ?? "—"} <span>cycles</span> <Info size={15} /></div>
            <p className="formula">{cycles ? `${years} years × 365 days ÷ ${cycle}-day cycles` : "Choose both sliders to see this"}</p>
            <a href="https://www.icmr.gov.in/" target="_blank" rel="noreferrer">About PCOS prevalence in India ↗</a>

            <div className="exposure-status">
              <small>Where you are now</small>
              <strong>{status === null ? "Not selected yet" : status === "Exploring" ? "Looking for answers" : status === "Suspected" ? "Seeking clarity" : "Managing, without a measure"}</strong>
              <small>Journey status, not a clinical stage</small>
            </div>
            <p>{cycleLabel(cycle)}. Cycle length alone cannot show PCOS; diagnosis needs a doctor, blood tests and often an ultrasound.</p>
            <hr />
            <strong>What this can mean for you</strong>
            <p>Each cycle is a chance to learn something, but without a baseline and a retest it is hard to tell whether anything is working. A Day-90 retest turns guesswork into a measurement.</p>
            <p className="disclaimer">Diagnosis: not assessed.</p>
          </div>
        </aside>

        <section className="center-column" ref={centerRef} style={{ scrollMarginTop: 12 }}>
          <div className="center-heading">
            <span className="eyebrow">UNDERSTAND WHAT'S BENEATH THE SURFACE</span>
            <div className="heading-row">
              <div>
                <h2>A closer look at the ovaries.</h2>
                <p>Explore the science. See the difference.</p>
              </div>
              <div className="medical-notice"><Info size={17} /> Educational visualization.<br />Not a medical diagnosis.</div>
            </div>
          </div>

          <div className="anatomy-tabs">
            {tabs.map(({ name, icon: Icon }) => (
              <button key={name} onClick={() => setTab(name)} className={tab === name ? "active" : ""}>
                <Icon size={19} /> {name}
              </button>
            ))}
          </div>

          <div className="model-label">
            <span><i /> ILLUSTRATED ANATOMY</span>
            <button onClick={() => { setTab("Healthy"); setZoom(1); }}><Activity size={14} /> Healthy reference</button>
          </div>

          <Anatomy tab={tab} zoom={zoom} setTab={setTab} res={res} />

          <div className="model-controls">
            <button onClick={() => setTab(tab === "PCOS-affected" ? "Healthy" : "PCOS-affected")}><RotateCcw /> Flip</button>
            <button onClick={() => setZoom((z) => Math.min(z + 0.1, 1.4))} aria-label="Zoom in"><ZoomIn /></button>
            <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.7))} aria-label="Zoom out"><ZoomOut /></button>
            <span className="control-divider" />
            <button onClick={() => { setZoom(1); setTab("Both systems"); setRes(null); }}><RotateCcw /> Reset</button>
          </div>

          <div className="airway-panel" id="learn">
            <div className="airway-top">
              <span className="eyebrow">YOUR INPUTS · A TEACHING EXAMPLE</span>
              <div className="mini-tabs">
                {["Cycle", "Follicles"].map((m) => (
                  <button key={m} className={mini === m ? "active" : ""} onClick={() => setMini(m)}>{m}</button>
                ))}
              </div>
            </div>
            <div className="airway-content">
              <div className="airway-illustration"><Flower2 size={50} /></div>
              <div>
                <h3>{mini === "Cycle" ? "Inside a cycle" : "Inside an ovary"}</h3>
                <p>{mini === "Cycle"
                  ? "When ovulation is late or missed, cycles stretch and become hard to predict."
                  : "Several small follicles can start to grow, but none becomes dominant and releases an egg."}</p>
                <small>{cycle ? `${cycle}-day cycles` : "Cycle length not set"} · {years ? `${years} years managing` : "years not set"}</small><br />
                <button className="text-link" onClick={() => setMini(mini === "Cycle" ? "Follicles" : "Cycle")}>
                  Explore the comparison <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <p className="small-disclaimer"><Info size={14} /> Inputs change this example only. They are not a measure of your hormones, follicle count or ovary size.</p>
          </div>

          <div className="evidence-note">
            <Info size={16} />
            <span>These images are stylised teaching illustrations. Colour and texture are cues, not a measured appearance of your body.</span>
            <a href="#resources">How this works</a>
          </div>
          <label className="checkbox-line">
            <input type="checkbox" checked={measure} onChange={(e) => setMeasure(e.target.checked)} />
            Explore why measurement matters
            <span>Teaching example</span>
          </label>
          {measure && (
            <p className="air-trapping-note">
              PCOS involves insulin resistance and androgen excess, with 22 measurable markers and four
              phenotypes. A baseline and a Day-90 retest let a doctor see change. In the Saamya plan, 40% are
              still on their protocol at month 6, against about 20% for the category.
            </p>
          )}

          <div className="source-line" id="resources">
            <ShieldCheck size={15} /> Grounded in evidence <span> | </span>
            Indian community studies · Saamya case model <ArrowRight size={14} />
          </div>
        </section>

        <aside className="right-column panel" id="stories">
          <span className="eyebrow">THE SCIENCE BEHIND THE CHANGES</span>
          <h2>What may be happening</h2>
          <p className="right-intro">Possible mechanisms, not findings about your body.</p>

          <div className="effect-list">
            {filtered.map((e) => (
              <article className="effect-card" key={e.title}>
                <div className="effect-image">{e.img ? <img src={e.img} alt={e.title} loading="lazy" /> : <span>{e.icon}</span>}</div>
                <div>
                  <h3>{e.title}</h3>
                  <span className="effect-tag">{e.tag}</span>
                  <p>{e.description}</p>
                </div>
              </article>
            ))}
            {filtered.length === 0 && <p className="no-results">No matching topics found.</p>}
          </div>

          <div className="recovery-card">
            <h3><Leaf size={23} /> A brighter outlook<br /> with measurement</h3>
            <p>Measuring turns one purchase into a plan that she can see working.</p>
            {[
              "A free baseline Hormone Read on Day 0",
              "A phenotype-matched protocol from Day 1",
              "A doctor-signed retest at Day 90",
              "Skin and hair care added, personalised to you",
            ].map((item) => (
              <div className="recovery-item" key={item}><CheckCircle2 size={16} /> {item}</div>
            ))}
            <hr />
            <small>Saamya supports PCOS care. It does not cure or replace medical advice.</small>
            <a href="#stories" className="recovery-link">Explore the 24-month loop <ArrowRight size={16} /></a>
          </div>

          <a href="#resources" className="research-link">
            <BookOpen size={15} /> Read the case & sources <ExternalLink size={13} />
          </a>
          <p className="helper" style={{ marginTop: 14 }}>SAAMYA is a fictional brand created for a case study.</p>
        </aside>
      </main>
    </div>
  );
}