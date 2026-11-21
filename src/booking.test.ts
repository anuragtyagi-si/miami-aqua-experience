import { describe, expect, it } from 'vitest';
import {
  addDays,
  bookingTotal,
  dateLabel,
  miamiToday,
  slotIsPast,
  validateBooking,
} from './booking';
import type { Booking } from './booking';

const now = new Date('2026-11-21T15:00:00Z'); // 10 am in Miami, not the host's timezone.
const valid: Booking = {
  service: 'foil',
  people: 2,
  names: ['Alex Morgan', 'Sam Rivera'],
  phone: '+1 (305) 555-0123',
  date: '2026-11-22',
  time: '12:30 pm',
};

describe('booking rules', () => {
  it('keeps both services at the brief’s flat $350 experience price', () => {
    expect(bookingTotal('wake')).toBe(350);
    expect(bookingTotal('foil')).toBe(350);
  });
  it('accepts complete multi-guest bookings', () => {
    expect(validateBooking(valid, now)).toBeNull();
  });
  it('requires a name for every guest and a plausible international phone number', () => {
    expect(validateBooking({ ...valid, names: ['Alex'] }, now)).toMatch(/every guest/);
    expect(validateBooking({ ...valid, names: ['Alex', ' '] }, now)).toMatch(/every guest/);
    expect(validateBooking({ ...valid, phone: 'abc123' }, now)).toMatch(/phone/);
    expect(validateBooking({ ...valid, phone: '5550123' }, now)).toMatch(/phone/);
    expect(validateBooking({ ...valid, phone: '305+555+0123' }, now)).toMatch(/phone/);
    expect(validateBooking({ ...valid, phone: '+999 123456789' }, now)).toMatch(/phone/);
    expect(validateBooking({ ...valid, phone: '+44 20 7946 0958' }, now)).toBeNull();
  });
  it('rejects invalid party sizes, past dates and dates beyond the booking window', () => {
    expect(validateBooking({ ...valid, people: 0 }, now)).toMatch(/1 and 6/);
    expect(validateBooking({ ...valid, date: '2026-11-20' }, now)).toMatch(/90 days/);
    expect(validateBooking({ ...valid, date: '2027-05-01' }, now)).toMatch(/90 days/);
  });
  it('only allows the three supplied time slots and rejects elapsed same-day slots', () => {
    expect(validateBooking({ ...valid, time: '8:00 am' }, now)).toMatch(/upcoming/);
    expect(validateBooking({ ...valid, date: '2026-11-21', time: '9:30 am' }, now)).toMatch(
      /upcoming/,
    );
    expect(validateBooking({ ...valid, date: '2026-11-21', time: '12:30 pm' }, now)).toBeNull();
    expect(slotIsPast('2026-11-21', '3:30 pm', new Date('2026-11-21T20:30:00Z'))).toBe(true);
  });
  it('uses Miami dates across UTC midnight and daylight saving boundaries', () => {
    expect(miamiToday(new Date('2026-11-22T02:00:00Z'))).toBe('2026-11-21');
    expect(slotIsPast('2026-07-01', '9:30 am', new Date('2026-07-01T13:45:00Z'))).toBe(true);
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(dateLabel('2026-11-22')).toContain('Nov 22, 2026');
  });
});
