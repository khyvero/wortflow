import React, { useState } from 'react';
import type { VocabularySearchParams, GenderType, PartOfSpeechType } from '../types/vocabulary';
import { GenderOptions, PartOfSpeechOptions } from '../utils/constants';
import CustomSelect from './CustomSelect';
import './SearchFilters.css';

interface SearchFiltersProps {
  onSearch: (params: VocabularySearchParams) => void;
  isLoading: boolean;
  onAddWord?: (word: string) => void;
}

// Define a generic Option type that allows 'all' plus your specific types
type FilterOption<T> = {
  label: string;
  value: 'all' | T;
};

// Map options strictly to GenderType
const searchGenderOptions = [
  { label: 'All', value: 'all' },
  ...GenderOptions
];

// Map options strictly to PartOfSpeechType
const searchPartOfSpeechOptions = [
  { label: 'All', value: 'all' },
  ...PartOfSpeechOptions
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, isLoading, onAddWord}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [gender, setGender] = useState<'all' | GenderType>('all');
    const [partOfSpeech, setPartOfSpeech] = useState<'all' | PartOfSpeechType>('all');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const params: VocabularySearchParams = {};
        if (searchTerm.trim()) params.word = searchTerm.trim();
        if (gender !== 'all') params.gender = gender;
        if (partOfSpeech !== 'all') params.part_of_speech = partOfSpeech;

        onSearch(params)
    };

    return(
        <form className="filter-card" onSubmit={handleSubmit}>
            <div className="filter-grid">
                {/* Word / Meaning Input */}
                <div className="filter-group word-group">
                    <label>Word or Meaning</label>
                    <div className="input-with-icon">
                        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search word or meaning."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Gender Dropdown */}
                <div className="filter-group">
                    <label>Gender</label>
                    <CustomSelect value={gender} onChange={(val) => setGender(val as 'all' | GenderType)} options={searchGenderOptions}/>
                </div>

                {/* Part of Speech Dropdown */}
                <div className="filter-group">
                    <label>Part of Speech</label>
                    <CustomSelect value={partOfSpeech} onChange={(val) => setPartOfSpeech(val as 'all' | PartOfSpeechType)} options={searchPartOfSpeechOptions}/>
                </div>

                {/* Submit Button & Add word Button */}
                <div className="filter-group button-group">
                    <button type="submit" className="search-button" disabled={isLoading}>
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>

                    <button type="button" className="create-button" disabled={isLoading || !searchTerm.trim()}
                        onClick={() => onAddWord && onAddWord(searchTerm.trim())}>
                        + Add
                    </button>
                </div>
            </div>
        </form>
    );
};