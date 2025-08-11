import React, { useState, useRef, useEffect } from 'react';

const SelectSearch = ({
  options = [],
  value = null,
  onChange = () => {},
  className = '',
  placeholder = 'Search...',
  disabled = false,
  clearable = true,
  searchable = true,
  
  // What to display in the dropdown options
  labelKey = null, // For objects: key to show as label, for primitives: null
  
  // What to return in onChange
  returnKey = null, // For objects: key to return, for primitives: returns the value itself
  
  // Custom render functions
  renderOption = null, // Custom function to render each option
  renderSelected = null, // Custom function to render selected value
  
  // Additional props
  maxHeight = '200px',
  noOptionsText = 'No options found',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Normalize options to a consistent format
  const normalizeOptions = () => {
    return options.map((option, index) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return {
          id: option,
          label: option.toString(),
          value: option,
          originalIndex: index
        };
      } else if (typeof option === 'object' && option !== null) {
        const id = option.id || option.value || index;
        const label = labelKey ? option[labelKey] : (option.label || option.name || option.title || id);
        const returnValue = returnKey ? option[returnKey] : option;
        
        return {
          id,
          label: label.toString(),
          value: returnValue,
          originalIndex: index,
          original: option
        };
      }
      return {
        id: index,
        label: 'Invalid option',
        value: option,
        originalIndex: index
      };
    });
  };

  const normalizedOptions = normalizeOptions();

  // Find currently selected option
  const selectedOption = normalizedOptions.find(option => {
    if (returnKey && typeof value === 'object') {
      return JSON.stringify(option.value) === JSON.stringify(value);
    }
    return option.value === value || option.id === value;
  });

  // Filter options based on search term
  const filteredOptions = normalizedOptions.filter(option =>
    !searchable || option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleContainerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (searchable && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  const renderSelectedValue = () => {
    if (renderSelected && selectedOption) {
      return renderSelected(selectedOption.original || selectedOption.value);
    }
    return selectedOption ? selectedOption.label : placeholder;
  };

  const renderOptionItem = (option) => {
    if (renderOption) {
      return renderOption(option.original || option.value, option.label);
    }
    return option.label;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      {...props}
    >
      {/* Main Input/Display Area */}
      <div
        onClick={handleContainerClick}
        className={`
          flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
          ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}
        `}
      >
        <div className="flex-1">
          {searchable && isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full outline-none bg-transparent"
              placeholder={selectedOption ? selectedOption.label : placeholder}
              disabled={disabled}
            />
          ) : (
            <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
              {renderSelectedValue()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {clearable && selectedOption && !disabled && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
          style={{ maxHeight }}
        >
          <div className="overflow-auto" style={{ maxHeight }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  className={`
                    px-3 py-2 cursor-pointer hover:bg-gray-100
                    ${selectedOption && selectedOption.id === option.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                  `}
                >
                  {renderOptionItem(option)}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-center">
                {noOptionsText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default SelectSearch;