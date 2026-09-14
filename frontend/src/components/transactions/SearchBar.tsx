import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search transactions...',
}: SearchBarProps) {
  return (
    <div className="relative group w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 dark:text-surface-500 group-focus-within:text-brand-500 dark:group-focus-within:text-neon-violet transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-10 w-full text-base sm:text-sm"
        aria-label="Search transactions"
      />
    </div>
  );
}
