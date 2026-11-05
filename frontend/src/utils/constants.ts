import type {
    PartOfSpeechType,
    GenderType,
    PerfectAuxiliaryType,
    VerbType,
    TransitivityType,
    ReflexivityType,
    PersonalityType,
    SeparabilityType,
    AdverbialType,
    PronounType,
    ArticleType,
    WordRegisterType,
    ConnotationType,
    CaseGovernmentType,
    SentencePatternType,
    SentencePattern
    } from '../types/common';

// Define a generic Option type for selection
export type FilterOption<T> = {
  label: string;
  value: T;
};

// Map options strictly to PartOfSpeechType
export const PartOfSpeechOptions: FilterOption<PartOfSpeechType>[] = [
    { label: 'Noun', value: 'noun' },
    { label: 'Verb', value: 'verb' },
    { label: 'Adjective', value: 'adjective' },
    { label: 'Adverb', value: 'adverb' },
    { label: 'Pronoun', value: 'pronoun' },
    { label: 'Article', value: 'article' },
    { label: 'Preposition', value: 'preposition' },
    { label: 'Conjunction', value: 'conjunction' },
    { label: 'Numeral', value: 'numeral' },
    { label: 'Particle', value: 'particle' },
    { label: 'Interjection', value: 'interjection' },
    { label: 'Phrase', value: 'phrase' },
    { label: 'Idiom', value: 'idiom' }
];

// Map options strictly to GenderType
export const GenderOptions: FilterOption<GenderType>[] = [
    { label: 'Masculine (der)', value: 'masculine' },
    { label: 'Feminine (die)', value: 'feminine' },
    { label: 'Neuter (das)', value: 'neuter' }
];

export const PerfectAuxiliaryOptions: FilterOption<PerfectAuxiliaryType>[] = [
    { label: 'haben', value: 'haben'},
    { label: 'sein', value: 'sein'},
    { label: 'both', value: 'both'}
];

// verbType
export const VerbTypeOptions: FilterOption<VerbType>[] = [
    { label: 'Vollverb', value: 'full'},
    { label: 'Modalverb', value: 'modal'},
    { label: 'Hilfsverb', value: 'auxiliary'}
];

export const TransitivityOptions: FilterOption<TransitivityType>[] = [
    { label: 'Transitive (tr.)', value: 'transitive'},
    { label: 'Intransitive (intr.)', value: 'intransitive'},
    { label: 'Ambitransitive (tr. / intr.)', value: 'ambitransitive'}
];

export const ReflexivityOptions: FilterOption<ReflexivityType>[] = [
    { label:'Reflexive (refl.)', value:'reflexive'},
    { label:'Irreflexive (irrefl.)', value:'irreflexive'},
    { label:'Pseudo Reflexive (refl. / irrefl.)', value:'pseudo_reflexive'}
];

export const PersonalityOptions: FilterOption<PersonalityType>[] = [
    { label:'Personal (pers.)', value:'personal'},
    { label:'Impersonal (unpers.)', value:'impersonal'},
    { label:'both', value:'both'}
];

export const SeparabilityOptions: FilterOption<SeparabilityType>[] = [
    { label:'Separable (trennb.)', value:'separable'},
    { label:'Inseparable (untrennb.)', value:'inseparable'},
    { label:'both', value:'both'}
];

export const AdverbialOptions: FilterOption<AdverbialType>[] = [
    { label:'Time', value:'time'},
    { label:'Reason', value:'reason'},
    { label:'Manner', value:'manner'},
    { label:'Place', value:'place'}
];

export const PronounTypeOptions: FilterOption<PronounType>[] = [
    { label:'Personal (e.g. ich, du)', value:'personal'},
    { label:'Possessive (e.g. meiner, deine)', value:'possessive'},
    { label:'Reflexive (e.g. sich and dative forms)', value:'reflexive'},
    { label:'Relative (e.g. der, welcher)', value:'relative'},
    { label:'Demonstrative (e.g. dieser, jener)', value:'demonstrative'},
    { label:'Indefinite (e.g. jemand, niemand)', value:'indefinite'},
    { label:'Interrogative (e.g. wer, was, welcher)', value:'interrogative'},
];

export const ArticleTypeOptions: FilterOption<ArticleType>[] = [
    { label:'Definite Article (e.g. der, die, das)', value:'definite_article'},
    { label:'Indefinite Article (e.g. ein)', value:'indefinite_article'},
    { label:'Negative Article (e.g. kein)', value:'negative_article'},
    { label:'Possessive Article (e.g. dieser, jener, solcher )', value:'possessive_article'},
    { label:'Demonstrative Article (e.g. dieser, jener)', value:'demonstrative_article'},
    { label:'Indefinite Quantifier (e.g. jeder, aller, mancher, irgendein)', value:'indefinite_quantifier'},
];

export const WordRegisterOptions: FilterOption<WordRegisterType>[] = [
    { label:'Standard', value:'standard'},
    { label:'Conversational', value:'conversational'},
    { label:'Formal', value:'formal'},
    { label:'Literary', value:'literary'},
    { label:'Slang', value:'slang'}
];

export const ConnotationOptions: FilterOption<ConnotationType>[] = [
    { label:'Neutral', value:'neutral'},
    { label:'Positive', value:'positive'},
    { label:'Negative', value:'negative'},
    { label:'Ironic', value:'ironic'},
    { label:'Pejorative', value:'pejorative'}
];

export const CaseGovernmentOptions: FilterOption<CaseGovernmentType>[] = [
    { label:'mit Nominativ', value:'nominativ'},
    { label:'mit Akkusativ', value:'akkusativ'},
    { label:'mit Dativ', value:'dativ'},
    { label:'mit Genitiv', value:'genitiv'},
    { label:'Prepositional', value:'prepositional'},
    { label:'none', value:'none'},
    { label:'reflexive', value:'reflexive'},
    { label:'impersonal', value:'impersonal'},
];

export const SentencePatternTypeOptions: FilterOption<SentencePatternType>[] = [
    { label:'Conjunction ADUSO', value:'conjunction_aduso'},
    { label:'Subordinating Conjunction', value:'subordinating_conjunction'},
    { label:'Conjunction Adverb', value:'conjunction_adverb'},
    { label:'Double Conjunction', value:'double_conjunction'},
    { label:'Proportional Conjunction', value:'proportional_conjunction'},
    { label:'Infinitive Construction', value:'infinitive_construction'},
];

export const SentencePatternOptions: FilterOption<SentencePattern>[] = [
    { label:'Te-Ka-Mo-Lo', value:'tekamolo'},
    { label:'imperative', value:'imperative'},
    { label:'yes_no_question', value:'yes_no_question'},
    { label:'w_question', value:'w_question'},

    { label:'conjunction_aduso', value:'conjunction_aduso'},
    { label:'subordinating_main_first', value:'subordinating_main_first'},
    { label:'subordinating_sub_first', value:'subordinating_sub_first'},

    { label:'conjunctive_adverb_front', value:'conjunctive_adverb_front'},
    { label:'conjunctive_adverb_mid', value:'conjunctive_adverb_mid'},

    { label:'dual_standard', value:'dual_standard'},
    { label:'dual_inversion', value:'dual_inversion'},
    { label:'dual_mid_sentence', value:'dual_mid_sentence'},
    { label:'dual_concession', value:'dual_concession'},

    { label:'proportional_conjunction', value:'proportional_conjunction'},

    { label:'relative', value:'relative'},
    { label:'relative_embedded', value:'relative_embedded'},
    { label:'indirect_question', value:'indirect_question'},
    { label:'comparative_standard', value:'comparative_standard'},
    { label:'comparative_unreal', value:'comparative_unreal'},
    { label:'infinitive_construction', value:'infinitive_construction'},
    { label:'infinitive_bare', value:'infinitive_bare'},
    { label:'infinitive_front', value:'infinitive_front'},
    { label:'infinitive_embedded', value:'infinitive_embedded'},
    { label:'subordinate_embedded', value:'subordinate_embedded'},

    { label:'conditional_verb_first', value:'conditional_verb_first'},
    { label:'participle_clause', value:'participle_clause'},
    { label:'apposition', value:'apposition'},
];