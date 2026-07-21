import { useEffect, useRef, useState, type ReactNode } from "react";
import "./App.css";

const REGISTRATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScUbbMYEwPvom53GUXhHfZ9HG2YvZzGwOeLkhnKHqnKqwq1AQ/viewform?usp=publish-editor";

function openRegistration() {
  window.location.href = REGISTRATION_URL;
}

type Page =
  | "home"
  | "about"
  | "hackathons"
  | "sponsors"
  | "faq"
  | "contact";

type NavItem = {
  label: string;
  page: Page;
};

const navigation: NavItem[] = [
  { label: "Home", page: "home" },
  { label: "About", page: "about" },
  { label: "Hackathons", page: "hackathons" },
  { label: "Sponsors", page: "sponsors" },
  { label: "FAQ", page: "faq" },
  { label: "Reach Out", page: "contact" },
];

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("visible");
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={elementRef} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    const rotateY = ((x / bounds.width) - 0.5) * 10;
    const rotateX = ((y / bounds.height) - 0.5) * -10;

    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
      scale(1.02)
    `;
  }

  function resetCard() {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    card.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
  }

  return (
    <div
      ref={cardRef}
      className={`card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetCard}
      onMouseDown={(event) => {
        event.currentTarget.style.transform =
          "perspective(900px) scale(0.97)";
      }}
      onMouseUp={resetCard}
    >
      {children}
    </div>
  );
}

function Button({
  children,
  secondary = false,
  onClick,
}: {
  children: ReactNode;
  secondary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`button ${secondary ? "button-secondary" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Navbar({
  page,
  changePage,
}: {
  page: Page;
  changePage: (page: Page) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(targetPage: Page) {
    changePage(targetPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="navbar">
      <button className="brand" onClick={() => navigate("home")}>
        <div className="small-logo">
          <span />
          <span />
          <span />
        </div>

        <strong>EvoHacks</strong>
      </button>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((current) => !current)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
        {navigation.map((item) => (
          <button
            key={item.page}
            className={page === item.page ? "active" : ""}
            onClick={() => navigate(item.page)}
          >
            {item.label}
          </button>
        ))}

        <Button onClick={openRegistration}>
          Register
        </Button>
      </nav>
    </header>
  );
}

function HomePage({ changePage }: { changePage: (page: Page) => void }) {
  const benefits = [
    {
      icon: "⚙",
      title: "Build a real project",
      text: "Turn an idea into something that works using code, design, or hardware.",
    },
    {
      icon: "◉",
      title: "Meet other students",
      text: "Team up with high school students from around the world.",
    },
    {
      icon: "▣",
      title: "Learn from mentors",
      text: "Get support from mentors and volunteers throughout the event.",
    },
    {
      icon: "✦",
      title: "Attend workshops",
      text: "Learn useful tools, frameworks, and techniques.",
    },
    {
      icon: "♛",
      title: "Win prizes",
      text: "Compete for sponsor prizes across different categories.",
    },
    {
      icon: "⌁",
      title: "Gain experience",
      text: "Add a real project to your portfolio, résumé, or applications.",
    },
  ];

  const facts = [
    ["◫", "Date", "March 14–16, 2027"],
    ["◎", "Format", "Online event"],
    ["$", "Cost", "Free to join"],
    ["⌂", "Who", "High school students"],
    ["◉", "Teams", "Up to 4 people"],
  ];

  return (
    <>
      <main className="hero">
        <div className="hero-content">
          <div className="badge">Online hackathon · High school students</div>

          <h1>
            Build. Learn. <span>Innovate.</span>
          </h1>

          <p>
            EvoHacks is an online hackathon where high school students work
            together, learn new skills, and build creative technology
            projects.
          </p>

          <div className="button-row">
            <Button onClick={openRegistration}>
              Register Now
            </Button>

            <Button secondary onClick={() => changePage("about")}>
              Learn More
            </Button>
          </div>
        </div>

        <div className="logo-scene">
          <div className="large-logo">
            <div className="logo-parts">
              <span />
              <span />
              <span />
            </div>

            <div className="logo-text">EVO HACKS</div>
          </div>
        </div>
      </main>

      <Reveal className="facts-grid">
        {facts.map(([icon, label, value]) => (
          <Card key={label}>
            <div className="icon">{icon}</div>
            <small>{label}</small>
            <strong>{value}</strong>
          </Card>
        ))}
      </Reveal>

      <Reveal className="section">
        <div className="section-label">Why join</div>
        <h2>A real project, from start to finish</h2>

        <p className="lead">
          EvoHacks is a chance to try something new, meet other students, and
          finish a project you are proud of.
        </p>

        <div className="three-column-grid">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <div className="icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal className="section">
        <div className="section-label">How it works</div>
        <h2>Four simple steps</h2>

        <div className="four-column-grid">
          {[
            [
              "Register",
              "Sign up using your school information and interests.",
            ],
            [
              "Join or create a team",
              "Work with friends or meet teammates through our community.",
            ],
            [
              "Build your project",
              "Create your project with help from mentors and workshops.",
            ],
            [
              "Submit and present",
              "Show your work to judges and the EvoHacks community.",
            ],
          ].map(([title, description], index) => (
            <Card key={title}>
              <div className="step-number">{index + 1}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal className="section">
        <div className="section-label">Upcoming</div>
        <h2>Our next hackathon</h2>

        <Card className="event-card">
          <div>
            <span className="tag">Upcoming</span>
            <h3>EvoHacks I</h3>

            <p>
              Theme: <strong>Build for Learning</strong> · March 14–16, 2027
            </p>

            <p>
              Build a project that helps students learn something new.
            </p>
          </div>

          <div className="button-row">
            <Button onClick={openRegistration}>
              Register Now
            </Button>

            <Button secondary onClick={() => changePage("hackathons")}>
              View details
            </Button>
          </div>
        </Card>
      </Reveal>

      <Reveal className="section">
        <div className="section-label">Sponsors</div>
        <h2>Powered by supporters</h2>

        <p className="lead">
          Companies and organizations that help students receive prizes,
          tools, workshops, and mentorship.
        </p>

        <div className="sponsor-grid">
          {[1, 2, 3, 4, 5].map((number) => (
            <Card key={number} className="sponsor-placeholder">
              Sponsor logo
            </Card>
          ))}
        </div>

        <div className="center">
          <Button onClick={() => changePage("sponsors")}>
            Become a Sponsor
          </Button>
        </div>
      </Reveal>

      <Reveal className="section">
        <div className="cta">
          <h2>Ready to start building?</h2>

          <p>
            Sign up for EvoHacks or reach out with a question. We are happy to
            help.
          </p>

          <div className="button-row centered">
            <Button onClick={openRegistration}>
              Register Now
            </Button>

            <Button secondary onClick={() => changePage("contact")}>
              Reach Out
            </Button>
          </div>
        </div>
      </Reveal>
    </>
  );
}

function AboutPage() {
  const values = [
    ["▣", "Learning", "Growing through building."],
    ["◉", "Teamwork", "Helping each other out."],
    ["✦", "Creativity", "Trying new ideas."],
    ["◇", "Honesty", "Owning your work."],
    ["◎", "Accessibility", "Open to everyone."],
  ];

  return (
    <main className="page">
      <Reveal>
        <h1>About EvoHacks</h1>

        <p className="lead">
          EvoHacks is a student-run online hackathon built for high school
          students. We created it as a welcoming place to build real projects
          with other students.
        </p>
      </Reveal>

      <Reveal className="about-grid">
        <div>
          <h2>Why we made this</h2>

          <p>
            Many hackathons feel intimidating when you are new. EvoHacks is
            designed for high school students who want to learn by actually
            building something.
          </p>
        </div>

        <div>
          <h2>Who can join</h2>

          <p>
            Any high school student can participate. Beginners are welcome and
            no previous hackathon experience is required.
          </p>
        </div>

        <div>
          <h2>The goal</h2>

          <p>
            We want students to learn through real projects from start to
            finish. What you learned matters more than having a perfect demo.
          </p>
        </div>

        <div>
          <h2>Honesty matters</h2>

          <p>
            AI can help with brainstorming and debugging, but participants must
            understand and explain everything they submit.
          </p>
        </div>
      </Reveal>

      <Reveal className="section no-side-padding">
        <div className="section-label">What we care about</div>
        <h2>Our values</h2>

        <div className="five-column-grid">
          {values.map(([icon, title, description]) => (
            <Card key={title}>
              <div className="icon">{icon}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </Card>
          ))}
        </div>
      </Reveal>
    </main>
  );
}

function HackathonsPage() {
  return (
    <main className="page">
      <Reveal>
        <h1>Hackathons</h1>

        <p className="lead">
          Everything we have run and what is coming up next.
        </p>
      </Reveal>

      <Reveal className="page-section">
        <h2>Upcoming</h2>

        <Card className="hackathon-card">
          <div className="event-top">
            <span className="tag">Upcoming</span>
            <span>March 14–16, 2027</span>
          </div>

          <h3>EvoHacks I</h3>

          <p>
            Theme: <strong>Build for Learning</strong>
          </p>

          <p>
            Build a project that helps students learn something new.
          </p>

          <div className="button-row">
            <Button onClick={openRegistration}>
              Register
            </Button>
            <Button secondary>View details</Button>
          </div>
        </Card>
      </Reveal>

      <Reveal className="page-section">
        <h2>Current</h2>
        <p>Nothing here yet.</p>

        <h2 className="spaced-heading">Past</h2>
        <p>Completed events will appear here.</p>
      </Reveal>
    </main>
  );
}

function SponsorsPage() {
  return (
    <main className="page">
      <Reveal>
        <h1>Support EvoHacks</h1>

        <p className="lead">
          Help high school students learn, build, and explore technology.
        </p>
      </Reveal>

      <Reveal className="page-section">
        <div className="section-label">Why sponsor</div>
        <h2>Reach the next generation of builders</h2>

        <div className="three-column-grid">
          <Card>
            <h3>Support learning</h3>
            <p>Give students their first real project experience.</p>
          </Card>

          <Card>
            <h3>Community impact</h3>
            <p>Reach motivated high school students around the world.</p>
          </Card>

          <Card>
            <h3>Direct connection</h3>
            <p>Meet participants through workshops and mentorship.</p>
          </Card>
        </div>
      </Reveal>

      <Reveal className="page-section">
        <div className="section-label">Ways to sponsor</div>
        <h2>Sponsorship options</h2>

        <div className="three-column-grid">
          <Card>
            <h3>Prize sponsor</h3>
            <p>Provide prizes, subscriptions, products, or credits.</p>
          </Card>

          <Card>
            <h3>Workshop sponsor</h3>
            <p>Teach participants a useful technical skill.</p>
          </Card>

          <Card>
            <h3>Community partner</h3>
            <p>Promote the event to students, schools, and clubs.</p>
          </Card>
        </div>
      </Reveal>
    </main>
  );
}

const faqItems = [
  [
    "Who can participate?",
    "Any current high school student can participate.",
  ],
  ["Is EvoHacks free?", "Yes. EvoHacks is free for participants."],
  ["Is the event online?", "Yes. The entire event takes place online."],
  [
    "Can beginners join?",
    "Yes. Beginners are encouraged to participate.",
  ],
  ["Can I work alone?", "Yes. You may compete alone or join a team."],
  ["How do teams work?", "Teams may have up to four members."],
  [
    "Can I use AI?",
    "AI may help with brainstorming and debugging, but you must understand and explain your submission.",
  ],
  [
    "How are projects judged?",
    "Projects are judged on usefulness, creativity, technical work, learning, and presentation.",
  ],
  [
    "Will participants receive certificates?",
    "Eligible participants who submit a project will receive a digital certificate.",
  ],
];

function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  return (
    <main className="page">
      <Reveal>
        <h1>Frequently Asked Questions</h1>

        <p className="lead">
          Cannot find your answer? Reach out to our team.
        </p>
      </Reveal>

      <Reveal className="faq-list">
        {faqItems.map(([question, answer], index) => {
          const isOpen = openQuestion === index;

          return (
            <div
              key={question}
              className={`faq-item ${isOpen ? "faq-open" : ""}`}
            >
              <button
                onClick={() => setOpenQuestion(isOpen ? null : index)}
              >
                <span>{question}</span>
                <span className="faq-symbol">{isOpen ? "−" : "+"}</span>
              </button>

              <div className="faq-answer">
                <p>{answer}</p>
              </div>
            </div>
          );
        })}
      </Reveal>
    </main>
  );
}

function ContactPage() {
  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("Your message form is ready to connect to Formspree.");
  }

  return (
    <main className="page">
      <Reveal>
        <h1>Reach Out to Us</h1>

        <p className="lead">
          Have a question or want to help with EvoHacks? Send us a message.
        </p>
      </Reveal>

      <Reveal className="contact-layout">
        <form className="contact-form" onSubmit={submitForm}>
          <div className="form-row">
            <label>
              First name <span>*</span>
              <input required />
            </label>

            <label>
              Last name <span>*</span>
              <input required />
            </label>
          </div>

          <div className="form-row">
            <label>
              Email <span>*</span>
              <input type="email" required />
            </label>

            <label>
              School or organization
              <input />
            </label>
          </div>

          <label>
            Reason for contacting
            <select defaultValue="">
              <option value="" disabled>
                Select a reason
              </option>

              <option>General question</option>
              <option>Sponsorship</option>
              <option>Mentoring</option>
              <option>Judging</option>
              <option>Technical support</option>
            </select>
          </label>

          <label>
            Message
            <textarea rows={7} required />
          </label>

          <Button>Send message</Button>
        </form>

        <Card className="contact-information">
          <h2>Other ways to reach us</h2>

          <p>✉ evohacks2026@gmail.com</p>
          <p>◌ Discord:https://discord.gg/A77MhsWBRQ</p>
          <p>◎ @evohacks</p>
          <p>◫ EvoHacks</p>
          <p>⌘ github.com/YusefKak/Evohacks</p>

          <small>We usually respond within 2–3 business days.</small>
        </Card>
      </Reveal>
    </main>
  );
}

function Footer({ changePage }: { changePage: (page: Page) => void }) {
  return (
    <footer>
      <div className="footer-content">
        <div>
          <div className="footer-brand">
            <div className="small-logo">
              <span />
              <span />
              <span />
            </div>

            <strong>EvoHacks</strong>
          </div>

          <p>
            An online hackathon for high school students to build, learn, and
            collaborate on technology projects.
          </p>

          <div className="social-links">✉　⌘　◎　◫</div>
        </div>

        <div>
          <h3>Explore</h3>

          {navigation.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                changePage(item.page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div>
          <h3>Info</h3>
          <p>evohacks2026@gmail.com</p>
          <button>Code of Conduct</button>
          <button>Privacy Policy</button>
        </div>
      </div>

      <div className="copyright">
        © 2027 EvoHacks. Built by students, for students.
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="app">
      <Navbar page={page} changePage={setPage} />

      <div key={page} className="page-transition">
        {page === "home" && <HomePage changePage={setPage} />}
        {page === "about" && <AboutPage />}
        {page === "hackathons" && <HackathonsPage />}
        {page === "sponsors" && <SponsorsPage />}
        {page === "faq" && <FAQPage />}
        {page === "contact" && <ContactPage />}
      </div>

      <Footer changePage={setPage} />
    </div>
  );
}