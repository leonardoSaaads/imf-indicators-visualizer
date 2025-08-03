// src/components/ui/Alert.jsx
export const Alert = ({ type = 'info', title, children, className = '' }) => {
  const types = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };
  
  return (
    <div className={`p-4 border rounded-lg ${types[type]} ${className}`}>
      {title && <h4 className="font-medium mb-2">{title}</h4>}
      {children}
    </div>
  );
};