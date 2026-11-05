import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { VocabularyItem } from '../types/vocabulary';
import { getArticle, getGenderColor } from '../utils/helpers';
import { vocabularyService } from '../services/vocabularyService';
import { VocabularyDetailView } from '../components/VocabularyDetailView';
import { IconButton } from '../components/IconButton';
import './VocabularyDrawer.css';

interface VocabularyDrawerProps {
    item: VocabularyItem | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (id: string) => void;
}

export const VocabularyDrawer: React.FC<VocabularyDrawerProps> = ({ item, isOpen, onClose, onDelete }) => {

    const navigate = useNavigate();

    if (!item && !isOpen)
        return null;

    const handleDelete = async () => {
        if (!item) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete "${item.word}"?`);
        if (!confirmDelete) return;

        try {
            await vocabularyService.delete(item.id);
            onClose();
            if (onDelete) {
                onDelete(item.id.toString());
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error("Failed to delete vocabulary:", err);
            alert("Failed to delete the word. Please try again.");
        }
    };

    const genderPanelClass = item?.gender ? `gender-${item.gender}` : '';

    return (
        // Clicking the backdrop automatically closes the drawer
        <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}>
            {/* e.stopPropagation() prevents closing when clicking inside the panel */}
            <div className={`drawer-panel ${genderPanelClass}`} onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                    {/*<h2>Word Details</h2>*/}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
                        <button className="drawer-close-btn" onClick={onClose}>&times;</button>
                    </div>
                </div>

                <div className="drawer-content" style={{ position: 'relative'}}>
                    {item && (
                        <>
                            <div style={{ position: 'absolute', top: '18px', right: '24px', width: 'auto', display: 'flex', gap: '8px', zIndex: 10 }}>
                                {/* Edit */}
                                <IconButton
                                    icon="edit"
                                    title="Edit Item"
                                    onClick={() => {
                                        onClose();
                                        navigate(`/edit/${item.id}`, { state: { vocabItem: item }});
                                    }}
                                />

                                {/* Delete */}
                                <IconButton
                                    icon="delete"
                                    title="Delete Item"
                                    color="#ef4444"
                                    onClick={handleDelete}
                                />
                            </div>
                            <VocabularyDetailView item={item} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};