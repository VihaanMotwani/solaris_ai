// src/components/ui/badge.tsx
interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md';
    rounded?: boolean;
  }
  
  export function Badge({ children, variant = 'default', size = 'md', rounded = false }: BadgeProps) {
    // Variant styles
    let variantClasses = '';
    
    switch (variant) {
      case 'default':
        variantClasses = 'bg-gray-100 text-gray-800';
        break;
      case 'primary':
        variantClasses = 'bg-primary-100 text-primary-800';
        break;
      case 'success':
        variantClasses = 'bg-green-100 text-green-800';
        break;
      case 'warning':
        variantClasses = 'bg-yellow-100 text-yellow-800';
        break;
      case 'danger':
        variantClasses = 'bg-red-100 text-red-800';
        break;
    }
    
    // Size styles
    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-sm';
    
    // Rounded style
    const roundedClasses = rounded ? 'rounded-full' : 'rounded';
    
    return (
      <span className={`inline-flex items-center font-medium ${variantClasses} ${sizeClasses} ${roundedClasses}`}>
        {children}
      </span>
    );
  }