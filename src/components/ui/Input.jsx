// src/components/ui/Input.jsx
export const Input = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
      {...props}
    />
  );
};