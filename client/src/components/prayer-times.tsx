import { Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface PrayerTime {
  name: string;
  time: string;
}

interface PrayerTimesData {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        // Get user's location
        if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser");
          setLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              // First, get city name using reverse geocoding with user agent
              const geoResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                {
                  headers: {
                    'User-Agent': 'HadithVault/1.0'
                  }
                }
              );

              if (geoResponse.ok) {
                const geoData = await geoResponse.json();

                // Extract city name from address - try multiple fields
                const cityName = geoData.address?.city ||
                                 geoData.address?.town ||
                                 geoData.address?.village ||
                                 geoData.address?.municipality ||
                                 geoData.address?.county ||
                                 geoData.address?.state_district ||
                                 geoData.address?.state ||
                                 'Your Location';

                setLocation(cityName);
                console.log('Detected location:', cityName, 'Full address:', geoData.address);
              } else {
                console.warn('Geocoding failed, using fallback');
                setLocation('Your Location');
              }

              // Fetch prayer times from Aladhan API
              const today = new Date();
              const timestamp = Math.floor(today.getTime() / 1000);

              const response = await fetch(
                `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=2`
              );

              const data = await response.json();

              if (data.code === 200 && data.data) {
                const timings = data.data.timings as PrayerTimesData;

                setPrayerTimes([
                  { name: "Fajr", time: timings.Fajr },
                  { name: "Dhuhr", time: timings.Dhuhr },
                  { name: "Asr", time: timings.Asr },
                  { name: "Maghrib", time: timings.Maghrib },
                  { name: "Isha", time: timings.Isha },
                ]);
              }
            } catch (err) {
              setError("Failed to fetch prayer times");
            } finally {
              setLoading(false);
            }
          },
          () => {
            setError("Unable to retrieve your location");
            setLoading(false);
          }
        );
      } catch (err) {
        setError("An error occurred");
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  // Get current prayer time
  const getCurrentPrayer = () => {
    if (prayerTimes.length === 0) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < prayerTimes.length; i++) {
      const [hours, minutes] = prayerTimes[i].time.split(":").map(Number);
      const prayerMinutes = hours * 60 + minutes;

      if (currentTime < prayerMinutes) {
        return i === 0 ? prayerTimes[prayerTimes.length - 1] : prayerTimes[i - 1];
      }
    }

    return prayerTimes[prayerTimes.length - 1];
  };

  const currentPrayer = getCurrentPrayer();

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Prayer Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-islamic-teal" />
            <span className="ml-2 text-slate-600 dark:text-slate-400">Loading prayer times...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Prayer Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Please enable location access to see prayer times.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 islamic-gradient text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <Clock className="h-5 w-5 text-white" />
          Prayer Times for {location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {prayerTimes.map((prayer) => (
            <div
              key={prayer.name}
              className={`flex justify-between items-center p-3 rounded-lg ${
                currentPrayer?.name === prayer.name
                  ? "bg-white/25 border border-white/40"
                  : "bg-white/10"
              }`}
            >
              <span className={`font-medium text-white`}>
                {prayer.name}
              </span>
              <span className={`font-semibold text-white`}>
                {prayer.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
