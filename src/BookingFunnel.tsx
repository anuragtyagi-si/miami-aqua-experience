import { useRef, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  Info,
  LockKeyhole,
  MapPin,
  Minus,
  Plus,
  Users,
  Waves,
} from 'lucide-react';
import Calendar from './Calendar';
import {
  addDays,
  bookingTotal,
  dateLabel,
  formatMoney,
  miamiToday,
  SERVICES,
  slotIsPast,
  TIME_SLOTS,
  validateBooking,
} from './booking';
import type { Booking, ServiceId } from './booking';

export default function BookingFunnel({
  service,
  onServiceChange,
}: {
  service: ServiceId;
  onServiceChange: (service: ServiceId) => void;
}) {
  const [step, setStep] = useState(1);
  const [people, setPeople] = useState(1);
  const [names, setNames] = useState(['']);
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const [receipt, setReceipt] = useState<{ id: string; booking: Booking } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const selected = SERVICES.find((s) => s.id === service)!;
  const booking: Booking = { service, people, names, phone, date, time };
  const changeStep = (next: number) => {
    setError('');
    setStep(next);
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  };
  const changePeople = (next: number) => {
    setPeople(next);
    setNames((old) => Array.from({ length: next }, (_, i) => old[i] || ''));
  };
  const nextStep = () => {
    if (step === 1) {
      if (!date || !time) {
        setError('Pick a date and time to keep the good times coming.');
        return;
      }
      if (date < miamiToday() || date > addDays(miamiToday(), 90) || slotIsPast(date, time)) {
        setError('That time has passed. Please choose an upcoming date and time.');
        return;
      }
    } else {
      const issue = validateBooking(booking);
      if (issue) {
        setError(issue);
        return;
      }
    }
    changeStep(step + 1);
  };
  const confirm = () => {
    const issue = validateBooking(booking);
    if (issue) {
      setError(issue);
      return;
    }
    if (!consent) {
      setError('Please acknowledge that this is a preview booking.');
      return;
    }
    setReceipt({
      id: `MAE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      booking: { ...booking, names: names.map((n) => n.trim()), phone: phone.trim() },
    });
    changeStep(4);
  };
  const download = () => {
    if (!receipt) return;
    const b = receipt.booking;
    const text = `MIAMI AQUA EXPERIENCE\nPreview booking — not a live reservation\n\nReference: ${receipt.id}\nExperience: ${SERVICES.find((s) => s.id === b.service)!.name}\nGuests: ${b.names.join(', ')}\nPhone: ${b.phone}\nDate: ${dateLabel(b.date)}\nTime: ${b.time} (Miami / Eastern Time)\nExperience total: ${formatMoney(bookingTotal(b.service))} USD\nPaid: $0\n\nThis contest preview does not submit your information, reserve availability, or take payment. Contact @miami.aquaexperience on Instagram to arrange a live experience.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${receipt.id}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section id="book" className="booking-section section-pad">
      <div className="section-heading booking-title">
        <div>
          <p className="eyebrow">YOUR NEXT GREAT STORY</p>
          <h2>
            A little planning.
            <br />
            <span className="serif">A lot of possibility.</span>
          </h2>
        </div>
        <p>
          Pick your ride. Bring your people.
          <br />
          We’ll see you on the water.
        </p>
      </div>
      <div className="preview-note">
        <Info size={16} />
        <span>
          <strong>Contest booking preview</strong> — explore the full experience. No payment, live
          reservation, or information sent.
        </span>
      </div>
      <div className="booking-layout">
        <div className="booking-form">
          <ol className="steps" aria-label="Booking progress">
            {['Experience', 'Your details', 'Confirmation'].map((name, i) => (
              <li
                key={name}
                className={step >= i + 1 ? 'active' : ''}
                aria-current={step === i + 1 ? 'step' : undefined}
              >
                <span>{step > i + 1 ? <Check size={13} /> : `0${i + 1}`}</span>
                {name}
              </li>
            ))}
          </ol>
          <h3 ref={headingRef} tabIndex={-1}>
            {step === 1
              ? 'Make it your kind of day.'
              : step === 2
                ? 'Who’s coming along?'
                : step === 3
                  ? 'One last look. Then let’s go.'
                  : 'Your Miami moment, planned.'}
          </h3>
          {step === 1 && (
            <>
              <fieldset>
                <legend>Choose your experience</legend>
                <div className="service-choices">
                  {SERVICES.map((s) => (
                    <label
                      className={`service-choice ${service === s.id ? 'chosen' : ''}`}
                      key={s.id}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={s.id}
                        checked={service === s.id}
                        onChange={() => onServiceChange(s.id)}
                      />
                      <Waves size={24} />
                      <span>
                        <strong>{s.name}</strong>
                        <small>{s.duration}</small>
                      </span>
                      <b>$350</b>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="guest-count">
                <div>
                  <label htmlFor="guest-count">How many people?</label>
                  <p>Party size for planning · up to 6 in this preview</p>
                </div>
                <div className="stepper">
                  <button
                    type="button"
                    aria-label="Remove a guest"
                    disabled={people === 1}
                    onClick={() => changePeople(people - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <output id="guest-count" aria-live="polite">
                    {people}
                  </output>
                  <button
                    type="button"
                    aria-label="Add a guest"
                    disabled={people === 6}
                    onClick={() => changePeople(people + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="date-time">
                <div>
                  <h4>Pick your date</h4>
                  <Calendar
                    value={date}
                    onChange={(d) => {
                      setDate(d);
                      setTime('');
                      setError('');
                    }}
                  />
                </div>
                <fieldset className="time-field">
                  <legend>Find your time</legend>
                  <p className="field-help">A little morning magic or an afternoon escape?</p>
                  <div className="time-slots">
                    {TIME_SLOTS.map((t) => (
                      <label
                        key={t}
                        className={`time-slot ${time === t ? 'chosen' : ''} ${date && slotIsPast(date, t) ? 'unavailable' : ''}`}
                      >
                        <input
                          type="radio"
                          name="time"
                          value={t}
                          checked={time === t}
                          disabled={!date || slotIsPast(date, t)}
                          onChange={() => {
                            setTime(t);
                            setError('');
                          }}
                        />
                        <Clock3 size={16} />
                        {t}
                        <span className="radio-dot" />
                      </label>
                    ))}
                  </div>
                  <small className="timezone">
                    <MapPin size={12} /> Miami time (Eastern)
                  </small>
                  {!date && <small className="field-help">Choose a date to see time slots.</small>}
                </fieldset>
              </div>
            </>
          )}
          {step === 2 && (
            <form
              id="details-form"
              onSubmit={(e) => {
                e.preventDefault();
                nextStep();
              }}
            >
              <p className="form-intro">
                The best memories are made together. Add everyone joining the adventure.
              </p>
              <div className="names-grid">
                {names.map((name, i) => (
                  <label className="text-field" key={i}>
                    Guest {i + 1} — full name
                    <input
                      name={`guest-${i + 1}`}
                      autoComplete={i === 0 ? 'name' : 'off'}
                      required
                      minLength={2}
                      maxLength={80}
                      placeholder={i === 0 ? 'Your full name' : 'Guest’s full name'}
                      value={name}
                      onChange={(e) =>
                        setNames((old) => old.map((n, index) => (index === i ? e.target.value : n)))
                      }
                    />
                  </label>
                ))}
              </div>
              <label className="text-field phone-field">
                Contact phone number
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 (305) 555-0123"
                  required
                  maxLength={30}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <small>Include your country code. Your details stay on this page only.</small>
              </label>
              <div className="privacy-note">
                <LockKeyhole size={18} />
                <p>
                  No account needed. This preview does not send or store your personal details on a
                  server.
                </p>
              </div>
            </form>
          )}
          {step === 3 && (
            <div className="review">
              <p className="form-intro">
                Your board is picked. Your day is set. Here’s your adventure at a glance.
              </p>
              <dl>
                <div>
                  <dt>Experience</dt>
                  <dd>{selected.name}</dd>
                </div>
                <div>
                  <dt>Date & time</dt>
                  <dd>
                    {dateLabel(date)}
                    <br />
                    {time} · Miami time
                  </dd>
                </div>
                <div>
                  <dt>Your crew</dt>
                  <dd>{names.map((n) => n.trim()).join(', ')}</dd>
                </div>
                <div>
                  <dt>Contact number</dt>
                  <dd>{phone}</dd>
                </div>
                <div>
                  <dt>Experience total</dt>
                  <dd>{formatMoney(bookingTotal(service))} USD</dd>
                </div>
              </dl>
              <label className="consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I understand this is a contest preview. No real reservation is made, no payment is
                  taken, and no details are sent.
                </span>
              </label>
            </div>
          )}
          {step === 4 && receipt && (
            <div className="confirmation" role="status">
              <span className="confirmation-icon">
                <CircleCheck size={36} />
              </span>
              <p className="eyebrow">PREVIEW BOOKING COMPLETE</p>
              <h4>Saltwater looks good on you.</h4>
              <p>
                Your {selected.name.toLowerCase()} plan is ready for{' '}
                {dateLabel(receipt.booking.date)} at {receipt.booking.time}.
              </p>
              <div className="reference">
                <small>YOUR PREVIEW REFERENCE</small>
                <strong>{receipt.id}</strong>
              </div>
              <p className="confirmation-disclaimer">
                This is not a live reservation. No payment was taken and your details were not sent.
                Ready for the real thing? Visit{' '}
                <a
                  href="https://www.instagram.com/miami.aquaexperience/"
                  target="_blank"
                  rel="noreferrer"
                >
                  @miami.aquaexperience ↗
                </a>
                .
              </p>
              <button className="button button-dark" type="button" onClick={download}>
                Save your booking summary <ArrowDownToLine size={17} />
              </button>
              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setReceipt(null);
                  setNames(['']);
                  setPhone('');
                  setPeople(1);
                  setDate('');
                  setTime('');
                  setConsent(false);
                  changeStep(1);
                }}
              >
                Plan another adventure <ArrowRight size={15} />
              </button>
            </div>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {step < 4 && (
            <div className="form-footer">
              {step > 1 ? (
                <button type="button" className="text-button" onClick={() => changeStep(step - 1)}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <small>
                  <LockKeyhole size={13} /> No payment required
                </small>
              )}
              <button
                className="button button-dark"
                type={step === 2 ? 'submit' : 'button'}
                form={step === 2 ? 'details-form' : undefined}
                onClick={step === 2 ? undefined : step === 3 ? confirm : nextStep}
              >
                {step === 1
                  ? 'Continue to your details'
                  : step === 2
                    ? 'Review your booking'
                    : 'Confirm preview booking'}
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>
        <aside className="booking-summary" aria-label="Your booking summary">
          <div className="summary-photo">
            <img
              src={selected.image}
              alt={
                service === 'wake'
                  ? 'Wake surfing in front of the Miami skyline'
                  : 'A Miami Aqua Experience rider with an electric board'
              }
              width="640"
              height="800"
              loading="lazy"
            />
            <span>YOUR MIAMI MOMENT</span>
          </div>
          <div className="summary-body">
            <p className="eyebrow">THE GOOD TIMES START HERE</p>
            <h3>{selected.name}</h3>
            <p className="summary-duration">{selected.duration}</p>
            <ul>
              <li>
                <MapPin size={16} /> Miami Beach, Florida
              </li>
              <li>
                <Users size={16} /> {people} {people === 1 ? 'person' : 'people'}
              </li>
              <li>
                <CalendarDays size={16} /> {date ? dateLabel(date) : 'Your date, your adventure'}
              </li>
              <li>
                <Clock3 size={16} /> {time ? `${time} · Eastern` : 'Three daily time slots'}
              </li>
            </ul>
            <div className="price-line">
              <span>Experience</span>
              <span>{formatMoney(selected.price)}</span>
            </div>
            <div className="total-line">
              <span>
                Total <small>USD</small>
              </span>
              <strong>{formatMoney(bookingTotal(service))}</strong>
            </div>
            <p className="summary-note">
              $350 per experience, not multiplied by party size. Group capacity and live
              availability are subject to confirmation.
            </p>
            <div className="summary-bottom">
              <Waves size={21} />
              <span>
                A new perspective.
                <br />
                <strong>A very Miami experience.</strong>
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
