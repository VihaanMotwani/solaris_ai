// src/components/ui/card.tsx
interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
  }
  
  export function Card({ children, className = '', title, description, footer }: CardProps) {
    return (
      <div className={`bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 ${className}`}>
        {(title || description) && (
          <div className="px-6 py-4 border-b border-gray-200">
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
        )}
        
        <div className="px-6 py-4">
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    );
  }
  