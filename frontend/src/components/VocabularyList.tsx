import React, { useState } from 'react';
import type { VocabularyItem } from '../types/vocabulary';
import { VocabularyRow } from './VocabularyRow';
import { VocabularyDrawer } from './VocabularyDrawer';
import './VocabularyList.css';

interface VocabularyListProps {
    items: VocabularyItem[];
    isLoading: boolean;
}

export const VocabularyList: React.FC<VocabularyListProps> = ({ items, isLoading }) => {
    const safeItems = Array.isArray(items) ? items : [];

    const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);

    return (
        <div className="results-container">
            {/* Header Bar */}
            <div className="results-header">
                <div className="results-count">
                    <h2>Search results</h2>
                    <span className="count-pill">{safeItems.length} matches</span>
            </div>
            <div className="pagination-arrows">
                <button className="arrow-btn" disabled>&larr;</button>
                <button className="arrow-btn" disabled>&rarr;</button>
            </div>
        </div>

        {/* Rows List Container */}
        <div className="list-card">
            {isLoading ? (
                    <div className="list-state">Loading vocabulary items...</div>
                ) : safeItems.length === 0 ? (
                    <div className="list-state">No matching words found.</div>
                ) : (safeItems.map((item) => (
                    <VocabularyRow key={item.id} item={item}
                        onClick={(clickedItem) => setSelectedWord(clickedItem)}
                    />
                )))
            }
            </div>

            <VocabularyDrawer
                item={selectedWord}
                isOpen={selectedWord !== null}
                onClose={() => setSelectedWord(null)}
            />
        </div>
    );
};