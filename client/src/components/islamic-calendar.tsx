import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IslamicDate {
  day: number;
  month: string;
  year: number;
  hijriDate: string;
  gregorianDate: string;
  isToday: boolean;
}

const islamicMonths = [
  "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani",
  "Jumada al-awwal", "Jumada al-thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

const gregorianMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function IslamicCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [islamicDate, setIslamicDate] = useState<IslamicDate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simplified conversion from Gregorian to Islamic date
  const gregorianToIslamic = (date: Date): IslamicDate => {
    // This is a simplified conversion - in a real app, use a proper library
    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth();
    const gregorianDay = date.getDate();
    
    // Approximate conversion (not astronomically accurate)
    let hijriYear = Math.floor((gregorianYear - 622) * 0.970224);
    const hijriMonth = Math.floor((gregorianMonth + 1) * 0.970224) % 12;
    const hijriDay = Math.floor(gregorianDay * 0.970224) % 30;
    
    // Ensure we're in 2025
    const currentYear = new Date().getFullYear();
    if (currentYear >= 2025) {
      hijriYear = Math.floor((2025 - 622) * 0.970224);
    }
    
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    return {
      day: hijriDay || 1,
      month: islamicMonths[hijriMonth] || islamicMonths[0],
      year: hijriYear || 1445,
      hijriDate: `${hijriDay || 1} ${islamicMonths[hijriMonth] || islamicMonths[0]} ${hijriYear || 1445} AH`,
      gregorianDate: `${gregorianDay} ${gregorianMonths[gregorianMonth]} ${gregorianYear}`,
      isToday
    };
  };

  const loadIslamicDate = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const islamic = gregorianToIslamic(currentDate);
      setIslamicDate(islamic);
    } catch (error) {
      console.error("Error loading Islamic date:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIslamicDate();
  }, [currentDate]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-islamic-teal"></div>
            <span className="ml-2">Loading Islamic calendar...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 islamic-gradient text-white">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-white mr-2" />
            <h3 className="text-base font-semibold text-white">Islamic Calendar</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="text-xs px-2 py-1 h-6 text-white hover:bg-white/20"
          >
            Today
          </Button>
        </div>

        {islamicDate && (
          <div className="space-y-2">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="flex items-center p-1 h-6 w-6 text-white hover:bg-white/20"
                title="Previous Month"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>

              <div className="text-center">
                <div className="text-sm font-semibold text-white">
                  {islamicDate.month} {islamicDate.year} AH
                </div>
                <div className="text-xs text-white/80">
                  {new Date(currentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="flex items-center p-1 h-6 w-6 text-white hover:bg-white/20"
                title="Next Month"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>

            {/* Day Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate('prev')}
                className="flex items-center p-1 h-6 w-6 text-white hover:bg-white/20"
                title="Previous Day"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>

              <div className="text-center">
                <div className="text-sm font-semibold text-white">
                  {islamicDate.day} {islamicDate.month}
                </div>
                <div className="text-xs text-white/80">
                  {islamicDate.gregorianDate}
                </div>
                {islamicDate.isToday && (
                  <div className="inline-block bg-white/25 text-white px-1 py-0.5 rounded text-xs font-medium mt-1">
                    Today
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate('next')}
                className="flex items-center p-1 h-6 w-6 text-white hover:bg-white/20"
                title="Next Day"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
