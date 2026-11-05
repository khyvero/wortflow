from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict, model_validator, Field
from models import (
    PartOfSpeechEnum, GenderEnum, PerfectAuxiliaryEnum, CaseGovernmentTypeEnum,
    VerbTypeEnum, TransitivityEnum, ReflexivityEnum, SeparabilityEnum, WordRegisterEnum,
    ConnotationEnum, AdverbialTypeEnum, SentencePatternTypeEnum,
    SentencePatternEnum, PersonalityEnum, PronounTypeEnum, ArticleTypeEnum
)

# JSON fields
class MeaningItem(BaseModel):
    mean: str # can be word meaning or example meaning
    example: Optional[List[str]] = None

class VerbBaseFormsItem(BaseModel):
    # infinitive: str
    present: str
    past: str
    past_participle: str

class ConjugationTable(BaseModel):
    # indikativ
    praesens: Optional[Dict[str, str]] = None
    praeteritum: Optional[Dict[str, str]] = None
    perfekt: Optional[Dict[str, str]] = None
    plusquamperfekt: Optional[Dict[str, str]] = None
    futur1: Optional[Dict[str, str]] = None
    futur2: Optional[Dict[str, str]] = None
    # konjunktiv
    konjunktiv1: Optional[Dict[str, str]] = None
    konjunktiv2: Optional[Dict[str, str]] = None
    konjunktiv2_wuerde: Optional[Dict[str, str]] = None

class DegreesItem(BaseModel):
    comparative:str
    superlative:str

class ContractionItem(BaseModel):
    preposition: str
    article: str
    result: str

# for pronoun matrix
class DeclensionTable(BaseModel):
    nominativ: Optional[Dict[str, str]] = None
    akkusativ: Optional[Dict[str, str]] = None
    dativ: Optional[Dict[str, str]] = None
    genitiv: Optional[Dict[str, str]] = None

# pronouns declension table
class PersonalPronounMatrix(BaseModel):
    # personal pronouns
    nominativ: Optional[str] = None
    akkusativ: Optional[str] = None
    dativ: Optional[str] = None
    genitiv: Optional[str] = None

class ReflexivePronounMatrix(BaseModel):
    # reflexive pronouns (Reflexivpronomen)
    akkusativ: Optional[Dict[str, str]] = None
    dativ: Optional[Dict[str, str]] = None

# possessive article matrix, possessive pronoun matrix, generic_declension_matrix
class DeclensionMatrix(BaseModel):
    declension: Optional[DeclensionTable] = None

# for case_governance, e.g., "mit DAT", "jemandem etwas[AKK] geben", " jdm. + etw.[AKK] + geben", "sich an jdn. / etw.[AKK] erinnern"
class PatternItem(BaseModel):
    type: List[CaseGovernmentTypeEnum]
    pattern: Optional[str] = None
    meaning: Optional[List[MeaningItem]]

# for sentence_pattern, pattern type, pattern: e.g.eshalb + [Verb] + [Subjekt] ...
class SentencePatternItem(BaseModel):
    type: Optional[SentencePatternTypeEnum]
    pattern: SentencePatternEnum
    meaning: Optional[List[MeaningItem]]

class RelatedItem(BaseModel):
    id: int
    word: str
    part_of_speech: PartOfSpeechEnum
    # ORM mode , able to read VocabularyItem in SQLAlchemy, convert to JSON
    model_config = ConfigDict(from_attributes=True)

class WordFamilyItem(BaseModel):
    root: Optional[str] = None
    words: Optional[List[RelatedItem]] = None

# main pydantic models
class VocabularyBase(BaseModel):
    word: str
    part_of_speech: PartOfSpeechEnum
    meaning: List[MeaningItem] = Field(..., min_length=1)

    image_url: Optional[str] = None

    # levels and tone
    word_register: Optional[List[WordRegisterEnum]] = None
    connotation: Optional[List[ConnotationEnum]] = None

    # noun fields
    gender: Optional[GenderEnum] = None
    plural: Optional[str] = None

    # verb fields
    verb_base_forms: Optional[VerbBaseFormsItem] = None
    perfect_auxiliary: Optional[PerfectAuxiliaryEnum] = None
    conjugation_table: Optional[ConjugationTable] = None
    verb_type: Optional[VerbTypeEnum] = None
    transitivity: Optional[TransitivityEnum] = None
    reflexivity: Optional[ReflexivityEnum] = None
    personality: Optional[PersonalityEnum] = None
    separability: Optional[SeparabilityEnum] = None

    # adjective fields
    special_declension: Optional[str] = None

    # adverb fields
    adverbial_type: Optional[List[AdverbialTypeEnum]] = None

    # adjective, adverb
    degrees: Optional[DegreesItem] = None

    # pronoun fields
    pronoun_type: Optional[PronounTypeEnum] = None
    declension_form: Optional[str] = None
    personal_pronoun_matrix: Optional[PersonalPronounMatrix] = None
    possessive_article_matrix: Optional[DeclensionMatrix] = None  # pronoun, article
    possessive_pronoun_matrix: Optional[DeclensionMatrix] = None
    reflexive_pronoun_matrix: Optional[ReflexivePronounMatrix] = None
    generic_declension_matrix: Optional[DeclensionMatrix] = None  # pronoun, article

    # article fields
    article_type: Optional[ArticleTypeEnum] = None

    # preposition fields
    contraction: Optional[List[ContractionItem]] = None  # e.g., {"an das": "ans"}

    # regular word in difference forms
    is_regular: Optional[bool] = None

    # pattern
    case_governance: Optional[List[PatternItem]] = None
    sentence_pattern: Optional[List[SentencePatternItem]] = None

    grammar_notes: Optional[List[str]] = None

    # relative word
    word_families: Optional[List[WordFamilyItem]] = None
    synonyms: Optional[List[RelatedItem]] = None
    antonyms: Optional[List[RelatedItem]] = None
    related_phrases: Optional[List[RelatedItem]] = None
    related_idioms: Optional[List[RelatedItem]] = None

# Inherits everything from VocabularyBase
class VocabularyCreate(VocabularyBase):
    @model_validator(mode="after")
    def validate_noun_fields(self):
        if self.part_of_speech == PartOfSpeechEnum.noun:
            required_noun_fields = [
                ("gender", self.gender),
                ("plural", self.plural),
                ("word_register", self.word_register),
                ("connotation", self.connotation),
            ]

            missing = [name for name, value in required_noun_fields if value is None or value == "" or value == []]

            if missing:
                raise ValueError(f"{', '.join(missing)} is required when part of speech is noun")
        return self

    @model_validator(mode="after")
    def validate_verb_fields(self):
        if self.part_of_speech == PartOfSpeechEnum.verb:
            required_verb_fields = [
                ("is_regular", self.is_regular),
                ("verb_base_forms", self.verb_base_forms),
                ("perfect_auxiliary", self.perfect_auxiliary),
                ("verb_type", self.verb_type),
                ("transitivity", self.transitivity),
                ("reflexivity", self.reflexivity),
                ("personality", self.personality),
                ("separability", self.separability),
                ("word_register", self.word_register),
                ("connotation", self.connotation),
            ]

            missing = [name for name, value in required_verb_fields if value is None or value == "" or value == []]

            if missing:
                raise ValueError(f"{', '.join(missing)} is required when part of speech is verb")
        return self

    @model_validator(mode="after")
    def validate_adjective_fields(self):
        if self.part_of_speech == PartOfSpeechEnum.adjective:
            required_adjective_fields = [
                ("is_regular", self.is_regular),
                ("degrees", self.degrees),
                ("word_register", self.word_register),
                ("connotation", self.connotation),
            ]

            if self.is_regular == False:
                required_adjective_fields.append(
                    ("special_declension", self.special_declension),
                )

            missing = [name for name, value in required_adjective_fields if value is None or value == "" or value == []]

            if missing:
                raise ValueError(f"{', '.join(missing)} is required when part of speech is adjective")
        return self

    @model_validator(mode="after")
    def validate_adverb_fields(self):
        if self.part_of_speech == PartOfSpeechEnum.adverb:
            required_adverb_fields = [
                ("adverbial_type", self.adverbial_type),
                ("word_register", self.word_register),
                ("connotation", self.connotation),
            ]

            missing = [name for name, value in required_adverb_fields if value is None or value == "" or value == []]

            if missing:
                raise ValueError(f"{', '.join(missing)} is required when part of speech is adverb")
        return self

    @model_validator(mode="after")
    def validate_pronoun_fields(self):
        if self.part_of_speech == PartOfSpeechEnum.pronoun:
            required_pronoun_fields = [
                ("pronoun_type", self.pronoun_type),
                ("word_register", self.word_register),
            ]

            missing = [name for name, value in required_pronoun_fields if value is None or value == "" or value == []]

            if missing:
                raise ValueError(f"{', '.join(missing)} is required when part of speech is pronoun")
        return self

    @model_validator(mode="after")
    def validate_article_fields(self):
        if self.part_of_speech == PartOfSpeechEnum.article:
            required_article_fields = [
                ("article_type", self.article_type),
            ]

            missing = [name for name, value in required_article_fields if value is None or value == "" or value == []]

            if missing:
                raise ValueError(f"{', '.join(missing)} is required when part of speech is article")
        return self

    @model_validator(mode="after")
    def validate_preposition_fields(self):
        if self.part_of_speech == PartOfSpeechEnum.preposition:
            required_preposition_fields = [
                ("word_register", self.word_register),
                ("case_governance", self.case_governance),
            ]

            missing = [name for name, value in required_preposition_fields if value is None or value == "" or value == []]

            if missing:
                raise ValueError(f"{', '.join(missing)} is required when part of speech is preposition")
        return self

    @model_validator(mode="after")
    def validate_conjunction_fields(self):
        if self.part_of_speech == PartOfSpeechEnum.conjunction:
            required_conjunction_fields = [
                ("word_register", self.word_register),
                ("sentence_pattern", self.sentence_pattern),
            ]

            missing = [name for name, value in required_conjunction_fields if value is None or value == "" or value == []]

            if missing:
                raise ValueError(f"{', '.join(missing)} is required when part of speech is conjunction")
        return self

    @model_validator(mode="after")
    def validate_fields(self):
        if self.part_of_speech in {
            PartOfSpeechEnum.particle,
            PartOfSpeechEnum.interjection,
            PartOfSpeechEnum.phrase,
            PartOfSpeechEnum.idiom
        }:
            required_fields = [
                ("word_register", self.word_register),
                ("connotation", self.connotation),
            ]

            missing = [name for name, value in required_fields if value is None or value == "" or value == []]

            if missing:
                raise ValueError(f"{', '.join(missing)} is required when part of speech is {self.part_of_speech}")
        return self

class VocabularyUpdate(BaseModel):
    word: Optional[str]= None
    part_of_speech: Optional[PartOfSpeechEnum] = None
    meaning: Optional[List[MeaningItem]] = None

    image_url: Optional[str]= None

    # levels and tone
    word_register: Optional[List[WordRegisterEnum]] = None
    connotation: Optional[List[ConnotationEnum]] = None

    # noun fields
    gender: Optional[GenderEnum] = None
    plural: Optional[str] = None

    # verb fields
    verb_base_forms: Optional[VerbBaseFormsItem] = None
    perfect_auxiliary: Optional[PerfectAuxiliaryEnum] = None
    conjugation_table: Optional[ConjugationTable] = None
    verb_type: Optional[VerbTypeEnum] = None
    transitivity: Optional[TransitivityEnum] = None
    reflexivity: Optional[ReflexivityEnum] = None
    personality: Optional[PersonalityEnum] = None
    separability: Optional[SeparabilityEnum] = None

    # adjective fields
    special_declension: Optional[str] = None

    # adverb fields
    adverbial_type: Optional[List[AdverbialTypeEnum]] = None

    # adjective, adverb
    degrees: Optional[DegreesItem] = None

    # pronoun fields
    pronoun_type: Optional[PronounTypeEnum] = None
    declension_form: Optional[str] = None
    personal_pronoun_matrix: Optional[PersonalPronounMatrix] = None
    possessive_article_matrix: Optional[DeclensionMatrix] = None
    possessive_pronoun_matrix: Optional[DeclensionMatrix] = None
    reflexive_pronoun_matrix: Optional[ReflexivePronounMatrix] = None
    generic_declension_matrix: Optional[DeclensionMatrix] = None

    # article field
    article_type: Optional[ArticleTypeEnum] = None

    # preposition fields
    contraction: Optional[List[ContractionItem]] = None  # e.g., {"an das": "ans"}

    # regular word in difference forms
    is_regular: Optional[bool] = None

    # pattern
    case_governance: Optional[List[PatternItem]] = None
    sentence_pattern: Optional[List[SentencePatternItem]] = None

    grammar_notes: Optional[List[str]] = None

    # relative word
    word_families: Optional[List[WordFamilyItem]] = None
    synonyms: Optional[List[RelatedItem]] = None
    antonyms: Optional[List[RelatedItem]] = None
    related_phrases: Optional[List[RelatedItem]] = None
    related_idioms: Optional[List[RelatedItem]] = None

# for get API Responses
class VocabularyResponse(VocabularyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    word_families: List[WordFamilyItem] = []
    synonyms: List[RelatedItem] = []
    antonyms: List[RelatedItem] = []
    related_phrases: List[RelatedItem] = []
    related_idioms: List[RelatedItem] = []

    # Enable ORM mode for Pydantic v2
    model_config = ConfigDict(from_attributes=True)

class AICompletionResponse(BaseModel):
    word: str
    part_of_speech: PartOfSpeechEnum
    meaning: Optional[List[MeaningItem]] = None

    word_register: Optional[List[WordRegisterEnum]] = None
    connotation: Optional[List[ConnotationEnum]] = None

    gender: Optional[GenderEnum] = None
    plural: Optional[str] = None

    is_regular: Optional[bool] = None
    verb_base_forms: Optional[VerbBaseFormsItem] = None
    verb_type: Optional[VerbTypeEnum] = None
    perfect_auxiliary: Optional[PerfectAuxiliaryEnum] = None
    transitivity: Optional[TransitivityEnum] = None
    reflexivity: Optional[ReflexivityEnum] = None
    personality: Optional[PersonalityEnum] = None
    separability: Optional[SeparabilityEnum] = None

    special_declension: Optional[str] = None
    adverbial_type: Optional[List[AdverbialTypeEnum]] = None
    degrees: Optional[DegreesItem] = None

    contraction: Optional[List[ContractionItem]] = None  # e.g., {"an das": "ans"}

    pronoun_type: Optional[PronounTypeEnum] = None
    declension_form: Optional[str] = None

    article_type: Optional[ArticleTypeEnum] = None

    case_governance: Optional[List[PatternItem]] = None
    sentence_pattern: Optional[List[SentencePatternItem]] = None

class AICompletionRequest(BaseModel):
    word: str
    # receive the form state form frontend (include filled and unfill fields)
    current_data: Dict[str, Any]

class ImageRequest(BaseModel):
    word: str

class ImageResponse(BaseModel):
    image_url: str