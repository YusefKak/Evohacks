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
  | "contact"
  | "code-of-conduct"
  | "privacy";

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
  type = "button",
}: {
  children: ReactNode;
  secondary?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
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
    ["◫", "Date", "TBD, 2026"],
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
            <h3>EvoHacks Premiere</h3>

            <p>
              Theme: <strong>Will be revealed on the day of the event!</strong> · TBD, 2026
            </p>

            <p>
              Build a project that... (HIDDEN)
            </p>
          </div>

          <div className="button-row">
            <Button onClick={openRegistration}>
              Register Now
            </Button>

            <div className="hero-buttons">
            <Button onClick={openRegistration}>
              Register Now
            </Button>

            <Button
              secondary
              onClick={() =>
                window.open("https://discord.gg/MVsRk2hyW5", "_blank")
              }
            >
              Join Discord
            </Button>
          </div>

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
            <span>TBD, 2026</span>
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

  return (
    <main className="page">
      <Reveal>
        <h1>Reach Out to Us</h1>

        <p className="lead">
          Have a question or want to help with EvoHacks? Send us a message.
        </p>
      </Reveal>

      <Reveal className="contact-layout">
        <form
            className="contact-form"
            action="https://formspree.io/f/xojglbzd"
            method="POST"
          >
          <div className="form-row">
            <label>
              First name <span>*</span>
              <input 
              type="text"
              name="firstName"
              required />
            </label>

            <label>
              Last name <span>*</span>
              <input 
              type="text"
              name="lastName"
              required />
            </label>
          </div>

          <div className="form-row">
            <label>
              Email <span>*</span>
              <input 
              type="email" 
              name="email"
              required />
            </label>

            <label>
              School or organization
              <input 
              type="text"
              name="school"
              />
            </label>
          </div>

          <label>
            Reason for contacting
            <select 
            name="reason"
            defaultValue="">
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
            <textarea 
            name="message"
            rows={7} 
            required />
          </label>

          <Button type="submit">Send message</Button>
        </form>

        <Card className="contact-information">
          <h2>Other ways to reach us</h2>

          <p>✉ evohacks2026@gmail.com</p>
          <p>◌ https://discord.gg/MVsRk2hyW5</p>
          <p>◎ https://www.instagram.com/evohacks2026/</p>
          <p>◫ EvoHacks</p>
          <p>⌘ github.com/YusefKak/Evohacks</p>

          <small>We usually respond within 2–3 business days.</small>
        </Card>
      </Reveal>
    </main>
  );
}

function CodeOfConductPage() {
  return (
    <main className="page legal-page">
      <Reveal>
        <div className="section-label">EvoHacks Policies</div>
        <h1>Code of Conduct</h1>
        <p className="legal-updated">Last updated: July 21, 2026</p>

        <p className="lead">
          EvoHacks is committed to providing a safe, welcoming, and respectful
          environment where high school students can learn, collaborate, and
          build projects.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>1. Who this applies to</h2>

        <p>
          This Code of Conduct applies to all EvoHacks participants, organizers,
          volunteers, mentors, judges, speakers, sponsors, and guests.
        </p>

        <p>
          It applies in all spaces connected to EvoHacks, including the website,
          registration forms, Discord server, workshops, video calls, judging
          sessions, direct messages related to the event, and project
          presentations.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>2. Expected behavior</h2>

        <p>Everyone involved with EvoHacks is expected to:</p>

        <ul>
          <li>Treat others with respect and patience.</li>
          <li>Welcome beginners and people with different experience levels.</li>
          <li>Give helpful and constructive feedback.</li>
          <li>Respect personal boundaries and privacy.</li>
          <li>Follow organizer, mentor, and moderator instructions.</li>
          <li>Communicate honestly about project contributions.</li>
          <li>Help create a safe and supportive learning environment.</li>
        </ul>
      </Reveal>

      <Reveal className="legal-section">
        <h2>3. Unacceptable behavior</h2>

        <p>The following behavior is not allowed:</p>

        <ul>
          <li>Bullying, harassment, discrimination, or intimidation.</li>
          <li>Hate speech or personal attacks.</li>
          <li>Threatening or encouraging harmful behavior.</li>
          <li>Sharing sexual, violent, or otherwise inappropriate content.</li>
          <li>Repeated unwanted messages or contact.</li>
          <li>Sharing another person&apos;s private information without permission.</li>
          <li>Impersonating another participant, organizer, judge, or sponsor.</li>
          <li>Spamming, disrupting workshops, or interfering with the event.</li>
          <li>Cheating, plagiarism, or misrepresenting who created a project.</li>
          <li>Attempting to access accounts, systems, or data without permission.</li>
        </ul>
      </Reveal>

      <Reveal className="legal-section">
        <h2>4. Project integrity</h2>

        <p>
          Participants must honestly describe what they built and what each team
          member contributed.
        </p>

        <ul>
          <li>
            Projects must follow the rules and submission deadlines published
            for the event.
          </li>
          <li>
            Open-source libraries, APIs, templates, and other outside resources
            may be used when permitted and should be credited.
          </li>
          <li>
            Participants may not submit another person&apos;s project as their own.
          </li>
          <li>
            Participants must disclose significant work completed before the
            hackathon if pre-existing work is allowed.
          </li>
          <li>
            Projects must not intentionally contain malware, credential theft,
            harmful tracking, or unauthorized data collection.
          </li>
        </ul>
      </Reveal>

      <Reveal className="legal-section">
        <h2>5. Artificial intelligence policy</h2>

        <p>
          AI tools may be used for brainstorming, learning, debugging, explaining
          concepts, and assisting with specific parts of a project when allowed
          by the event rules.
        </p>

        <p>Participants are still responsible for their submissions.</p>

        <ul>
          <li>Teams must understand the code and content they submit.</li>
          <li>Teams must be able to explain how their project works.</li>
          <li>
            Teams should disclose major AI tools used during development when
            requested.
          </li>
          <li>
            A project produced almost entirely by AI without meaningful student
            contribution may be disqualified.
          </li>
          <li>
            AI may not be used to impersonate another person, create deceptive
            submissions, or violate this Code of Conduct.
          </li>
        </ul>
      </Reveal>

      <Reveal className="legal-section">
        <h2>6. Reporting a concern</h2>

        <p>
          Anyone who experiences or witnesses a possible violation should contact
          the EvoHacks team at:
        </p>

        <p>
          <a href="mailto:evohacks2026@gmail.com">evohacks2026@gmail.com</a>
        </p>

        <p>
          Include as much useful information as you safely can, such as what
          happened, where it happened, when it happened, and any relevant
          screenshots or messages.
        </p>

        <p>
          Reports will be reviewed as privately as reasonably possible. However,
          information may need to be shared with organizers, platform moderators,
          a parent or guardian, or appropriate authorities when needed to address
          safety concerns.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>7. Enforcement</h2>

        <p>
          EvoHacks organizers may take action based on the seriousness and
          circumstances of a violation.
        </p>

        <p>Possible actions include:</p>

        <ul>
          <li>A private reminder or warning.</li>
          <li>Removal of content or messages.</li>
          <li>Removal from a workshop, server, or event space.</li>
          <li>Project disqualification.</li>
          <li>Temporary or permanent removal from EvoHacks.</li>
          <li>
            Contacting a parent, guardian, school representative, platform
            moderator, or appropriate authority when necessary.
          </li>
        </ul>
      </Reveal>

      <Reveal className="legal-section">
        <h2>8. Immediate safety concerns</h2>

        <p>
          EvoHacks organizers are not emergency responders. Anyone facing an
          immediate danger should contact local emergency services or a trusted
          adult.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>9. Agreement</h2>

        <p>
          By participating in EvoHacks, you agree to follow this Code of Conduct
          and the other rules published for the event.
        </p>
      </Reveal>
    </main>
  );
}

function PrivacyPolicyPage() {
  return (
    <main className="page legal-page">
      <Reveal>
        <div className="section-label">EvoHacks Policies</div>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: July 21, 2026</p>

        <p className="lead">
          This Privacy Policy explains what information EvoHacks collects, why
          we collect it, and how it may be used.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>1. Information we may collect</h2>

        <p>
          When someone registers for or participates in EvoHacks, we may collect:
        </p>

        <ul>
          <li>Name.</li>
          <li>Email address.</li>
          <li>School name.</li>
          <li>Grade level.</li>
          <li>Country or general region.</li>
          <li>Team name and teammate information.</li>
          <li>Discord username, when provided.</li>
          <li>Project information and submission links.</li>
          <li>Answers submitted through registration or feedback forms.</li>
          <li>Parent or guardian contact information when required.</li>
          <li>
            Communications sent to EvoHacks, including support requests or
            reports.
          </li>
        </ul>

        <p>
          We ask participants not to submit unnecessary sensitive information,
          home addresses, passwords, government identification numbers, or
          financial information.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>2. How we collect information</h2>

        <p>Information may be collected through:</p>

        <ul>
          <li>Google Forms and Google Sheets.</li>
          <li>Email communications.</li>
          <li>Devpost or another project-submission platform.</li>
          <li>Discord or other community platforms.</li>
          <li>Event surveys and feedback forms.</li>
          <li>Project submissions, presentations, and judging materials.</li>
        </ul>
      </Reveal>

      <Reveal className="legal-section">
        <h2>3. How we use information</h2>

        <p>We may use participant information to:</p>

        <ul>
          <li>Process registrations.</li>
          <li>Verify eligibility.</li>
          <li>Communicate event announcements and schedule changes.</li>
          <li>Help participants form or manage teams.</li>
          <li>Operate workshops, judging, and project submissions.</li>
          <li>Respond to questions, reports, and support requests.</li>
          <li>Send certificates or distribute prizes.</li>
          <li>Prevent fraud, abuse, cheating, or rule violations.</li>
          <li>Improve future EvoHacks events.</li>
        </ul>
      </Reveal>

      <Reveal className="legal-section">
        <h2>4. How information may be shared</h2>

        <p>
          EvoHacks does not sell participant personal information.
        </p>

        <p>
          Information may be shared only when reasonably necessary with:
        </p>

        <ul>
          <li>EvoHacks organizers and authorized volunteers.</li>
          <li>Judges who need project information for evaluation.</li>
          <li>
            Sponsors or prize providers when necessary to deliver a prize and
            with appropriate notice.
          </li>
          <li>Service providers used to operate the event.</li>
          <li>
            A parent, guardian, school representative, platform moderator, or
            appropriate authority when necessary for safety or rule enforcement.
          </li>
          <li>
            Authorities when required by law or when reasonably necessary to
            address an immediate safety concern.
          </li>
        </ul>

        <p>
          Public project information, such as a project name, team name, demo,
          description, or winner announcement, may be displayed on the EvoHacks
          website or social media. Participants will be informed when project
          information may be made public.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>5. Third-party services</h2>

        <p>
          EvoHacks may use third-party services such as Google Forms, Google
          Sheets, GitHub, Discord, Devpost, email providers, and video meeting
          platforms.
        </p>

        <p>
          These services operate under their own terms and privacy policies.
          EvoHacks does not control every action taken by those services.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>6. Information about minors</h2>

        <p>
          EvoHacks is designed for high school students, many of whom may be
          under 18.
        </p>

        <p>
          Participants should obtain permission from a parent or guardian when
          required by their age, location, school, prize eligibility, or the
          rules of a third-party platform.
        </p>

        <p>
          EvoHacks does not knowingly request unnecessary sensitive information
          from minors. A parent or guardian may contact us regarding a
          participant&apos;s information.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>7. Data retention</h2>

        <p>
          We keep information only for as long as reasonably necessary to operate
          the event, distribute certificates or prizes, resolve disputes, prevent
          abuse, and plan future events.
        </p>

        <p>
          Some basic records may be retained for administrative purposes. Data
          that is no longer reasonably needed may be deleted or anonymized.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>8. Data security</h2>

        <p>
          EvoHacks takes reasonable steps to limit access to participant
          information and protect the accounts used to store it.
        </p>

        <p>
          However, no website, form, email service, or online storage system can
          guarantee complete security.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>9. Your choices</h2>

        <p>
          A participant, parent, or guardian may contact EvoHacks to request:
        </p>

        <ul>
          <li>Access to information they submitted.</li>
          <li>Correction of inaccurate information.</li>
          <li>Deletion of information, when reasonably possible.</li>
          <li>Withdrawal from non-essential event communications.</li>
        </ul>

        <p>
          Some information may need to be retained when required for safety,
          dispute resolution, prize administration, or other legitimate
          administrative purposes.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>10. Changes to this policy</h2>

        <p>
          EvoHacks may update this Privacy Policy when the event, registration
          process, or services we use change.
        </p>

        <p>
          The latest version will be posted on this website with an updated
          revision date.
        </p>
      </Reveal>

      <Reveal className="legal-section">
        <h2>11. Contact us</h2>

        <p>
          Questions or privacy requests may be sent to:
        </p>

        <p>
          <a href="mailto:evohacks2026@gmail.com">evohacks2026@gmail.com</a>
        </p>
      </Reveal>
    </main>
  );
}

function Footer({ changePage }: { changePage: (page: Page) => void }) {
  function goToPage(targetPage: Page) {
    changePage(targetPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-about">
          <button
            type="button"
            className="footer-logo"
            onClick={() => goToPage("home")}
          >
            <div className="small-logo">
              <span />
              <span />
              <span />
            </div>

            <strong>EvoHacks</strong>
          </button>

          <p>
            An online hackathon for high school students to build, learn, and
            collaborate on technology projects.
          </p>

          <div className="footer-socials">
            <a href="mailto:evohacks2026@gmail.com" aria-label="Email EvoHacks">
              ✉
            </a>

            <a
              href="https://github.com/YusefKak/Evohacks"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EvoHacks GitHub"
            >
              ⌘
            </a>

            <a href="#" aria-label="EvoHacks social media">
              ◎
            </a>

            <a href="#" aria-label="EvoHacks community">
              ◫
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>

          {navigation.map((item) => (
            <button
              type="button"
              key={item.page}
              onClick={() => goToPage(item.page)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="footer-column">
          <h3>Info</h3>

          <a className="footer-email" href="evohacks2026@gmail.com">
            evohacks2026@gmail.com
          </a>

          <button
            type="button"
            onClick={() => goToPage("code-of-conduct")}
          >
            Code of Conduct
          </button>

          <button type="button" onClick={() => goToPage("privacy")}>
            Privacy Policy
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2027 EvoHacks. Built by students, for students.</p>

        <p>Online · Free · Open to high school students</p>
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
        {page === "code-of-conduct" && <CodeOfConductPage />}
        {page === "privacy" && <PrivacyPolicyPage />}
      </div>

      <Footer changePage={setPage} />
    </div>
  );
}