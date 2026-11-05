import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { vocabularyService } from '../services/vocabularyService';
import type { VocabularyItem } from '../types/vocabulary';
import { getArticle, getGenderColor, getPanelColor } from '../utils/helpers';
import { VocabularyDetailView } from '../components/VocabularyDetailView';
import { IconButton } from '../components/IconButton';

export const DetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // read the success message
    const location = useLocation();

    const [item, setItem] = useState<VocabularyItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const successMessage = location.state?.message;

    useEffect (() => {
        if (id) {
            vocabularyService.getById(Number(id))
                .then((data) => {
                    setItem(data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch vocabulary:", err);
                    setError("Vocabulary item not found.");
                    setIsLoading(false);
                });
        }
    }, [id]);

    const handleDelete = async () => {
        if (!item) return
        const confirmDelete = window.confirm(`Are you sure you want to delete "${item.word}"?`);
        if (!confirmDelete) return;

        try {
            await vocabularyService.delete(item.id);
            navigate('/search', { state: { message: '"${item.word}" successfully deleted!' } });
        }
        catch (err) {
            console.error("Failed to delete vocabulary:", err);
            alert("Failed to delete the word. Please try again.");
        }
    };

    if (isLoading) {
        return <div className="list-state">Loading vocabulary details...</div>
    }

    if (error || !item) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="error-banner">{error || "Item not found."}</div>
                <button className="search-button" onClick={() => navigate('/search')}>Back to Search</button>
            </div>
        );
        }

    return (
        <>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
                <button
                    onClick={() => navigate('/search')}
                    style={{ position: 'absolute',
                        left: 0, top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        lineHeight: 1,
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        fontSize: '24px' }}>
                        &larr;
                </button>
                {/*<h1 className="page-title" style={{ textAlign: 'center', margin: 0}}>Word Detail</h1>*/}
            </div>

            {successMessage && (
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    backgroundColor: '#e6fffa',
                    color: '#047857',
                    border: '1px solid #a7f3d0',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    textAlign: 'center',
                    fontWeight: '500' }}>
                    {successMessage}
                </div>
            )}

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="filter-card" style={{ position: 'relative', backgroundColor: getPanelColor(item.gender)}}>

                    <div style={{ position: 'absolute', top: '18px', right: '24px', display: 'flex', gap: '8px' }}>

                        {/*Edit button */}
                        <IconButton
                            icon="edit"
                            title="Edit Item"
                            onClick={() => navigate(`/edit/${item.id}`, { state: { vocabItem: item } })}
                        />

                        {/*delete button */}
                        <IconButton
                            icon="delete"
                            title="Delete Item"
                            color="#ef4444"
                            onClick={handleDelete}
                        />
                    </div>

                    <VocabularyDetailView item={item} />
                </div>
            </div>
        </>

        );
};

export default DetailPage;