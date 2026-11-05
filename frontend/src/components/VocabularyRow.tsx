import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { VocabularyItem } from '../types/vocabulary';
import { getArticle, getGenderColor, playAudio } from '../utils/helpers';
import { IconButton } from '../components/IconButton';
import './VocabularyList.css';

interface VocabularyRowProps {
  item: VocabularyItem;
  onEdit?: (item: VocabularyItem) => void;
  onClick?: (item: VocabularyItem) => void;
}

export const VocabularyRow: React.FC<VocabularyRowProps> = ({ item, onEdit, onClick}) => {

    const navigate = useNavigate();

    // Map gender to German articles and badges
    const renderGenderBadge = () => {
        if (!item.gender) return <div className="badge-placeholder" />;

        const genderMap = {
            masculine: { label: 'der', class: 'badge-der' },
            feminine: { label: 'die', class: 'badge-die' },
            neuter: { label: 'das', class: 'badge-das' },
            };

        const config = genderMap[item.gender as keyof typeof genderMap];
        if (!config) return <div className="badge-placeholder" />;

        return <span className={`gender-badge ${config.class}`}>{config.label}</span>
        };

    return (
        <div className="vocab-row" onClick={() => onClick && onClick(item)} style={{ cursor: 'pointer' }}>
            {/* Left column: gender badge, word, part of speech */}
            <div className="vocab-col-left">
                <div className="badge-container">{renderGenderBadge()}</div>
                <div className="word-meta">
                    <h3 className="word-title" lang="de">{item.word}</h3>
                    <span className="pos-label">{item.part_of_speech}</span>
                </div>
            </div>

            {/* Middle Column: meaning & example sentence */}
            <div className="vocab-col-middle">
                <div className="meaning-text">
                {item.meaning.map(m => m.mean).join(' / ')}
                </div>
            </div>

            {/* Right column:  audio action & edit action*/}
            <div className="vocab-col-right">
                <IconButton
                    icon="audio"
                    title="Listen Pronunciation"
                    onClick={(e) => {
                        e.stopPropagation();
                        playAudio(item.word);
                        }}
                />
                <IconButton
                    icon="edit"
                    title="Edit Item"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit/${item.id}`, { state: { vocabItem: item }});
                    }}
                />
            </div>
        </div>
        );
    };