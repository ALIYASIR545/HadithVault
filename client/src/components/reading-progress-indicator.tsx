import { BookOpen, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useReadingProgress } from '@/contexts/ReadingProgressContext';

interface ReadingProgressIndicatorProps {
  totalHadiths: number;
}

export default function ReadingProgressIndicator({ totalHadiths }: ReadingProgressIndicatorProps) {
  const { readHadiths, getProgressPercentage } = useReadingProgress();
  const percentage = getProgressPercentage(totalHadiths);
  const readCount = readHadiths.size;

  return (
    <Card className="mb-6 islamic-gradient text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Reading Progress</h3>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-300" />
            <span className="font-medium">{percentage}%</span>
          </div>
        </div>

        <Progress value={percentage} className="h-2 mb-2" />

        <p className="text-sm text-white/70">
          {readCount} of {totalHadiths} hadiths read
        </p>
      </CardContent>
    </Card>
  );
}
