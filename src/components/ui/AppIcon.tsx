import React from 'react';
import { HelpCircle } from 'lucide-react';

type IconVariant = 'outline' | 'solid';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: string;
    variant?: IconVariant;
    size?: number;
    className?: string;
    disabled?: boolean;
}

/**
 * AppIcon - A wrapper component that provides icon rendering.
 * Falls back to HelpCircle when icon cannot be found.
 * NOTE: This component is kept for backwards compatibility.
 * Consider using lucide-react icons directly instead.
 */
function Icon({
    name,
    variant = 'outline',
    size = 24,
    className = '',
    onClick,
    disabled = false,
    ...props
}: IconProps) {
    // Since @heroicons/react is not installed, we return a placeholder icon
    // Consider migrating to lucide-react icons which are already in use throughout the project
    return (
        <HelpCircle
            width={size}
            height={size}
            className={`text-gray-400 ${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
            onClick={disabled ? undefined : onClick}
            {...(props as any)}
        />
    );
}

export default Icon;
