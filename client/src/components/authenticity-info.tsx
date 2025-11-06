import { Info, Shield, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AuthenticityInfoProps {
  hadithId: string;
  collectionId: string;
  buttonVariant?: 'default' | 'ghost' | 'outline';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
}

// Mock data - in real app, this would come from the database
const getAuthenticityData = (hadithId: string, collectionId: string) => {
  // For demonstration, we'll use collection-based grades
  const collectionGrades: Record<string, { grade: string; color: string; icon: any }> = {
    bukhari: { grade: 'Sahih (Authentic)', color: 'bg-green-600', icon: CheckCircle },
    muslim: { grade: 'Sahih (Authentic)', color: 'bg-green-600', icon: CheckCircle },
    abudawud: { grade: 'Hasan (Good)', color: 'bg-blue-600', icon: Shield },
    tirmidhi: { grade: 'Hasan (Good)', color: 'bg-blue-600', icon: Shield },
  };

  const data = collectionGrades[collectionId] || {
    grade: 'Under Review',
    color: 'bg-gray-600',
    icon: AlertCircle
  };

  return {
    grade: data.grade,
    color: data.color,
    icon: data.icon,
    narrator: 'Abu Huraira',
    chain: [
      'Prophet Muhammad ﷺ',
      'Abu Huraira (رضي الله عنه)',
      'Az-Zuhri',
      'Malik ibn Anas',
      'Al-Bukhari / Muslim',
    ],
    scholars: [
      { name: 'Al-Albani', verdict: 'Sahih' },
      { name: 'Ibn Hajar', verdict: 'Authentic' },
      { name: 'An-Nawawi', verdict: 'Sound' },
    ],
    notes: collectionId === 'bukhari'
      ? 'This hadith is authenticated by Imam al-Bukhari, one of the most rigorous hadith scholars. It meets the highest standards of authenticity.'
      : collectionId === 'muslim'
      ? 'Authenticated by Imam Muslim, following strict criteria for narrator reliability and continuity of transmission.'
      : 'This hadith has been classified as Hasan (Good) by major scholars, indicating reliability though not at the highest tier.',
  };
};

export default function AuthenticityInfo({
  hadithId,
  collectionId,
  buttonVariant = 'ghost',
  buttonSize = 'sm',
}: AuthenticityInfoProps) {
  const data = getAuthenticityData(hadithId, collectionId);
  const Icon = data.icon;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className="text-xs text-white hover:bg-white/20"
          data-testid="button-authenticity-info"
        >
          <Info className="mr-1 h-3 w-3" />
          Authenticity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-islamic-teal" />
            Hadith Authenticity Information
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Chain of narration (Sanad) and scholarly verification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Authenticity Grade */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Authenticity Grade</h3>
            <Badge className={`${data.color} text-white text-sm px-4 py-2 flex items-center gap-2 w-fit`}>
              <Icon className="h-4 w-4" />
              {data.grade}
            </Badge>
          </div>

          {/* Chain of Narration */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Chain of Narration (Sanad)
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-islamic-teal/30"></div>
              <div className="space-y-4">
                {data.chain.map((narrator, index) => (
                  <div key={index} className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 bg-islamic-teal rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-white font-medium">{narrator}</p>
                      {index === 0 && (
                        <p className="text-xs text-slate-400 mt-1">Source of the hadith</p>
                      )}
                      {index === data.chain.length - 1 && (
                        <p className="text-xs text-slate-400 mt-1">Compiler/Recorder</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scholarly Verdicts */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Major Scholars' Verdicts
            </h3>
            <div className="space-y-2">
              {data.scholars.map((scholar, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3"
                >
                  <span className="text-white text-sm">{scholar.name}</span>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600">
                    {scholar.verdict}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Notes</h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-700/30 rounded-lg p-4">
              {data.notes}
            </p>
          </div>

          {/* Legend */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-xs font-semibold text-white mb-2">Authenticity Grades</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-slate-300">Sahih (Authentic)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-blue-500" />
                <span className="text-slate-300">Hasan (Good)</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-yellow-500" />
                <span className="text-slate-300">Daif (Weak)</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-3 w-3 text-red-500" />
                <span className="text-slate-300">Mawdu (Fabricated)</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
