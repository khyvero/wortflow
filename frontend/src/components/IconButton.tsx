import React from 'react';

interface IconButtonProps {
    icon: 'add' | 'remove' | 'edit' | 'delete' | 'audio';
    onClick: (e: React.MouseEvent) => void;
    title: string;
    color?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({icon, onClick, title, color }) => {
    const renderIcon =() => {
        switch (icon) {
            case 'add':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                );
            case 'remove':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                );
            case 'edit':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                );
            case 'delete':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                );
            case 'audio':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <button
            type="button"
            className="icon-btn"
            title={title}
            style={{border: 'none', cursor: 'pointer', color: color || 'inherit'}}
            onClick={onClick}
        >
            {renderIcon()}
        </button>
    );
};