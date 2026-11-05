import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { VocabularyCreatePayload } from '../types/vocabulary';
import { vocabularyService } from '../services/vocabularyService';
import { VocabularyForm } from '../components/VocabularyForm';

export const AddPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    //get word from SearchPage, if have
    const initialWord = location.state?.prefilledWord || '';

    // manage Loading state only, manage Error in VocabularyForm
    const [isLoading, setIsLoading] = useState(false);

    // handle adding new word
    const handleCreate = async (data: VocabularyCreatePayload) => {
        setIsLoading(true);
        try{
            const newItem = await vocabularyService.create(data);
            navigate(`/detail/${newItem.id}`, { state: { message: 'Vocabulary successfully added!' } });
        }
        finally {
            setIsLoading(false)
        }
    };

    return (
        <>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
                <button onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute',
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
                <h1 className="page-title" style={{ textAlign: 'center', margin: 0}}>Add New Word</h1>
            </div>
            <p className="page-subtitle" style={{ textAlign: 'center' }}>Expand your collection.</p>

            <VocabularyForm
                initialData={{ word: initialWord }}
                onSubmit={handleCreate}
                isLoading={isLoading}
                submitLabel="Save Word"
            />
        </>
    );
};

export default AddPage;