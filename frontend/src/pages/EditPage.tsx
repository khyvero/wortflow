import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { VocabularyCreatePayload, VocabularyItem } from '../types/vocabulary';
import { vocabularyService } from '../services/vocabularyService';
import { VocabularyForm } from '../components/VocabularyForm';

export const EditPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // get word from VocabularyRow
    const [vocabItem, setVocabItem] = useState<VocabularyItem | null>(
        location.state?.vocabItem as VocabularyItem || null
    );

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!location.state?.vocabItem);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!vocabItem && id) {
            vocabularyService.getById(Number(id))
                .then((data) => {
                    setVocabItem(data);
                    setIsFetching(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch vocabulary item:", err);
                    setError("Vocabulary item not found.");
                    setIsFetching(false);
                });
        }
    }, [id, vocabItem]);

    const handleUpdate = async (data: VocabularyCreatePayload) => {
        if (!vocabItem) return;
        setIsLoading(true);
        try {
            await vocabularyService.update(vocabItem.id, data);
            navigate(`/detail/${vocabItem.id}`, { state: { message: 'Vocabulary successfully updated!' } });
        }
        catch (err) {
            console.error("Failed to update vocabulary:", err);
            setError("Failed to save the updated word. Please try again.");
        }
        finally{
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="list-state">Loading vocabulary details...</div>;
    }

    if (error || !vocabItem) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="error-banner">{error || "Vocabulary item not found."}</div>
                <button className="search-button" onClick={() => navigate('/search')}>
                    Back to Search
                </button>
            </div>
        );
    }

    return (
        <>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
                <button onClick={() => navigate(-1)}
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
                <h1 className="page-title" style={{ textAlign: 'center', margin: 0}}>Edit Word</h1>
            </div>
            <p className="page-subtitle" style={{ textAlign: 'center' }}>Update your vocabulary.</p>

            <VocabularyForm
                initialData={vocabItem}
                onSubmit={handleUpdate}
                isLoading={isLoading}
                submitLabel="Update Word"
            />
        </>
    );
};

export default EditPage;