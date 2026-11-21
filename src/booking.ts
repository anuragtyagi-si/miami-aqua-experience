export const INSTAGRAM = 'https://www.instagram.com/miami.aquaexperience/';
export const SERVICES = [
  {
    id: 'wake',
    name: 'Wake surfing',
    price: 350,
    duration: 'Ride the wake',
    image: '/assets/wake.webp',
    description: 'Find your balance. Feel the rush. Turn the Miami coastline into your playground.',
    tag: 'Chase the endless wave',
    detail: 'Boat-powered waves · A classic Miami ride',
  },
  {
    id: 'foil',
    name: 'E-foil / E-surf',
    price: 350,
    duration: '2-hour experience',
    image: '/assets/efoil.webp',
    description:
      'A little less gravity. A lot more freedom. Discover the feeling of flying above the water.',
    tag: 'Meet your new obsession',
    detail: 'Electric-powered boards · 2 hours on the water',
  },
] as const;
export type ServiceId = (typeof SERVICES)[number]['id'];
export const TIME_SLOTS = ['9:30 am', '12:30 pm', '3:30 pm'] as const;
export type Booking = {
  service: ServiceId;
  people: number;
  names: string[];
  phone: string;
  date: string;
  time: string;
};
export const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
// The brief gives a price per experience, not per guest. Party size does not multiply it.
export const bookingTotal = (service: ServiceId) =>
  SERVICES.find((item) => item.id === service)!.price;
export function miamiToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}
export function addDays(date: string, count: number) {
  const result = new Date(`${date}T12:00:00Z`);
  result.setUTCDate(result.getUTCDate() + count);
  return result.toISOString().slice(0, 10);
}
export function dateLabel(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
export function slotIsPast(date: string, time: string, now = new Date()) {
  const today = miamiToday(now);
  if (date !== today) return date < today;
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(now),
  );
  const minute = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', minute: '2-digit' }).format(
      now,
    ),
  );
  const slots: Record<string, number> = { '9:30 am': 570, '12:30 pm': 750, '3:30 pm': 930 };
  return (slots[time] ?? 0) <= hour * 60 + minute;
}
export function validateBooking(booking: Booking, now = new Date()): string | null {
  if (!SERVICES.some((s) => s.id === booking.service)) return 'Choose an experience.';
  if (!Number.isInteger(booking.people) || booking.people < 1 || booking.people > 6)
    return 'Choose between 1 and 6 people.';
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(booking.date) ||
    Number.isNaN(Date.parse(`${booking.date}T12:00:00Z`)) ||
    new Date(`${booking.date}T12:00:00Z`).toISOString().slice(0, 10) !== booking.date ||
    booking.date < miamiToday(now) ||
    booking.date > addDays(miamiToday(now), 90)
  )
    return 'Choose a date within the next 90 days.';
  if (
    !TIME_SLOTS.includes(booking.time as (typeof TIME_SLOTS)[number]) ||
    slotIsPast(booking.date, booking.time, now)
  )
    return 'Choose an upcoming time slot.';
  if (
    booking.names.length !== booking.people ||
    booking.names.some((name) => name.trim().length < 2 || name.trim().length > 80)
  )
    return 'Enter a name (2–80 characters) for every guest.';
  const digits = booking.phone.replace(/\D/g, '');
  if (!/^[+\d\s().-]+$/.test(booking.phone) || digits.length < 7 || digits.length > 15)
    return 'Enter a valid phone number, including your country code.';
  return null;
}
