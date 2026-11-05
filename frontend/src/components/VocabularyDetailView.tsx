import React, { useState, useEffect } from 'react';
import { vocabularyService } from '../services/vocabularyService';
import type { VocabularyItem } from '../types/vocabulary';
import { getArticle, getGenderColor, playAudio } from '../utils/helpers';
import { IconButton } from '../components/IconButton';
import './VocabularyDetailView.css';

interface Props {
    item: VocabularyItem;
}

export const VocabularyDetailView: React.FC<Props> = ({ item }) => {
    return (
        <div className="vocab-detail-container">
            {/* Image */}
            {item.image_url && (
                <div className="vocab-detail-image-wrapper">
                    <img src={item.image_url} alt={item.word} className="vocab-detail-image" />
                </div>
            )}

            {/* Dictionary-style Title */}
            <div className="vocab-detail-title-container"
                style={{ marginTop: item.image_url ? '0' : '48px' }}>
                <h1 className="vocab-detail-title" style={{ alignItems: 'center', columnGap: '12px', rowGap: '4px' }}>
                    <span>
                        {item.part_of_speech === 'noun' && item.gender && (
                            <span style={{ color: getGenderColor(item.gender) }} className="vocab-detail-article">
                                {getArticle(item.gender)}
                            </span>
                        )}
                        {item.word}
                    </span>

                    <div style={{ display: 'flex' }}>
                        <IconButton
                            icon="audio"
                            title="Listen Pronunciation"
                            onClick={(e) => {
                                e.stopPropagation()
                                const textToRead = item.part_of_speech === 'noun' && item.gender
                                    ? `${getArticle(item.gender)} ${item.word}`
                                    : item.word;
                                playAudio(textToRead);
                            }}
                        />
                    </div>

                    {/* plural */}
                    {item.part_of_speech === 'noun' && item.plural && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="vocab-detail-plural" style={{ margin: 0 }}>
                                {item.plural}
                            </span>

                            <IconButton
                                icon="audio"
                                title="Listen Plural Pronunciation"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    playAudio(`die ${item.plural}`);
                                }}
                            />
                        </div>
                    )}
                </h1>
            </div>

            {/* Part of Speech */}
            <div className="vocab-detail-pos">
                <p>
                    {item.part_of_speech} {item.gender ? `• ${item.gender}` : ''}
                    {item.is_regular !== undefined && item.is_regular !== null ? ` • ${item.is_regular ? 'Regular' : 'Irregular'}` : ''}
                </p>
            </div>

            {/* Verb Base Forms (if applicable) */}
            {item.verb_base_forms && (
                <div className="vocab-detail-section">
                    <span className="vocab-detail-label">Verb Forms:</span>
                    <p className="vocab-detail-text" style={{ fontFamily: 'monospace' }}>
                        {item.verb_base_forms.infinitive} • {item.verb_base_forms.present} • {item.verb_base_forms.past} • {item.verb_base_forms.past_participle}
                    </p>
                </div>
            )}

            {/* Meaning and examples */}
            {item.meaning && item.meaning.map((m, index) => (
                <div key={index} className="vocab-detail-section">
                    <span className="vocab-detail-label">
                        {item.meaning.length > 1 ? `Meaning ${index + 1}:` : 'Meaning:'}
                    </span>
                    <p className="vocab-detail-text">{m.mean}</p>

                    {/* Example Sentences */}
                    {m.example && m.example.length > 0 && (
                        <div style={{ marginTop: '8px'}}>
                            <span className="vocab-detail-label" style={{ fontSize: '1rem', opacity: 0.8 }}>Example Sentence:</span>
                            {m.example.map((ex, exIndex) => (
                                <p key={exIndex} className="vocab-detail-example" style={{ marginTop: '4px' }}>
                                    {ex}
                                </p>
                            ))}
                        </div>
                        )}
                </div>

            ))}
{/*
            <div className="vocab-detail-section">
                <span className="vocab-detail-label">Meaning:</span>
                <p className="vocab-detail-text">{item.meaning}</p>

            </div>
*/}

            {/* Example */}
            {/*
            {item.example && (
                <div className="vocab-detail-section">
                    <span className="vocab-detail-label">Example Sentence:</span>
                    <p className="vocab-detail-example">{item.example}</p>
                </div>
            )}
            */}

        </div>

    );
};