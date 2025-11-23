import React, { useState } from 'react';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Check, ChevronsUpDown, Sparkles } from 'lucide-react';
import { INDIAN_UNIVERSITIES } from '../utils/constants';
import { cn } from './ui/utils';

interface UniversitySelectorProps {
  value: string;
  onChange: (university: string) => void;
  placeholder?: string;
  className?: string;
}

export function UniversitySelector({ value, onChange, placeholder = "Select your university...", className }: UniversitySelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between h-12 border-2 hover:border-[#2F5DCE] transition-all duration-300 bg-gray-50 hover:bg-white", className)}
            type="button"
          >
            {value
              ? value.length > 35 
                ? value.substring(0, 35) + "..."
                : value
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[420px] p-0 shadow-2xl border-0" align="start">
          <Command className="rounded-xl">
            <CommandInput placeholder="Search universities..." className="h-12" />
            <CommandEmpty>No university found.</CommandEmpty>
            <CommandList className="max-h-60">
              {Object.entries(INDIAN_UNIVERSITIES).map(([category, universities]) => (
                <CommandGroup key={category} heading={category} className="py-2">
                  {universities.map((uni, index) => (
                    <CommandItem
                      key={`${category}-${index}-${uni}`}
                      value={uni}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : uni);
                        setOpen(false);
                      }}
                      className="py-3 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <Check
                        className={cn(
                          "mr-3 h-4 w-4 text-[#2F5DCE]",
                          value === uni ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{uni}</span>
                        {category === 'IITs & IIMs' && (
                          <span className="text-xs text-blue-600 font-medium">Institute of National Importance</span>
                        )}
                        {category === 'Central Universities' && (
                          <span className="text-xs text-green-600 font-medium">Government - Central</span>
                        )}
                        {category === 'State Universities' && (
                          <span className="text-xs text-purple-600 font-medium">Government - State</span>
                        )}
                        {category === 'Deemed Universities' && (
                          <span className="text-xs text-orange-600 font-medium">Deemed University</span>
                        )}
                        {category === 'Private Universities' && (
                          <span className="text-xs text-red-600 font-medium">Private</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              <CommandGroup heading="Other">
                {['Other Indian University', 'International University'].map((uni, index) => (
                  <CommandItem
                    key={`other-${index}-${uni}`}
                    value={uni}
                    onSelect={() => {
                      onChange(uni);
                      setOpen(false);
                    }}
                    className="py-3 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Check
                      className={cn(
                        "mr-3 h-4 w-4 text-[#2F5DCE]",
                        value === uni ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {uni}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        Can't find your university? Select "Other Indian University"
      </p>
    </div>
  );
}