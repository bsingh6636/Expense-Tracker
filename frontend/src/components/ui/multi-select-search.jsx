/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Badge } from './badge';
import { cn } from "../../utils/lib"


// A small checkmark icon
const CheckIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-check", className)}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// A small X icon for the badges
const XIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-x", className)}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);


const MultiSelectSearch = ({
  options = [],
  value = [],
  callBack,
  labelKey = 'label',
  valueKey = 'value',
  placeholder = 'Select options...',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Helper functions to handle both string and object options
  const getOptionValue = (option) => 
    typeof option === 'string' ? option : option?.[valueKey];
  
  const getOptionLabel = (option) =>
    typeof option === 'string' ? option : option?.[labelKey];

  // Find the full option objects for the selected values
  const selectedOptions = React.useMemo(
    () => options.filter(option => value.includes(getOptionValue(option))),
    [options, value, getOptionValue]
  );

  // Filter options based on search term
  const filteredOptions = React.useMemo(
    () =>
      options.filter(option =>
        getOptionLabel(option)?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm, getOptionLabel]
  );
  
  const handleSelect = (option) => {
    const optionValue = getOptionValue(option);
    const newSelection = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    
    callBack(newSelection);
  };
  
  const handleUnselect = (optionValue) => {
    const newSelection = value.filter((v) => v !== optionValue);
    callBack(newSelection);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <div className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <div className="flex flex-wrap items-center gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <Badge
                  key={getOptionValue(option)}
                  variant="secondary"
                  className="flex items-center gap-1.5 capitalize"
                >
                  {getOptionLabel(option)}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent opening the popover
                      handleUnselect(getOptionValue(option));
                    }}
                    className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
        </div>
      </Popover.Trigger>
      
      <Popover.Content
        className="w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-2"
        />
        <div className="max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const optionValue = getOptionValue(option);
              const isSelected = value.includes(optionValue);
              return (
                <div
                  key={optionValue}
                  onClick={() => handleSelect(option)}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  {getOptionLabel(option)}
                  {isSelected && <CheckIcon className="ml-auto h-4 w-4" />}
                </div>
              );
            })
          ) : (
            <div className="py-2 px-3 text-center text-sm text-muted-foreground">
              No options found.
            </div>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default MultiSelectSearch;