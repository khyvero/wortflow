export type PartOfSpeechType =
    | 'noun'
    | 'verb'
    | 'adjective'
    | 'adverb'
    | 'pronoun' 
    | 'article'
    | 'preposition'
    | 'conjunction'
    | 'numeral'
    | 'particle'
    | 'interjection'
    | 'phrase'
    | 'idiom';

export type GenderType =
    | 'masculine'
    | 'feminine'
    | 'neuter';

export type WordRegisterType =
    |'standard'
    |'conversational'
    |'formal'
    |'literary'
    |'slang'

export type ConnotationType =
    |'neutral'
    |'positive'
    |'negative'
    |'ironic'
    |'pejorative'

export type PerfectAuxiliaryType =
    |'haben'
    |'sein'
    |'both'

export type VerbType =
    |'full'
    |'modal'
    |'auxiliary'

export type TransitivityType =
    |'transitive'
    |'intransitive'
    |'ambitransitive'

export type ReflexivityType =
    |'reflexive'
    |'irreflexive'
    |'pseudo_reflexive'

export type PersonalityType =
    |'personal'
    |'impersonal'
    |'both'

export type SeparabilityType =
    |'separable'
    |'inseparable'
    |'both'

export type AdverbialType =
    |'time'
    |'reason'
    |'manner'
    |'place'

export type PronounType =
    |'personal'
    |'possessive'
    |'reflexive'
    |'relative'
    |'demonstrative'
    |'indefinite'
    |'interrogative'

export type ArticleType =
    |'definite_article'
    |'indefinite_article'
    |'negative_article'
    |'possessive_article'
    |'demonstrative_article'
    |'indefinite_quantifier'

export type CaseGovernmentType =
    |'nominativ'
    |'akkusativ'
    |'dativ'
    |'genitiv'
    |'prepositional'
    |'none'
    |'reflexive'
    |'impersonal'

export type SentencePatternType =
    |'conjunction_aduso'
    |'subordinating_conjunction'
    |'conjunction_adverb'
    |'double_conjunction'
    |'proportional_conjunction'
    |'infinitive_construction'

export type SentencePattern =
    |'tekamolo'
    |'imperative'
    |'yes_no_question'
    |'w_question'

    |'conjunction_aduso'
    |'subordinating_main_first'
    |'subordinating_sub_first'

    |'conjunctive_adverb_front'
    |'conjunctive_adverb_mid'

    |'dual_standard'
    |'dual_inversion'
    |'dual_mid_sentence'
    |'dual_concession'

    |'proportional_conjunction'

    |'relative'
    |'relative_embedded'
    |'indirect_question'
    |'comparative_standard'
    |'comparative_unreal'
    |'infinitive_construction'
    |'infinitive_bare'
    |'infinitive_front'
    |'infinitive_embedded'
    |'subordinate_embedded'

    |'conditional_verb_first'
    |'participle_clause'
    |'apposition'

export interface MeaningItem {
    mean: string;
    example?: string[] | null;
}

export interface PatternItem {
    type: CaseGovernmentType[];
    pattern?: string;
    meaning?: MeaningItem[] | null;
}

export interface SentencePatternItem {
    type?: SentencePatternType | null;
    pattern: SentencePattern;
    meaning?: MeaningItem[] | null;
}

export interface VerbBaseFormsItem {
    present: string;
    past: string;
    past_participle: string;
}

export interface ConjugationTable {
    praesens?: Record<string, string> | null;
    praeteritum?: Record<string, string> | null;
    perfekt?: Record<string, string> | null;
    plusquamperfekt?: Record<string, string> | null;
    futur1?: Record<string, string> | null;
    futur2?: Record<string, string> | null;
    konjunktiv1?: Record<string, string> | null;
    konjunktiv2?: Record<string, string> | null;
    konjunktiv2_wuerde?: Record<string, string> | null;
}

export interface DegreesItem {
    comparative: string;
    superlative: string;
}

export interface ContractionItem {
    preposition: string;
    article: string;
    result: string;
}

export interface DeclensionTable {
    nominativ?: Record<string, string> | null;
    akkusativ?: Record<string, string> | null;
    dativ?: Record<string, string> | null;
    genitiv?: Record<string, string> | null;
}

export interface PersonalPronounMatrix {
    nominativ?: string | null;
    akkusativ?: string | null;
    dativ?: string | null;
    genitiv?: string | null;
}

export interface ReflexivePronounMatrix {
    akkusativ?: Record<string, string> | null;
    dativ?: Record<string, string> | null;
}

export interface DeclensionMatrix {
    declension?: DeclensionTable | null;
}

export interface RelatedItem {
    id: number
    word: string;
    part_of_speech: PartOfSpeechType;
}

export interface WordFamilyItem {
    root?: string | null;
    words?: RelatedItem[] | null;
}