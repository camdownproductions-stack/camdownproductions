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

const defaultContent = {
  navigation: {
    left: [
      { label: "Home", href: "#top" },
      { label: "About", href: "#about" }
    ],
    portfolio: [
      { label: "Wedding Photography", href: "#photos" },
      { label: "Wedding Films", href: "#videos" },
      { label: "PreWedding Films", href: "#prewedding-films" },
      { label: "PreWedding Pictures", href: "#prewedding-pictures" },
      { label: "Maternity Videos", href: "#maternity-videos" },
      { label: "Maternity Pictures", href: "#maternity-pictures" }
    ],
    right: [
      { label: "Portfolio", href: "#portfolio" },
      { label: "Blogs", href: "#blogs" },
      { label: "Kind Words", href: "#kind-words" },
      { label: "Contact", href: "#contact" }
    ]
  },
  brand: {
    title: "Camdown",
    subtitle: "Productions",
    tagline: "Beautiful films... beautiful frames"
  },
  hero: {
    eyebrow: "Beautiful films... beautiful frames",
    title: "Camdown Productions",
    body: "Wedding films, photographs, and intimate milestones arranged into a timeless portfolio experience.",
    cta: "Explore portfolio"
  },
  intro: {
    body: "Select a section, open a category, and move through each story with a smooth horizontal carousel."
  },
  collages: {
    eyebrow: "Featured stories",
    title: "Recent Collages"
  },
  kindWords: {
    eyebrow: "Your kind words",
    title: "Stories preserved with care.",
    body: "A quiet, elegant space for wedding films, photography, and family milestones."
  },
  contact: {
    eyebrow: "Bookings & collaborations",
    title: "Bring the next story into frame.",
    instagramLabel: "Camdown Instagram",
    instagramUrl: "https://www.instagram.com/camdownproductions/"
  },
  blogs: [
    {
      title: "Planning a Cinematic Wedding Film",
      category: "Wedding Films",
      excerpt: "A short guide to choosing moments, locations, and pacing for a film that feels personal.",
      image: "",
      url: "#contact"
    },
    {
      title: "Pre-Wedding Session Ideas",
      category: "Pre-Wedding",
      excerpt: "Simple ways to shape a pre-wedding shoot around your story, not a template.",
      image: "",
      url: "#portfolio"
    }
  ]
};

function mergeContent(content) {
  return {
    ...defaultContent,
    ...content,
    navigation: {
      ...defaultContent.navigation,
      ...(content.navigation || {})
    },
    brand: {
      ...defaultContent.brand,
      ...(content.brand || {})
    },
    hero: {
      ...defaultContent.hero,
      ...(content.hero || {})
    },
    intro: {
      ...defaultContent.intro,
      ...(content.intro || {})
    },
    collages: {
      ...defaultContent.collages,
      ...(content.collages || {})
    },
    kindWords: {
      ...defaultContent.kindWords,
      ...(content.kindWords || {})
    },
    contact: {
      ...defaultContent.contact,
      ...(content.contact || {})
    },
    blogs: content.blogs || defaultContent.blogs
  };
}

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

async function loadSiteContent() {
  const response = await fetch(`${import.meta.env.BASE_URL}site-content.json`, {
    cache: "no-store"
  });

  if (!response.ok) return defaultContent;

  return mergeContent(await response.json());
}

async function fetchDriveFolder(folderId, apiKey, sectionId) {
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

  return (data.files || []).filter((file) =>
    sectionId === "photos"
      ? file.mimeType?.startsWith("image/")
      : file.mimeType?.startsWith("video/")
  );
}

function Header({ content }) {
  return (
    <header className="site-header" id="top">
      <nav className="nav-group nav-left" aria-label="Primary navigation left">
        {content.navigation.left.map((item) => (
          <a href={item.href} key={`${item.label}-${item.href}`}>
            {item.label}
          </a>
        ))}
        <div className="menu-dropdown">
          <a className="dropdown-trigger" href="#portfolio">Portfolio</a>
          <div className="dropdown-panel" aria-label="Portfolio submenu">
            {content.navigation.portfolio.map((item) => (
              <a href={item.href} key={`${item.label}-${item.href}`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <a className="brand" href="#top" aria-label="Camdown Productions home">
        <span>{content.brand.title}</span>
        <strong>{content.brand.subtitle}</strong>
        <small>{content.brand.tagline}</small>
      </a>
      <nav className="nav-group nav-right" aria-label="Primary navigation right">
        {content.navigation.right.map((item) => (
          <a href={item.href} key={`${item.label}-${item.href}`}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero({ content }) {
  return (
    <section className="hero">
      <div className="hero-frame" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1>{content.hero.title}</h1>
        <p>{content.hero.body}</p>
        <a className="hero-link" href="#portfolio">
          {content.hero.cta}
        </a>
      </div>
    </section>
  );
}

function MediaCard({ item, categoryLabel, galleryItems, onOpen }) {
  const title = cleanName(item.name);
  const video = isVideo(item);

  return (
    <article className="media-card">
      <button className="media-thumb" type="button" onClick={() => onOpen(item, galleryItems)}>
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

function FeaturedCollages({ content, media, onOpen }) {
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
        <p className="eyebrow">{content.collages.eyebrow}</p>
        <h2>{content.collages.title}</h2>
      </div>
      <div className="collage-groups">
        {sections.map((section) => {
          const tiles = section.categories.flatMap((category) =>
            (media[section.id]?.[category.id] || []).slice(0, 3).map((item, itemIndex) => ({
              ...item,
              categoryLabel: category.label,
              sectionLabel: section.title,
              anchorId: itemIndex === 0 ? anchorFor(section.id, category.id) : undefined
            }))
          );
          const visibleTiles = tiles.slice(0, 6);

          return (
            <article className="collage-group" id={section.id} key={section.id}>
              <div className="collage-heading">
                <p className="eyebrow">{section.eyebrow}</p>
                <h3>{section.title}</h3>
              </div>
              <div className="collage-grid">
                {visibleTiles.map((item, index) => (
                  <button
                    className={`collage-tile tile-${index + 1}`}
                    id={item.anchorId || undefined}
                    type="button"
                    key={`${section.id}-${item.categoryLabel}-${item.id}`}
                    onClick={() => onOpen(item, visibleTiles)}
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
  const galleryItems = items.map((item) => ({
    ...item,
    categoryLabel: category.label
  }));

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
          {galleryItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              categoryLabel={category.label}
              galleryItems={galleryItems}
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
        <button className="lightbox-close" type="button" onClick={onClose} aria-label="Close popup">
          <span aria-hidden="true">x</span>
        </button>
        <button className="lightbox-nav lightbox-prev" type="button" onClick={onPrevious} aria-label="Previous item">
          Previous
        </button>
        <button className="lightbox-nav lightbox-next" type="button" onClick={onNext} aria-label="Next item">
          Next
        </button>
        {video && embed ? (
          <iframe title={title} src={embed} allow="autoplay; fullscreen" allowFullScreen />
        ) : (
          <img src={imageUrl(item, title)} alt={title} />
        )}
        <div>
          <p className="meta">
            <span>{video ? "Video" : "Photo"}{item.categoryLabel ? ` / ${item.categoryLabel}` : ""}</span>
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

function BlogSection({ blogs }) {
  if (!blogs.length) return null;

  return (
    <section className="blogs" id="blogs">
      <div className="section-heading">
        <p className="eyebrow">Journal</p>
        <h2>Blogs</h2>
      </div>
      <div className="blog-grid">
        {blogs.map((blog, index) => (
          <article className="blog-card" key={`${blog.title}-${index}`}>
            <img src={blog.image || heroPlaceholder(blog.category || "Blog", "warm")} alt={blog.title} />
            <div>
              <p className="meta">
                <span>{blog.category || "Blog"}</span>
                <span>Story</span>
              </p>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              {blog.url ? (
                <a href={blog.url} target={blog.url.startsWith("#") ? undefined : "_blank"} rel="noreferrer">
                  Read more
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [media, setMedia] = useState(fallbackMedia);
  const [content, setContent] = useState(mergeContent({}));
  const [status, setStatus] = useState("Preparing Google Drive gallery...");
  const [activeGallery, setActiveGallery] = useState([]);
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

  const activeItem = activeIndex === null ? null : activeGallery[activeIndex];

  function openItem(item, galleryItems = allItems) {
    const nextGallery = galleryItems.length ? galleryItems : allItems;
    const index = nextGallery.findIndex(
      (candidate) => candidate.id === item.id && candidate.name === item.name
    );
    setActiveGallery(nextGallery);
    setActiveIndex(index >= 0 ? index : 0);
  }

  function closeLightbox() {
    setActiveIndex(null);
    setActiveGallery([]);
  }

  function nextItem() {
    setActiveIndex((index) => (index === null ? 0 : (index + 1) % activeGallery.length));
  }

  function previousItem() {
    setActiveIndex((index) =>
      index === null ? 0 : (index - 1 + activeGallery.length) % activeGallery.length
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
              const files = await fetchDriveFolder(folderId, apiKey, section.id);
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

  useEffect(() => {
    async function loadContent() {
      setContent(await loadSiteContent());
    }

    loadContent();
  }, []);

  useEffect(() => {
    if (!activeItem) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") nextItem();
      if (event.key === "ArrowLeft") previousItem();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem, activeGallery.length]);

  return (
    <>
      <Header content={content} />
      <main>
        <Hero content={content} />

        <FeaturedCollages content={content} media={media} onOpen={openItem} />

        <section className="intro" id="about" aria-label="Portfolio introduction">
          <p>{content.intro.body}</p>
          <div className="status" role="status">
            {status} Showing {totalItems} portfolio item{totalItems === 1 ? "" : "s"}.
          </div>
        </section>

        <div className="portfolio-wrap">
          {sections.map((section) => (
            <PortfolioSection
              key={section.id}
              section={section}
              media={media}
              onOpen={openItem}
            />
          ))}
        </div>

        <section className="kind-words" id="kind-words">
          <p className="eyebrow">{content.kindWords.eyebrow}</p>
          <h2>{content.kindWords.title}</h2>
          <p>{content.kindWords.body}</p>
        </section>

        <BlogSection blogs={content.blogs} />

        <section className="contact" id="contact">
          <p className="eyebrow">{content.contact.eyebrow}</p>
          <h2>{content.contact.title}</h2>
          <div className="contact-actions">
            <a href={content.contact.instagramUrl} target="_blank" rel="noreferrer">
              {content.contact.instagramLabel}
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
        total={activeGallery.length}
        current={activeIndex || 0}
      />
    </>
  );
}

export default App;
