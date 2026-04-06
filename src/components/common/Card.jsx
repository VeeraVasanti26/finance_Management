import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, title, subtitle, icon: Icon, contentClassName }) => {
  return (
    <div className={twMerge('bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden', className)}>
      {(title || Icon) && (
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {Icon && (
            <div className="p-1.5 bg-indigo-50/50 text-indigo-600 rounded-lg">
              <Icon size={18} />
            </div>
          )}
        </div>
      )}
      <div className={twMerge('p-5', contentClassName)}>{children}</div>
    </div>
  );
};

export default Card;
