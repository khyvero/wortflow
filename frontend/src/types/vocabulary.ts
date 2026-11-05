import type {
    PartOfSpeechType,
    GenderType,
    PerfectAuxiliaryType,
    VerbType,
    TransitivityType,
    ReflexivityType,
    PersonalityType,
    SeparabilityType,
    WordRegisterType,
    ConnotationType,
    AdverbialType,
    PronounType,
    MeaningItem,
    PatternItem,
    SentencePatternItem,
    VerbBaseFormsItem,
    ConjugationTable,
    DegreesItem,
    ContractionItem,
    PersonalPronounMatrix,
    ReflexivePronounMatrix,
    DeclensionMatrix,
    RelatedItem,
    WordFamilyItem,
    ArticleType
} from './common';


// Vocabulary Response
export interface VocabularyItem{
    id: number;
    word: string;
    part_of_speech: PartOfSpeechType;
    meaning: MeaningItem[];
    image_url?: string | null;

    // levels and tone
    word_register?: WordRegisterType[] | null;
    connotation?: ConnotationType[] | null;

    // noun fields
    gender?: GenderType | null;
    plural?: string | null;

    // verb, Adjective, adverb
    is_regular?: boolean | null;

    // verb fields
    verb_base_forms?: VerbBaseFormsItem | null;
    perfect_auxiliary?: PerfectAuxiliaryType | null;
    conjugation_table?: ConjugationTable | null;
    verb_type?: VerbType | null;
    transitivity?: TransitivityType | null;
    reflexivity?: ReflexivityType | null;
    personality?: PersonalityType | null;
    separability?: SeparabilityType | null;

    // adjective fields
    special_declension?: string | null;

    // adverb fields
    adverbial_type?: AdverbialType[] | null;

    // adjective , adverb
    degrees?: DegreesItem | null;

    // preposition fields
    contraction?: ContractionItem | null;

    // pronoun fields
    pronoun_type?: PronounType | null;
    declension_form?: string | null;
    personal_pronoun_matrix?: PersonalPronounMatrix | null;
    possessive_article_matrix?: DeclensionMatrix | null;
    possessive_pronoun_matrix?: DeclensionMatrix | null;
    reflexive_pronoun_matrix?: ReflexivePronounMatrix | null;
    generic_declension_matrix?: DeclensionMatrix | null;

    // article fields
    article_type?: ArticleType | null;

    // patterns and governance
    case_governance?: PatternItem[] | null;
    sentence_pattern?: SentencePatternItem[] | null;

    // relative words
    word_families?: WordFamilyItem[] | null;
    synonyms?: RelatedItem[] | null;
    antonyms?: RelatedItem[] | null;
    related_phrases?: RelatedItem[] | null;
    related_idioms?: RelatedItem[] | null;

    grammar_notes?: string[] | null;

    created_at: string;
    updated_at: string;
    }

// GET /vocabulary, filters search
export interface VocabularySearchParams {
    word?: string;
    part_of_speech?: PartOfSpeechType;
    gender?: GenderType;
    meaning?: string;
    skip?: number;
    limit?: number;
    }

// POST /vocabulary, Create a new Vocabulary
export interface VocabularyCreatePayload{
    word: string;
    part_of_speech: PartOfSpeechType;
    meaning: MeaningItem[];
    image_url?: string | null;

    // levels and tone
    word_register?: WordRegisterType[] | null;
    connotation?: ConnotationType[] | null;

    // noun
    gender?: GenderType | null;
    plural?: string | null;

    // verb, Adjective
    is_regular?: boolean | null;

    // verb
    verb_base_forms?: VerbBaseFormsItem | null;
    perfect_auxiliary?: PerfectAuxiliaryType | null;
    conjugation_table?: ConjugationTable | null;
    verb_type?: VerbType | null;
    transitivity?: TransitivityType | null;
    reflexivity?: ReflexivityType | null;
    personality?: PersonalityType | null;
    separability?: SeparabilityType | null;

    // adjective fields
    special_declension?: string | null;

    // adverb
    adverbial_type?: AdverbialType[] | null;

    // adjective , adverb
    degrees?: DegreesItem | null;

    // pronoun
    pronoun_type?: PronounType | null;
    declension_form?: string | null;
    personal_pronoun_matrix?: PersonalPronounMatrix | null;
    possessive_article_matrix?: DeclensionMatrix | null;
    possessive_pronoun_matrix?: DeclensionMatrix | null;
    reflexive_pronoun_matrix?: ReflexivePronounMatrix | null;
    generic_declension_matrix?: DeclensionMatrix | null;

    // article
    article_type?: ArticleType | null; 

    // preposition
    contraction?: ContractionItem[] | null;

    // patterns
    case_governance?: PatternItem[] | null;
    sentence_pattern?: SentencePatternItem[] | null;

    // Relative Word
    word_families?: WordFamilyItem[] | null;
    synonyms?: RelatedItem[] | null;
    antonyms?: RelatedItem[] | null;
    related_phrases?: RelatedItem[] | null;
    related_idioms?: RelatedItem[] | null;

    grammar_notes?: string[] | null;
}

// Patch /vocabulary/{id}, update
export type VocabularyUpdatePayload = Partial<VocabularyCreatePayload>