import { useEffect, useMemo, useState } from "react";

const sections = [
  {
    id: "videos",
    title: "Videos",
    eyebrow: "Films",
    description: "Wedding films, pre-wedding stories, and maternity memories.",
    categories: [
      { id: "preWedding", label: "Pre-Wedding" },
      { id: "wedding", label: "Wedding" },
      { id: "maternity", label: "Maternity" }
    ]
  },
  {
    id: "photos",
    title: "Photos",
    eyebrow: "Photography",
    description: "Cinematic stills arranged into the moments your visitors will look for first.",
    categories: [
      { id: "preWedding", label: "Pre-Wedding" },
      { id: "wedding", label: "Wedding" },
      { id: "maternity", label: "Maternity" }
    ]
  }
];

const fallbackMedia = {
  videos: {
    preWedding: [
      {
        id: "video-pre-wedding-sample",
        name: "Pre-Wedding Film",
        mimeType: "video/mp4",
        webViewLink: "https://drive.google.com",
        thumbnailLink: null
      }
    ],
    wedding: [
      {
        id: "video-wedding-sample",
        name: "Wedding Film",
        mimeType: "video/mp4",
        webViewLink: "https://drive.google.com",
        thumbnailLink: null
      }
    ],
    maternity: [
      {
        id: "video-maternity-sample",
        name: "Maternity Film",
        mimeType: "video/mp4",
        webViewLink: "https://drive.google.com",
        thumbnailLink: null
      }
    ]
  },
  photos: {
    preWedding: [
      {
        id: "photo-pre-wedding-sample",
        name: "Pre-Wedding Gallery",
        mimeType: "image/jpeg",
        webViewLink: "https://drive.google.com",
        thumbnailLink: null
      }
    ],
    wedding: [
      {
        id: "photo-wedding-sample",
        name: "Wedding Gallery",
        mimeType: "image/jpeg",
        webViewLink: "https://drive.google.com",
        thumbnailLink: null
      }
    ],
    maternity: [
      {
        id: "photo-maternity-sample",
        name: "Maternity Gallery",
        mimeType: "image/jpeg",
        webViewLink: "https://drive.google.com",
        thumbnailLink: null
      }
    ]
  }
};

function heroPlaceholder(label, tone = "dark") {
  const palette =
    tone === "warm"
      ? ["#6f3c33", "#b8945c", "#f1ddbd"]
      : ["#263d35", "#9f503c", "#d7bd91"];

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${palette[0]}"/>
          <stop offset=".52" stop-color="${palette[1]}"/>
          <stop offset="1" stop-color="${palette[2]}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="1500" fill="url(#g)"/>
      <rect x="96" y="96" width="1008" height="1308" fill="none" stroke="#fffdf9" stroke-width="12" opacity=".65"/>
      <circle cx="600" cy="620" r="170" fill="none" stroke="#fffdf9" stroke-width="18" opacity=".72"/>
      <path d="M290 1060h620" stroke="#fffdf9" stroke-width="18" opacity=".7"/>
      <text x="600" y="835" fill="#fffdf9" font-family="Arial, sans-serif" font-size="52" font-weight="700" text-anchor="middle">${label}</text>
    </svg>
  `)}`;
}

function cleanName(name) {
  return name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();
}

function isVideo(item) {
  return item.mimeType?.startsWith("video/");
}

function previewUrl(item) {
  if (!item.id || item.id.includes("sample")) return null;
  return `https://drive.google.com/file/d/${item.id}/preview`;
}

function imageUrl(item, categoryLabel) {
  if (item.thumbnailLink) return item.thumbnailLink.replace(/=s\d+/, "=s1600");
  if (item.id && !item.id.includes("sample") && !isVideo(item)) {
    return `https://drive.google.com/thumbnail?id=${item.id}&sz=w1600`;
  }
  return heroPlaceholder(categoryLabel, isVideo(item) ? "dark" : "warm");
}

async function loadDriveConfig() {
  const response = await fetch(`${import.meta.env.BASE_URL}drive-folders.json`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Drive folder config was not found.");
  }

  return response.json();
}

async function fetchDriveFolder(folderId, apiKey) {
  if (!folderId) return [];

  const query = `'${folderId}' in parents and trashed = false`;
  const params = new URLSearchParams({
    key: apiKey,
    q: query,
    pageSize: "80",
    orderBy: "name_natural",
    fields: "files(id,name,mimeType,thumbnailLink,webViewLink,createdTime,modifiedTime)"
  });

  const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Google Drive media could not be loaded.");
  }

  return (data.files || []).filter(
    (file) => file.mimeType?.startsWith("image/") || file.mimeType?.startsWith("video/")
  );
}

function Header() {
  return (
    <header className="site-header" id="top">
      <nav className="nav-group nav-left" aria-label="Primary navigation left">
        <a href="#top">Home</a>
        <a href="#about">About</a>
        <div className="menu-dropdown">
          <a className="dropdown-trigger" href="#portfolio">Portfolio</a>
          <div className="dropdown-panel" aria-label="Portfolio submenu">
            <a href="#photos">Wedding Photography</a>
            <a href="#videos">Wedding Films</a>
            <a href="#prewedding-films">PreWedding Films</a>
            <a href="#prewedding-pictures">PreWedding Pictures</a>
            <a href="#maternity-videos">Maternity Videos</a>
            <a href="#maternity-pictures">Maternity Pictures</a>
          </div>
        </div>
      </nav>
      <a className="brand" href="#top" aria-label="Camdown Productions home">
        <span>Camdown</span>
        <strong>Productions</strong>
        <small>Beautiful films... beautiful frames</small>
      </a>
      <nav className="nav-group nav-right" aria-label="Primary navigation right">
        <a href="#portfolio">Portfolio</a>
        <a href="#kind-words">Kind Words</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-frame" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">Beautiful films... beautiful frames</p>
        <h1>Camdown Productions</h1>
        <p>
          Wedding films, photographs, and intimate milestones arranged into a timeless
          portfolio experience.
        </p>
        <a className="hero-link" href="#portfolio">
          Explore portfolio
        </a>
      </div>
    </section>
  );
}

function MediaCard({ item, categoryLabel, onOpen }) {
  const title = cleanName(item.name);
  const video = isVideo(item);

  return (
    <article className="media-card">
      <button className="media-thumb" type="button" onClick={() => onOpen(item)}>
        <img src={imageUrl(item, categoryLabel)} alt={title} loading="lazy" />
        {video ? <span className="play-mark">Play</span> : null}
      </button>
      <div className="media-card-copy">
        <p className="meta">
          <span>{video ? "Video" : "Photo"}</span>
          <span>{categoryLabel}</span>
        </p>
        <h3>{title}</h3>
      </div>
    </article>
  );
}

function FeaturedCollages({ media, onOpen }) {
  function anchorFor(sectionId, categoryId) {
    const anchors = {
      "videos-preWedding": "prewedding-films",
      "photos-preWedding": "prewedding-pictures",
      "videos-maternity": "maternity-videos",
      "photos-maternity": "maternity-pictures"
    };

    return anchors[`${sectionId}-${categoryId}`] || `${sectionId}-${categoryId}`;
  }

  return (
    <section className="collage-section" id="portfolio" aria-label="Featured portfolio collages">
      <div className="section-heading">
        <p className="eyebrow">Featured stories</p>
        <h2>Recent Collages</h2>
      </div>
      <div className="collage-groups">
        {sections.map((section) => {
          const tiles = section.categories.flatMap((category) =>
            (media[section.id]?.[category.id] || []).slice(0, 3).map((item, itemIndex) => ({
              ...item,
              categoryLabel: category.label,
              anchorId: itemIndex === 0 ? anchorFor(section.id, category.id) : undefined
            }))
          );

          return (
            <article className="collage-group" id={section.id} key={section.id}>
              <div className="collage-heading">
                <p className="eyebrow">{section.eyebrow}</p>
                <h3>{section.title}</h3>
              </div>
              <div className="collage-grid">
                {tiles.slice(0, 6).map((item, index) => (
                  <button
                    className={`collage-tile tile-${index + 1}`}
                    id={item.anchorId || undefined}
                    type="button"
                    key={`${section.id}-${item.categoryLabel}-${item.id}`}
                    onClick={() => onOpen(item)}
                  >
                    <img src={imageUrl(item, item.categoryLabel)} alt={cleanName(item.name)} />
                    <span>
                      {isVideo(item) ? "Play" : "View"} {item.categoryLabel}
                    </span>
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CategoryPanel({ panelId, sectionId, category, items, defaultOpen, onOpen }) {
  const carouselId = `${sectionId}-${category.id}`;

  function scroll(direction) {
    const carousel = document.getElementById(carouselId);
    carousel?.scrollBy({
      left: direction * Math.min(carousel.clientWidth * 0.86, 920),
      behavior: "smooth"
    });
  }

  return (
    <details className="category-panel" id={panelId} open={defaultOpen}>
      <summary>
        <span>{category.label}</span>
        <small>{items.length} item{items.length === 1 ? "" : "s"}</small>
      </summary>
      <div className="carousel-shell">
        <button className="carousel-button previous" type="button" onClick={() => scroll(-1)}>
          Prev
        </button>
        <div className="media-carousel" id={carouselId}>
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              categoryLabel={category.label}
              onOpen={onOpen}
            />
          ))}
        </div>
        <button className="carousel-button next" type="button" onClick={() => scroll(1)}>
          Next
        </button>
      </div>
    </details>
  );
}

function PortfolioSection({ section, media, onOpen }) {
  return (
    <section className="portfolio-section" id={section.id}>
      <div className="section-heading">
        <p className="eyebrow">{section.eyebrow}</p>
        <h2>{section.title}</h2>
        <p>{section.description}</p>
      </div>
      <div className="category-list">
        {section.categories.map((category, index) => (
          <CategoryPanel
            key={`${section.id}-${category.id}`}
            panelId={`${section.id}-${category.id}`}
            sectionId={section.id}
            category={category}
            items={media[section.id]?.[category.id] || []}
            defaultOpen={index === 0}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}

function Lightbox({ item, onClose, onNext, onPrevious, total, current }) {
  if (!item) return null;

  const title = cleanName(item.name);
  const video = isVideo(item);
  const embed = previewUrl(item);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={title}>
      <button className="lightbox-backdrop" type="button" onClick={onClose} aria-label="Close" />
      <div className="lightbox-panel">
        <button className="lightbox-close" type="button" onClick={onClose}>
          Close
        </button>
        <button className="lightbox-nav lightbox-prev" type="button" onClick={onPrevious}>
          Previous
        </button>
        <button className="lightbox-nav lightbox-next" type="button" onClick={onNext}>
          Next
        </button>
        {video && embed ? (
          <iframe title={title} src={embed} allow="autoplay; fullscreen" allowFullScreen />
        ) : (
          <img src={imageUrl(item, title)} alt={title} />
        )}
        <div>
          <p className="meta">
            <span>{video ? "Video" : "Photo"}</span>
            <span>
              {current + 1} / {total}
            </span>
          </p>
          <h3>{title}</h3>
          <a href={item.webViewLink} target="_blank" rel="noreferrer">
            Open in Drive
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [media, setMedia] = useState(fallbackMedia);
  const [status, setStatus] = useState("Preparing Google Drive gallery...");
  const [activeIndex, setActiveIndex] = useState(null);

  const allItems = useMemo(
    () =>
      sections.flatMap((section) =>
        section.categories.flatMap((category) =>
          (media[section.id]?.[category.id] || []).map((item) => ({
            ...item,
            sectionLabel: section.title,
            categoryLabel: category.label
          }))
        )
      ),
    [media]
  );

  const activeItem = activeIndex === null ? null : allItems[activeIndex];

  function openItem(item) {
    const index = allItems.findIndex(
      (candidate) => candidate.id === item.id && candidate.name === item.name
    );
    setActiveIndex(index >= 0 ? index : 0);
  }

  function closeLightbox() {
    setActiveIndex(null);
  }

  function nextItem() {
    setActiveIndex((index) => (index === null ? 0 : (index + 1) % allItems.length));
  }

  function previousItem() {
    setActiveIndex((index) =>
      index === null ? 0 : (index - 1 + allItems.length) % allItems.length
    );
  }

  const totalItems = useMemo(
    () =>
      sections.reduce(
        (count, section) =>
          count +
          section.categories.reduce(
            (sectionCount, category) =>
              sectionCount + (media[section.id]?.[category.id]?.length || 0),
            0
          ),
        0
      ),
    [media]
  );

  useEffect(() => {
    async function loadMedia() {
      const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

      if (!apiKey) {
        setStatus(
          "Add a Google Drive API key and folder IDs to load your uploaded photos and videos."
        );
        return;
      }

      try {
        const config = await loadDriveConfig();
        const nextMedia = {};

        await Promise.all(
          sections.flatMap((section) =>
            section.categories.map(async (category) => {
              const folderId = config?.[section.id]?.[category.id];
              const files = await fetchDriveFolder(folderId, apiKey);
              nextMedia[section.id] = nextMedia[section.id] || {};
              nextMedia[section.id][category.id] = files.length
                ? files
                : fallbackMedia[section.id][category.id];
            })
          )
        );

        setMedia(nextMedia);
        setStatus("Google Drive gallery loaded.");
      } catch (error) {
        setStatus(`Using preview gallery: ${error.message}`);
      }
    }

    loadMedia();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />

        <FeaturedCollages media={media} onOpen={openItem} />

        <section className="intro" id="about" aria-label="Portfolio introduction">
          <p>
            Select a section, open a category, and move through each story with a smooth
            horizontal carousel.
          </p>
          <div className="status" role="status">
            {status} Showing {totalItems} portfolio item{totalItems === 1 ? "" : "s"}.
          </div>
        </section>

        <section className="kind-words" id="kind-words">
          <p className="eyebrow">Your kind words</p>
          <h2>Stories preserved with care.</h2>
          <p>
            A quiet, elegant space for wedding films, photography, and family milestones.
          </p>
        </section>

        <section className="contact" id="contact">
          <p className="eyebrow">Bookings & collaborations</p>
          <h2>Bring the next story into frame.</h2>
          <div className="contact-actions">
            <a href="https://www.instagram.com/camdownproductions/" target="_blank" rel="noreferrer">
              Camdown Instagram
            </a>
          </div>
        </section>
      </main>

      <footer>
        <a href="#top">Back to top</a>
        <span>Camdown Productions</span>
      </footer>
      <Lightbox
        item={activeItem}
        onClose={closeLightbox}
        onNext={nextItem}
        onPrevious={previousItem}
        total={allItems.length}
        current={activeIndex || 0}
      />
    </>
  );
}

export default App;
