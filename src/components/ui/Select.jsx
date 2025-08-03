// src/components/ui/Select.jsx
export const Select = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Selecione...', 
  className = '',
  disabled = false,
  multiple = false
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(multiple ? [...e.target.selectedOptions].map(o => o.value) : e.target.value)}
      disabled={disabled}
      multiple={multiple}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    >
      {!multiple && <option value="">{placeholder}</option>}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
