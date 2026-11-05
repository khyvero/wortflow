import React from 'react';
import type { UseFormRegister, Path } from 'react-hook-form';
import type { VocabularyCreatePayload } from '../types/vocabulary';

interface MatrixGridProps {
    register: UseFormRegister<VocabularyCreatePayload>;
    matrixName: string;
}

// for personal_pronoun_matrix
export const PersonalPronounGrid: React.FC<MatrixGridProps> = ({ register, matrixName }) => {
    return (
        <div className="four-col-grid">
            <input
                type="text"
                placeholder="Nominativ"
                {...register(`${matrixName}.nominativ` as Path<VocabularyCreatePayload>)}
            />
            <input
                type="text"
                placeholder="Akkusativ"
                {...register(`${matrixName}.akkusativ` as Path<VocabularyCreatePayload>)}
            />
            <input
                type="text"
                placeholder="Dativ"
                {...register(`${matrixName}.dativ` as Path<VocabularyCreatePayload>)}
            />
            <input
                type="text"
                placeholder="Genitiv"
                {...register(`${matrixName}.genitiv` as Path<VocabularyCreatePayload>)}
            />
        </div>
    );
};

// for possessive_article_matrix, possessive_pronoun_matrix, generic_declension_matrix
export const DeclensionGrid: React.FC<MatrixGridProps> = ({ register, matrixName }) => {
    const cases = ['nominativ', 'akkusativ', 'dativ', 'genitiv'];
    const genders = ['masculine', 'feminine', 'neuter', 'plural'];

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(4, 1fr)', gap: '4px', overflowX: 'auto' }}>
            <div />
            {genders.map(g => (
                <div key={g} style={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>
                    {capitalize(g)}
                </div>
            ))}

            {cases.map(c => (
                <React.Fragment key={c}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px', alignSelf: 'center' }}>{capitalize(c)}</div>
                    {genders.map(g => (
                        <input
                            key={`${c}-${g}`}
                            type="text"
                            style={{ padding: '4px', fontSize: '13px' }}
                            // RHF
                            {...register(`${matrixName}.declension.${c}.${g}` as Path<VocabularyCreatePayload>)}
                        />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
};

// for reflexive_pronoun_matrix
export const ReflexiveGrid: React.FC<MatrixGridProps> = ({ register, matrixName }) => {
    const cases = ['akkusativ', 'dativ'];
    const persons = ['ich', 'du', 'er', 'sie_sg', 'es', 'wir', 'ihr', 'sie_pl', 'Sie'];

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const formatLabel = (p: string) => {
        if (p === 'sie_sg' || p === 'sie_pl') return 'sie';
        return p;
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(9, 1fr)', gap: '4px', overflowX: 'auto' }}>
            <div />
            {persons.map(p => (
                <div key={p} style={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>
                    {formatLabel(p)}
                </div>
            ))}

            {cases.map(c => (
                <React.Fragment key={c}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px', alignSelf: 'center' }}>{capitalize(c)}</div>
                    {persons.map(p => (
                        <input
                            key={`${c}-${p}`}
                            type="text"
                            style={{ padding: '4px', fontSize: '13px' }}
                            // RHF
                            {...register(`${matrixName}.${c}.${p}` as Path<VocabularyCreatePayload>)}
                        />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
};