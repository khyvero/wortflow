import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchFilters } from '../components/SearchFilters';
import { VocabularyList } from '../components/VocabularyList';
import { vocabularyService } from '../services/vocabularyService';
import type { VocabularyItem, VocabularySearchParams } from '../types/vocabulary';

export const SearchPage: React.FC = () => {
    const [items, setItems] = useState<VocabularyItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSearch = useCallback(async (params: VocabularySearchParams = {}) => {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        try{
            const data = await vocabularyService.search(params);
            setItems(data);
            }
        catch (err) {
            console.error('Failed to fetch vocabularies:', err);
            setError('Unable to load vocabulary items. Ensure your FastAPI server is running.');
            }
        finally {
            setIsLoading(false);
            }
    },[]);

    {/* Add new word*/}
    const handleAddWord = async (word: string) => {
        setIsLoading(true);
        setError(null);
        try{
            const results = await vocabularyService.search({ word });

            const exactMatch = results.find(
                item => item.word.toLowerCase() === word.toLowerCase()
            );

            if (exactMatch) {
                setError(`"${word}" already exists in your collection!`);
                setItems([exactMatch]);
                setHasSearched(true);
            }
            else {
                navigate('/add', {state: { prefilledWord: word }});
            }
        }
        catch (err){
            console.error('Failed to verify word:', err);
            setError('Unable to verify word. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="page-title">Find a vocabulary</h1>
            <p className="page-subtitle">
                Search your German collection by word, gender, part of speech, or meaning.
            </p>

            <SearchFilters onSearch={handleSearch} onAddWord={handleAddWord} isLoading={isLoading} />

            {error && <div className="error-banner">{error}</div>}

            {hasSearched && (
                <VocabularyList items={items} isLoading={isLoading} />
            )}
        </>
        );
    };

export default SearchPage;