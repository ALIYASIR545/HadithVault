import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface AutocompleteSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Mock data - in real app, this would come from API
const suggestions = {
  narrators: [
    'Abu Huraira',
    'Aisha bint Abi Bakr',
    'Ibn Umar',
    'Anas bin Malik',
    'Abdullah bin Abbas',
    'Abu Said Al-Khudri',
    'Jabir bin Abdullah',
    'Abdullah bin Masud',
  ],
  topics: [
    'Faith (Iman)',
    'Prayer (Salah)',
    'Charity (Zakat)',
    'Fasting (Sawm)',
    'Pilgrimage (Hajj)',
    'Marriage and Family',
    'Business and Trade',
    'Manners and Character',
    'Knowledge and Learning',
    'Repentance (Tawbah)',
    'Paradise and Hell',
    'Prophets and Messengers',
    'Angels',
    'Day of Judgment',
    'Jihad',
  ],
  keywords: [
    'prayer times',
    'ablution',
    'purification',
    'intention (niyyah)',
    'charity types',
    'ramadan',
    'friday prayer',
    'night prayer',
    'supplication (dua)',
    'forgiveness',
  ],
};

export default function AutocompleteSearch({
  value,
  onChange,
  onSelect,
  placeholder = 'Search by keyword, topic, or narrator...',
  className = '',
}: AutocompleteSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const query = value.toLowerCase();
      const allSuggestions = [
        ...suggestions.narrators,
        ...suggestions.topics,
        ...suggestions.keywords,
      ];
      const filtered = allSuggestions.filter((item) =>
        item.toLowerCase().includes(query)
      );
      setFilteredSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  }, [value]);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    onSelect?.(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(filteredSuggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="pl-10 pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && filteredSuggestions.length > 0 && setIsOpen(true)}
          data-testid="input-autocomplete-search"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            data-testid="button-clear-search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <Card
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-slate-800 border-slate-700 shadow-lg"
          data-testid="autocomplete-dropdown"
        >
          <div className="max-h-64 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  index === highlightedIndex
                    ? 'bg-islamic-teal text-white'
                    : 'text-white hover:bg-slate-700'
                }`}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                data-testid={`autocomplete-item-${index}`}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-3 w-3 opacity-50" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
