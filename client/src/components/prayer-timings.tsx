import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrayerTime {
  name: string;
  time: string;
  isNext: boolean;
}

interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function PrayerTimings() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get city and country
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            resolve({
              city: data.city || data.locality || "Unknown",
              country: data.countryName || "Unknown",
              latitude,
              longitude
            });
          } catch (err) {
            resolve({
              city: "Unknown",
              country: "Unknown",
              latitude,
              longitude
            });
          }
        },
        (error) => {
          reject(new Error("Unable to retrieve your location"));
        }
      );
    });
  };

  const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const calculatePrayerTimes = (lat: number, lng: number, date: Date) => {
    // Simplified prayer time calculation
    // In a real app, you'd use a proper Islamic prayer time library
    
    const times = [
      { name: "Fajr", time: "05:30" },
      { name: "Dhuhr", time: "12:15" },
      { name: "Asr", time: "15:45" },
      { name: "Maghrib", time: "18:20" },
      { name: "Isha", time: "19:45" }
    ];

    // Find the next prayer
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayerTimesWithMinutes = times.map(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      return {
        ...prayer,
        time: formatTime12Hour(prayer.time),
        minutes: prayerMinutes,
        isNext: prayerMinutes > currentTime
      };
    });

    // Sort by time and mark the next prayer
    prayerTimesWithMinutes.sort((a, b) => a.minutes - b.minutes);
    
    // If no prayer is found for today, mark the first one tomorrow
    if (!prayerTimesWithMinutes.some(p => p.isNext)) {
      prayerTimesWithMinutes[0].isNext = true;
    }

    return prayerTimesWithMinutes.map(({ minutes, isNext, ...rest }) => rest);
  };

  const loadPrayerTimes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const locationData = await getLocation();
      setLocation(locationData);
      
      const times = calculatePrayerTimes(
        locationData.latitude,
        locationData.longitude,
        new Date()
      );
      
      setPrayerTimes(times);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load prayer times");
      // Fallback to default location (Mecca)
      const defaultLocation = { city: "Mecca", country: "Saudi Arabia", latitude: 21.3891, longitude: 39.8579 };
      setLocation(defaultLocation);
      const times = calculatePrayerTimes(defaultLocation.latitude, defaultLocation.longitude, new Date());
      setPrayerTimes(times);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading prayer times...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-islamic-teal mr-2" />
            <h3 className="text-xl font-semibold">Prayer Times</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPrayerTimes}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        {location && (
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            {location.city}, {location.country}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-1">
          {prayerTimes.map((prayer) => (
            <div
              key={prayer.name}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                prayer.isNext
                  ? "bg-islamic-teal text-white"
                  : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              <span className="font-medium">{prayer.name}:</span>
              <span className="font-bold">{prayer.time}</span>
              {prayer.isNext && (
                <span className="text-xs opacity-90 ml-1">Next</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
