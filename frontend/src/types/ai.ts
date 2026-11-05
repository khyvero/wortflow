import type { GenderType,
    PartOfSpeechType,
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
    VerbBaseFormsItem,
    DegreesItem,
    ContractionItem,
    PatternItem,
    SentencePatternItem,
} from './common';

export interface AICompletionRequest {
    word: string;
    current_data: Record<string, unknown>;
}

// generate metadata for word
export interface AICompletionResponse {
    word: string;
    part_of_speech: PartOfSpeechType;
    meaning: MeaningItem[] | null;
    gender?: GenderType | null;
    plural?: string | null;

    is_regular?: boolean | null;
    verb_type?: VerbType | null;
    verb_base_forms?: VerbBaseFormsItem | null;
    perfect_auxiliary?: PerfectAuxiliaryType | null;
    transitivity?: TransitivityType | null;
    reflexivity?: ReflexivityType | null;
    personality?: PersonalityType | null;
    separability?: SeparabilityType | null;

    special_declension?: string | null;
    adverbial_type?: AdverbialType[] | null;
    degrees?: DegreesItem |null;

    contraction?: ContractionItem[] | null;

    pronoun_type?: PronounType | null;
    declension_form?: string | null;

    case_governance?: PatternItem[] | null;
    sentence_pattern?: SentencePatternItem[] | null;

    word_register?: WordRegisterType[] | null;
    connotation?: ConnotationType[] | null;
}

// use for generate image for word
export interface ImageRequest {
    word: string;
}

// generate image for word
export interface ImageResponse{
    image_url:string;
}


