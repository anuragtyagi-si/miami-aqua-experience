import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Compass,
  Heart,
  Instagram,
  MapPin,
  Menu,
  Play,
  Sun,
  Waves,
  X,
} from 'lucide-react';
import BookingFunnel from './BookingFunnel';
import { assetUrl } from './assets';
import { INSTAGRAM, SERVICES } from './booking';
import type { ServiceId } from './booking';

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Miami Aqua Experience home">
      <span className="brand-symbol">
        <Waves size={28} strokeWidth={1.6} />
      </span>
      <span>
        MIAMI AQUA<small>EXPERIENCE</small>
      </span>
    </a>
  );
}

export default function App() {
  const [service, setService] = useState<ServiceId>('wake');
  const [bookingVersion, setBookingVersion] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);
  const book = (id: ServiceId) => {
    setService(id);
    setBookingVersion((version) => version + 1);
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };
  const openVideo = () => {
    dialogRef.current?.showModal();
    void videoRef.current?.play().catch(() => {
      /* Native playback controls remain available. */
    });
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation" id="main-nav">
            {[
              ['Experiences', '#experiences'],
              ['Our vibe', '#our-vibe'],
              ['The moments', '#moments'],
              ['Good to know', '#faq'],
            ].map(([name, link]) => (
              <a key={link} href={link} onClick={() => setMenuOpen(false)}>
                {name}
              </a>
            ))}
          </nav>
          <a className="button button-small button-dark header-cta" href="#book">
            Let’s make waves <ArrowUpRight size={16} />
          </a>
          <button
            type="button"
            className="menu-toggle icon-button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot" /> MIAMI BEACH, FLORIDA
            </p>
            <h1>
              Life’s better <br />
              with a little
              <br />
              <span className="serif">saltwater.</span>
            </h1>
            <p className="hero-description">
              Find your balance. Chase a wave. Fly above the water.
              <br className="desktop-break" /> A different side of Miami is waiting for you.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#experiences">
                Find your experience <ArrowUpRight size={18} />
              </a>
              <button className="watch-button" type="button" onClick={openVideo}>
                <span>
                  <Play size={14} fill="currentColor" />
                </span>
                Catch the feeling
              </button>
            </div>
            <div className="hero-social">
              <div className="avatar-stack">
                <img src={assetUrl('coach.webp')} alt="" />
                <img src={assetUrl('wake.webp')} alt="" />
                <img src={assetUrl('friends.webp')} alt="" />
              </div>
              <div>
                <strong>Good people. Great water.</strong>
                <a href={INSTAGRAM} target="_blank" rel="noreferrer">
                  Join our 40K Instagram community <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-image"
              src={assetUrl('hero.webp')}
              alt="A Miami Aqua Experience wake surfer riding a turquoise wave off Miami Beach"
              width="720"
              height="1280"
              fetchPriority="high"
            />
            <div className="hero-location">
              <MapPin size={14} /> A LITTLE CLOSER TO PARADISE
            </div>
            <button
              type="button"
              className="hero-play"
              aria-label="Play Miami Aqua Experience surfing video"
              onClick={openVideo}
            >
              <Play size={25} fill="currentColor" strokeWidth={1} />
            </button>
            <div className="photo-caption">
              <span>
                Less ordinary.
                <br />
                <strong>More ocean.</strong>
              </span>
              <ArrowDown size={33} strokeWidth={1} />
            </div>
            <div className="sun-stamp">
              <Sun size={27} strokeWidth={1} />
              <span>
                ONLY GOOD
                <br />
                TIDES
              </span>
            </div>
          </div>
          <a href="#experiences" className="hero-scroll" aria-label="Scroll to experiences">
            <ArrowDown size={16} />
          </a>
        </section>
        <div className="promise-strip">
          <span>
            <Waves size={20} /> TWO WAYS TO FIND YOUR FLOW
          </span>
          <i />
          <span>
            <Sun size={20} /> MIAMI BEACH IS YOUR PLAYGROUND
          </span>
          <i />
          <span>
            <Heart size={18} /> REAL MOMENTS. NOTHING ORDINARY.
          </span>
        </div>
        <section id="experiences" className="experiences section-pad">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LESS WATCHING. MORE DOING.</p>
              <h2>
                Pick your kind <span className="serif">of blue.</span>
              </h2>
            </div>
            <p>
              Two incredible ways to get out there.
              <br />
              One very hard decision.
            </p>
          </div>
          <div className="experience-grid">
            {SERVICES.map((s, i) => (
              <article className="experience-card" key={s.id}>
                <div className="experience-photo">
                  <img
                    src={s.image}
                    alt={
                      s.id === 'wake'
                        ? 'A rider wake surfing with the Miami skyline behind her, from the company Instagram feed'
                        : 'A rider enjoying an electric board experience in Miami, from the company Instagram'
                    }
                    loading="lazy"
                    width="640"
                    height="800"
                  />
                  <span className="photo-pill">
                    <span>0{i + 1}</span>
                    {s.tag}
                  </span>
                  <span className="image-label">
                    {s.id === 'wake' ? 'FEEL THE WAVE' : 'DEFY THE EVERYDAY'}
                  </span>
                </div>
                <div className="experience-info">
                  <div className="experience-title">
                    <h3>{s.name}</h3>
                    <p>
                      $350<small>/ experience</small>
                    </p>
                  </div>
                  <p className="experience-description">{s.description}</p>
                  <div className="experience-bottom">
                    <span>
                      <Check size={15} />
                      {s.detail}
                    </span>
                    <button
                      type="button"
                      className="round-link"
                      aria-label={`Book ${s.name}`}
                      onClick={() => book(s.id)}
                    >
                      <ArrowUpRight size={22} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="experience-footnote">
            <Compass size={15} /> New to the water or already hooked? There’s a Miami moment for
            you.
          </p>
        </section>
        <section id="our-vibe" className="vibe-section section-pad">
          <div className="vibe-photo">
            <img
              src={assetUrl('coach.webp')}
              alt="Liz Vasquez smiling aboard a boat in Miami, from @miami.aquaexperience"
              width="640"
              height="800"
              loading="lazy"
            />
            <div className="vibe-photo-note">
              <span className="handwritten">Your next happy place.</span>
              <Waves size={29} />
            </div>
          </div>
          <div className="vibe-copy">
            <p className="eyebrow">THIS IS MIAMI AQUA EXPERIENCE</p>
            <h2>
              Not another day
              <br />
              <span className="serif">at the beach.</span>
            </h2>
            <p>
              We’re here for the first-time butterflies. The “one more ride.” The smile that stays
              with you long after the saltwater dries.
            </p>
            <p>
              Discover Miami from a whole new angle with Liz Vasquez and the Miami Aqua Experience
              community. Less on your phone. More in your element.
            </p>
            <div className="vibe-values">
              <div>
                <Waves />
                <span>
                  <strong>Find your own rhythm</strong>
                  <small>From chasing the wake to floating above it.</small>
                </span>
              </div>
              <div>
                <Sun />
                <span>
                  <strong>Make Miami a memory</strong>
                  <small>Sun on your face. A story worth telling.</small>
                </span>
              </div>
              <div>
                <Heart />
                <span>
                  <strong>Come for the water. Stay for the feeling.</strong>
                  <small>It’s more than a ride. It’s your kind of day.</small>
                </span>
              </div>
            </div>
            <a className="text-button" href="#book">
              Your next adventure is right here <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section id="moments" className="moments section-pad">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NO FILTER FOR THIS FEELING</p>
              <h2>
                Good days look <span className="serif">like this.</span>
              </h2>
            </div>
            <a className="instagram-link" href={INSTAGRAM} target="_blank" rel="noreferrer">
              <Instagram size={18} /> @miami.aquaexperience <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="moments-grid">
            {[
              {
                image: 'friends',
                alt: 'Friends wake surfing together at sunset',
                href: 'https://www.instagram.com/kgponce/reel/DYXZUJ7uJOs/',
                label: 'Better together.',
              },
              {
                image: 'hero',
                alt: 'Wake surfing with Miami Aqua Experience',
                href: 'https://www.instagram.com/miami.aquaexperience/reel/DdJk7drxqyr/',
                label: 'Find your flow.',
              },
              {
                image: 'efoil',
                alt: 'Electric board experience in Miami',
                href: 'https://www.instagram.com/miami.aquaexperience/reel/DfvVhHqRU24/',
                label: 'A different perspective.',
              },
              {
                image: 'crew',
                alt: 'A group of friends smiling on a Miami boat',
                href: 'https://www.instagram.com/miami.aquaexperience/p/Dc8s8WLkS9J/',
                label: 'Your kind of people.',
              },
            ].map((m) => (
              <a key={m.image} href={m.href} target="_blank" rel="noreferrer" className="moment">
                <img
                  src={assetUrl(`${m.image}.webp`)}
                  alt={m.alt}
                  width="640"
                  height="800"
                  loading="lazy"
                />
                <Instagram className="moment-icon" size={20} />
                <span>
                  {m.label}
                  <ArrowUpRight size={18} />
                </span>
              </a>
            ))}
          </div>
          <p className="media-credit">
            Real photos & footage from our Instagram. Real reasons to get out there.
          </p>
        </section>
        <BookingFunnel key={bookingVersion} service={service} onServiceChange={setService} />
        <section id="faq" className="faq-section section-pad">
          <div>
            <p className="eyebrow">A FEW THINGS BEFORE YOU DIVE IN</p>
            <h2>
              Good <span className="serif">to know.</span>
            </h2>
            <p>
              Still curious about something?
              <br />
              Find us on Instagram.
            </p>
            <a className="text-button" href={INSTAGRAM} target="_blank" rel="noreferrer">
              Meet us @miami.aquaexperience <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="faq-list">
            {[
              [
                'Do I need any experience?',
                'You don’t have to know your next favorite watersport already. Tell the team your comfort level before your real visit so they can help you choose the right experience and confirm any requirements.',
              ],
              [
                'What does each experience cost?',
                'Wake surfing is $350 per experience. E-foil / E-surf is $350 for a 2-hour experience. This preview uses that flat experience price and records your party size separately. Confirm group capacity and pricing with the team before a live booking.',
              ],
              [
                'What should I bring?',
                'Start with swimwear, a towel and sun protection. Before a live booking, confirm the meeting point, equipment and any age or swimming requirements with the Miami Aqua Experience team.',
              ],
              [
                'When can I ride?',
                'Choose from 9:30 am, 12:30 pm or 3:30 pm, all in Miami’s Eastern Time. The mini calendar lets you plan up to 90 days ahead. These are preview slots, not a live availability feed.',
              ],
              [
                'Is this a real booking or payment?',
                'This is a fully interactive contest preview. You can choose an experience, guests, date and time, review your details and save a confirmation summary. It does not charge you, reserve a spot or send information to the company. For a real experience, contact the team through their official Instagram.',
              ],
              [
                'What if the weather changes?',
                'Good days on the water depend on good conditions. Ask the team about weather decisions and rescheduling policies when arranging your live experience. Safety and conditions come first.',
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={20} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="closing-cta">
          <p className="eyebrow">SOME DAYS ARE WORTH GETTING WET FOR.</p>
          <h2>
            See you <span className="serif">out there.</span>
            <Waves strokeWidth={1} />
          </h2>
          <a className="button button-light" href="#book">
            Make a little room for adventure <ArrowUpRight size={18} />
          </a>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <Brand />
          <p>
            Sunshine. Saltwater.
            <br />A very different side of Miami.
          </p>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            aria-label="Visit Miami Aqua Experience on Instagram"
          >
            <Instagram size={22} />
            <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Miami Aqua Experience</span>
          <span>Made for the water. Based in Miami Beach.</span>
          <span>Contest concept · No live bookings</span>
        </div>
      </footer>
      <a className="mobile-book" href="#book">
        <span>
          Find your flow <small>Experiences from $350</small>
        </span>
        Book your experience <ArrowUpRight size={18} />
      </a>
      <dialog
        className="video-dialog"
        ref={dialogRef}
        aria-label="Miami Aqua Experience on the water"
        onClose={() => videoRef.current?.pause()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        <button
          autoFocus
          className="dialog-close icon-button"
          aria-label="Close video"
          onClick={() => dialogRef.current?.close()}
        >
          <X />
        </button>
        <video
          ref={videoRef}
          src={assetUrl('ride.mp4')}
          poster={assetUrl('hero.webp')}
          controls
          playsInline
          preload="none"
          onError={() => setVideoError(true)}
        />
        {videoError && (
          <p>
            Watch the original ride{' '}
            <a
              href="https://www.instagram.com/miami.aquaexperience/reel/DdJk7drxqyr/"
              target="_blank"
              rel="noreferrer"
            >
              on Instagram <ArrowRight size={14} />
            </a>
          </p>
        )}
        <p>
          Real Miami. Real waves.{' '}
          <a
            href="https://www.instagram.com/miami.aquaexperience/reel/DdJk7drxqyr/"
            target="_blank"
            rel="noreferrer"
          >
            View original <ArrowUpRight size={13} />
          </a>
        </p>
      </dialog>
    </>
  );
}
