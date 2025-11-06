import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface AdvancedFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  narrator?: string;
  topic?: string;
  authenticity?: string;
}

const narrators = [
  'Abu Huraira',
  'Aisha',
  'Ibn Umar',
  'Anas bin Malik',
  'Abdullah bin Abbas',
  'Abu Said Al-Khudri',
  'Jabir bin Abdullah',
  'Abdullah bin Masud',
];

const topics = [
  'Faith (Iman)',
  'Prayer (Salah)',
  'Charity (Zakat)',
  'Fasting (Sawm)',
  'Pilgrimage (Hajj)',
  'Marriage',
  'Business & Trade',
  'Manners & Character',
  'Knowledge',
  'Repentance',
  'Paradise & Hell',
  'Prophets',
];

const authenticityGrades = [
  { value: 'sahih', label: 'Sahih (Authentic)' },
  { value: 'hasan', label: 'Hasan (Good)' },
  { value: 'daif', label: 'Daif (Weak)' },
  { value: 'mawdu', label: 'Mawdu (Fabricated)' },
];

export default function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' ? undefined : value,
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-white hover:bg-white/20"
                data-testid="button-toggle-filters"
              >
                <Filter className="h-4 w-4" />
                Advanced Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-islamic-teal text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-white hover:bg-white/20"
                data-testid="button-clear-all"
              >
                Clear All
              </Button>
            )}
          </div>

          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Narrator Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Narrator</label>
                <Select
                  value={filters.narrator || 'all'}
                  onValueChange={(value) => handleFilterChange('narrator', value)}
                >
                  <SelectTrigger data-testid="select-narrator">
                    <SelectValue placeholder="All Narrators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Narrators</SelectItem>
                    {narrators.map((narrator) => (
                      <SelectItem key={narrator} value={narrator}>
                        {narrator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Topic Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Topic</label>
                <Select
                  value={filters.topic || 'all'}
                  onValueChange={(value) => handleFilterChange('topic', value)}
                >
                  <SelectTrigger data-testid="select-topic">
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Authenticity Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Authenticity Grade</label>
                <Select
                  value={filters.authenticity || 'all'}
                  onValueChange={(value) => handleFilterChange('authenticity', value)}
                >
                  <SelectTrigger data-testid="select-authenticity">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {authenticityGrades.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-white/70">Active filters:</span>
                {filters.narrator && (
                  <Badge
                    variant="secondary"
                    className="bg-islamic-teal/20 text-white border-islamic-teal"
                  >
                    Narrator: {filters.narrator}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => clearFilter('narrator')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.topic && (
                  <Badge
                    variant="secondary"
                    className="bg-islamic-teal/20 text-white border-islamic-teal"
                  >
                    Topic: {filters.topic}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => clearFilter('topic')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.authenticity && (
                  <Badge
                    variant="secondary"
                    className="bg-islamic-teal/20 text-white border-islamic-teal"
                  >
                    Grade: {authenticityGrades.find(g => g.value === filters.authenticity)?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => clearFilter('authenticity')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
