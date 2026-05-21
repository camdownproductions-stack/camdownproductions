import { useEffect, useMemo, useState } from "react";

const fallbackAccounts = [
  {
    handle: "camdownproductions",
    label: "Camdown Productions",
    url: "https://www.instagram.com/camdownproductions/",
    role: "Films, events, and production stories"
  },
  {
    handle: "framingpicturesby_k.s",
    label: "Framing Pictures by K.S",
    url: "https://www.instagram.com/framingpicturesby_k.s/",
    role: "Portraits, frames, and visual details"
  }
];

const fallbackItems = [
  {
    account: "Camdown Productions",
    handle: "camdownproductions",
    title: "Camdown Productions",
    caption:
      "Connect a media source to turn this into a live gallery of the latest films, reels, and production stills.",
    permalink: "https://www.instagram.com/camdownproductions/",
    image: null,
    mediaType: "PROFILE"
  },
  {
    account: "Framing Pictures by K.S",
    handle: "framingpicturesby_k.s",
    title: "Framing Pictures by K.S",
    caption:
      "This source is ready for portraits, frames, and visual details once the portfolio media is connected.",
    permalink: "https://www.instagram.com/framingpicturesby_k.s/",
    image: null,
    mediaType: "PROFILE"
  }
];

function placeholder(handle) {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1125">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#263d35"/>
          <stop offset=".48" stop-color="#9f503c"/>
          <stop offset="1" stop-color="#d7bd91"/>
        </linearGradient>
      </defs>
      <rect width="900" height="1125" fill="url(#g)"/>
      <g fill="#fffdf9" opacity=".72">
        <rect x="92" y="92" width="716" height="941" fill="none" stroke="#fffdf9" stroke-width="12"/>
        <circle cx="450" cy="455" r="132" fill="none" stroke="#fffdf9" stroke-width="16"/>
        <path d="M224 816h452" stroke="#fffdf9" stroke-width="16"/>
        <path d="M306 872h288" stroke="#fffdf9" stroke-width="10"/>
      </g>
      <text x="450" y="648" fill="#fffdf9" font-family="Arial, sans-serif" font-size="42" font-weight="700" text-anchor="middle">@${handle}</text>
    </svg>
  `)}`;
}

function shortDate(value) {
  if (!value) return "Portfolio";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function Header() {
  return (
    <header className="site-header" id="top">
      <a className="brand" href="#top" aria-label="Camdown Productions home">
        <span>Camdown</span>
        <small>Productions</small>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#portfolio">Portfolio</a>
        <a href="#studios">Studios</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-media" aria-hidden="true">
        <div className="film-strip">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">Film portfolio</p>
        <h1>Camdown Productions</h1>
        <p>
          Cinematic stories, frames, and production moments gathered into one elegant
          portfolio for GitHub Pages.
        </p>
        <a className="hero-link" href="#portfolio">
          View latest work
        </a>
      </div>
    </section>
  );
}

function PortfolioCard({ item }) {
  return (
    <a className="portfolio-card" href={item.permalink} target="_blank" rel="noreferrer">
      <img src={item.image || placeholder(item.handle)} alt={item.title} loading="lazy" />
      <div>
        <p className="meta">
          <span>@{item.handle}</span>
          <span>{shortDate(item.timestamp)}</span>
        </p>
        <h3>{item.title}</h3>
        <p>{item.caption || "Open this portfolio item to view the full story."}</p>
      </div>
    </a>
  );
}

function StudioCard({ account }) {
  return (
    <article className="studio-card">
      <p className="meta">
        <span>@{account.handle}</span>
        <span>Source</span>
      </p>
      <h3>{account.label}</h3>
      <p>{account.role}</p>
      <a href={account.url} target="_blank" rel="noreferrer">
        Open profile
      </a>
    </article>
  );
}

function App() {
  const [status, setStatus] = useState("Preparing portfolio...");
  const [items, setItems] = useState(fallbackItems);
  const [accounts, setAccounts] = useState(fallbackAccounts);

  const isGitHubPages = useMemo(() => window.location.hostname.endsWith("github.io"), []);

  useEffect(() => {
    if (isGitHubPages) {
      setStatus(
        "GitHub Pages site is live. Add a static media JSON file or a separate API host to load new work automatically."
      );
      return;
    }

    async function loadMedia() {
      try {
        const response = await fetch("/api/instagram");
        const data = await response.json();

        setAccounts(data.accounts?.length ? data.accounts : fallbackAccounts);

        if (data.live && data.items?.length) {
          setStatus("Live media loaded from the connected accounts.");
          setItems(data.items);
          return;
        }

        setStatus(
          data.error ||
            "Portfolio is ready. Connect an API or media JSON source to load live items."
        );
      } catch (error) {
        setStatus(`Portfolio feed is using fallback items: ${error.message}`);
      }
    }

    loadMedia();
  }, [isGitHubPages]);

  return (
    <>
      <Header />
      <main>
        <Hero />

        <section className="intro" aria-label="Portfolio introduction">
          <p>
            A refined gallery layout inspired by classic wedding and film portfolios,
            built as a React site that can be published directly through GitHub Pages.
          </p>
        </section>

        <section className="portfolio-section" id="portfolio">
          <div className="section-heading">
            <p className="eyebrow">Latest media</p>
            <h2>Featured Films & Frames</h2>
          </div>
          <div className="status" role="status">
            {status}
          </div>
          <div className="portfolio-grid" aria-live="polite">
            {items.map((item) => (
              <PortfolioCard key={`${item.handle}-${item.title}`} item={item} />
            ))}
          </div>
        </section>

        <section className="studios" id="studios">
          <div className="section-heading">
            <p className="eyebrow">Source accounts</p>
            <h2>Two visual streams, one portfolio</h2>
          </div>
          <div className="studio-grid">
            {accounts.map((account) => (
              <StudioCard key={account.handle} account={account} />
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <p className="eyebrow">Bookings & collaborations</p>
          <h2>Bring the next story into frame.</h2>
          <div className="contact-actions">
            <a href="https://www.instagram.com/camdownproductions/" target="_blank" rel="noreferrer">
              Camdown Instagram
            </a>
            <a
              href="https://www.instagram.com/framingpicturesby_k.s/"
              target="_blank"
              rel="noreferrer"
            >
              Framing Pictures
            </a>
          </div>
        </section>
      </main>

      <footer>
        <a href="#top">Back to top</a>
        <span>Camdown Productions</span>
      </footer>
    </>
  );
}

export default App;
