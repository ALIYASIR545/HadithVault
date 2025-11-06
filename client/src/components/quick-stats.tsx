import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

interface Stats {
  totalHadiths: number;
  collections: number;
  languages: number;
  users: number;
}

const VISITOR_ID_KEY = 'hadith-visitor-id';

// Generate or retrieve unique visitor ID
const getVisitorId = (): string => {
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      // Generate a unique ID based on timestamp and random number
      visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch (error) {
    console.error('Failed to get/set visitor ID:', error);
    return `visitor-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
};

export default function QuickStats() {
  const { data: stats, isLoading, refetch } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  // Track visitor mutation
  const trackVisitor = useMutation({
    mutationFn: async (visitorId: string) => {
      const response = await fetch('/api/visitors/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visitorId }),
      });
      if (!response.ok) {
        throw new Error('Failed to track visitor');
      }
      return response.json();
    },
    onSuccess: () => {
      // Refetch stats to get updated visitor count
      refetch();
    },
  });

  // Track visitor on component mount
  useEffect(() => {
    const visitorId = getVisitorId();
    trackVisitor.mutate(visitorId);
  }, []);

  const statsData = [
    { 
      label: "Total Hadiths", 
      value: stats?.totalHadiths?.toLocaleString() || "0",
      testId: "stat-hadiths"
    },
    { 
      label: "Collections", 
      value: stats?.collections?.toString() || "0",
      testId: "stat-collections"
    },
    { 
      label: "Languages", 
      value: stats?.languages?.toString() || "0",
      testId: "stat-languages"
    },
    { 
      label: "Users", 
      value: stats?.users?.toLocaleString() || "0",
      testId: "stat-users"
    },
  ];

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.label} className="p-4 text-center islamic-gradient text-white">
            <CardContent className="p-0">
              <div
                className="text-2xl font-bold text-white mb-1"
                data-testid={stat.testId}
              >
                {stat.value}
              </div>
              <div className="text-sm text-white/80">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
