import { useQuery } from "@tanstack/react-query";
import { BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { HadithCollection } from "@shared/schema";
import { useLocation } from "wouter";

export default function CollectionsGrid() {
  const [, navigate] = useLocation();
  const { data: collections, isLoading } = useQuery<HadithCollection[]>({
    queryKey: ["/api/collections"],
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-6">Hadith Collections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                  <div className="w-16 h-5 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold mb-6">Hadith Collections</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections?.map((collection) => (
          <Card
            key={collection.id}
            className="p-6 islamic-gradient text-white hover:shadow-lg transition-all cursor-pointer group"
            data-testid={`card-collection-${collection.id}`}
            onClick={() => navigate(`/collections/${collection.id}`)}
          >
            <CardContent className="p-0">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span
                  className="text-xs bg-white/25 text-white px-2 py-1 rounded-full"
                  data-testid={`text-count-${collection.id}`}
                >
                  {collection.totalHadiths.toLocaleString()} Hadiths
                </span>
              </div>

              <h4 className="font-semibold text-lg mb-2 text-white" data-testid={`text-name-${collection.id}`}>
                {collection.name}
              </h4>
              <p
                className="text-white/80 text-sm mb-4"
                data-testid={`text-description-${collection.id}`}
              >
                {collection.description}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className="text-xs text-white/70"
                  data-testid={`text-compiler-${collection.id}`}
                >
                  By {collection.compiler}
                </span>
                <ArrowRight className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
