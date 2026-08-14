/**
 * Utilities for fetching real-time Date, Time and Device Location
 * Automatically used when adding photos or videos
 */

// Cache detected location in memory and sessionStorage
let cachedLocation: string | null = null;

/**
 * Formats current real-time date and time
 * Example: "14 Aug 2026, 12:06 PM"
 */
export function getRealtimeDateTimeString(date = new Date()): string {
  try {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' should be '12'

    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  } catch {
    return new Date().toLocaleString();
  }
}

/**
 * Gets human-readable location from coordinates using reverse geocoding
 */
async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    // Free client-side reverse geocode (BigDataCloud client reverse geocode has no key required & very fast)
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision;
      const country = data.countryName || data.countryCode;
      if (city && country) {
        return `${city}, ${country}`;
      } else if (city) {
        return city;
      }
    }
  } catch (e) {
    // Fallback to nominatim
    try {
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: { 'Accept-Language': 'en' },
          signal: AbortSignal.timeout(3500)
        }
      );
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        const addr = nomData.address;
        const place = addr?.city || addr?.town || addr?.village || addr?.county || addr?.state;
        const country = addr?.country;
        if (place && country) return `${place}, ${country}`;
        if (place) return place;
      }
    } catch {}
  }

  return `📍 ${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
}

/**
 * Retrieves the user's real-time location.
 * Falls back to TimeZone city or stored location if permission is not granted.
 */
export async function getRealtimeLocation(): Promise<string> {
  if (cachedLocation) return cachedLocation;

  try {
    const saved = sessionStorage.getItem('romantic_user_location');
    if (saved) {
      cachedLocation = saved;
      return saved;
    }
  } catch {}

  // Attempt browser Geolocation
  if (typeof window !== 'undefined' && 'geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 4500,
          maximumAge: 60000
        });
      });

      const locString = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      if (locString) {
        cachedLocation = locString;
        try {
          sessionStorage.setItem('romantic_user_location', locString);
        } catch {}
        return locString;
      }
    } catch (err) {
      console.warn('Geolocation not available or denied, falling back to timezone:', err);
    }
  }

  // Fallback to Timezone Location (e.g. "Asia/Kolkata" -> "Kolkata, India" or "New York, USA")
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const parts = tz.split('/');
      const city = parts[parts.length - 1].replace(/_/g, ' ');
      const fallbackLoc = `${city}`;
      cachedLocation = fallbackLoc;
      return fallbackLoc;
    }
  } catch {}

  return 'With You Forever';
}
