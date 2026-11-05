import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, Boolean, JSON, Table, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from database import Base

class PartOfSpeechEnum(str, enum.Enum):
    noun = "noun"
    verb = "verb"
    adjective = "adjective"
    adverb = "adverb"
    pronoun = "pronoun"
    article = "article"
    preposition = "preposition"
    conjunction = "conjunction"
    numeral = "numeral"
    particle = "particle" # e.g. mal, doch
    interjection = "interjection" # e.g. Achso!, Au!, Wow!
    phrase = "phrase"
    idiom = "idiom"

class GenderEnum(str, enum.Enum):
    masculine = "masculine"
    feminine = "feminine"
    neuter = "neuter"

# Perfekt-Hilfsverb
class PerfectAuxiliaryEnum(str, enum.Enum):
    haben = "haben"
    sein = "sein"
    both = "both"

class VerbTypeEnum(str, enum.Enum):
    full = "full" # Vollverb,v.voll, schlafen, lesen
    modal = "modal" # Modalverb, v.mod, können, müssen, dürfen, sollen, wollen, mögen
    auxiliary = "auxiliary" # Hilfsverb, v.aux , haben, sein, werden

class TransitivityEnum(str, enum.Enum):
    transitive = "transitive"  # tr. (must take a direct AKK object.)
    intransitive = "intransitive"  # intr. (not take a direct AKK object)
    ambitransitive = "ambitransitive"  # tr. / intr.

class ReflexivityEnum(str, enum.Enum):
    reflexive = "reflexive" # v.refl., sich, mich, dich
    irreflexive = "irreflexive" # irrefl.
    pseudo_reflexive = "pseudo_reflexive" # unecht reflexive, both refl. and irrefl.

class PersonalityEnum(str, enum.Enum):
    personal = "personal" # pers.
    impersonal = "impersonal" # v.unpers.,words that only ever take the dummy subject es. e.g. regnen -> es regnet
    both = "both"

class SeparabilityEnum(str, enum.Enum):
    separable = "separable" # trennb.
    inseparable = "inseparable" # untrennb.
    both = "both"

# Te-Ka-Mo-Lo
class AdverbialTypeEnum(str, enum.Enum):
    time = "time"  # Temporal. Zeit (Wann?) e.g. gestern, oft, dann
    reason = "reason"  # Kausal. Grund (Warum?) e.g. deshalb, zudem, folglich
    manner = "manner" # Modal. Art und Weise (Wie?) e.g. gern, so, anders
    place = "place"  # Lokal. Ort (Wo?) , e.g. hier, dort, irgendwo

class PronounTypeEnum(str, enum.Enum):
    personal = "personal"  # e.g. ich, du, er, sie, es, wir, ihr, sie / Ihnen
    possessive = "possessive"  # Show ownership or possession e.g. meiner, deine, seins, unserer, etc.
    reflexive = "reflexive"  # e.g. mich, dich, sich, uns, euch (and dative forms mir, dir, uns, euch).
    relative = "relative"  # e.g. der, die, das or welcher, welche, welches
    demonstrative = "demonstrative"  # e.g. dieser, jener, derjenige, derselbe, or using strong demonstratives like der, die, das or dieser on their own.
    indefinite = "indefinite"  # e.g. jemand (someone), niemand (no one), etwas (something), alle (all), man (one).
    interrogative = "interrogative"  # e.g. wer? (who?), was? (what?), welcher? (which one?).

class ArticleTypeEnum(str, enum.Enum):
    definite_article = "definite_article"
    indefinite_article = "indefinite_article"
    negative_article = "negative_article"
    possessive_article = "possessive_article"
    demonstrative_article = "demonstrative_article"
    indefinite_quantifier = "indefinite_quantifier"

class WordRegisterEnum(str, enum.Enum):
    standard = "standard"
    conversational = "conversational"
    formal = "formal"
    literary = "literary"
    slang = "slang"

class ConnotationEnum(str, enum.Enum):
    neutral = "neutral"
    positive = "positive"
    negative = "negative"
    ironic = "ironic"
    pejorative = "pejorative"

# Rektiion / Kasus-Rektion , Präpositionale
class CaseGovernmentTypeEnum(str, enum.Enum):
    nominativ = "nominativ"
    akkusativ = "akkusativ"
    dativ = "dativ"
    genitiv = "genitiv"
    prepositional = "prepositional"
    none = "none" # for word dont need object (intransitive)
    reflexive = "reflexive" # + sich
    impersonal = "impersonal" # es regnet

class SentencePatternTypeEnum(str, enum.Enum):
    coordinating_conjunction = "coordinating_conjunction" # for conjunction, conjunction_aduso
    subordinating_conjunction = "subordinating_conjunction" # for conjunction
    conjunction_adverb = "conjunction_adverb"  # for adverb, Konjunktionaladverb
    double_conjunction = "double_conjunction" # for conjunction and adverb, Doppelkonjunktionen/Zweiteilige Konjunktionen
    proportional_conjunction = "proportional_conjunction" # for conjunction with adverb, Proportionale Konjunktionen
    infinitive_construction = "infinitive_construction" # not for conjunction and adverb, for noun, verb, adjective, preposition, Infinitivkonstruktionen

class SentencePatternEnum(str, enum.Enum):
    # basic independent clauses
    tekamolo = "tekamolo"
    # Subject + verb + Temporal (Time) + Kausal (Reason) + Modal (Manner) + Lokal (Place)
    imperative = "imperative"
    # Geh heute Abend ins Kino!
    yes_no_question = "yes_no_question"
    w_question = "w_question"

    # standard clause linking and conjunctions
    conjunction_aduso = "conjunction_aduso"
    # Ich möchte ein neues Auto kaufen, aber ich habe nicht genug Geld.
    subordinating_main_first = "subordinating_main_first"
    # Wir bleiben heute im Hotel, weil es draußen den ganzen Tag regnet.
    subordinating_sub_first = "subordinating_sub_first"
    # Weil es draußen den ganzen Tag regnet, bleiben wir heute im Hotel.

    # konjunktionaladverb
    conjunctive_adverb_front = "conjunctive_adverb_front"
    # Es regnet stark. Deshalb bleibe ich zu Hause.
    conjunctive_adverb_mid = "conjunctive_adverb_mid"
    # Es regnet stark. Ich bleibe deshalb zu Hause.

    # doppelkonjunktionen (dual conjunctions)
    dual_standard = "dual_standard"
    # Entweder wir gehen heute Abend ins Kino, oder wir kochen gemeinsam zu Hause.
    # Entweder gehen wir heute Abend ins Kino, oder wir kochen gemeinsam zu Hause.
    dual_inversion = "dual_inversion"
    # Nicht nur ist er klug, sondern er ist auch sehr fleißig.
    dual_mid_sentence = "dual_mid_sentence"
    # Er liest sowohl Romane als auch Fachbücher.
    dual_concession = "dual_concession"
    # Das Wetter ist zwar schlecht, aber wir machen einen Ausflug.

    # proportionale konjunktionen
    proportional_conjunction = "proportional_conjunction"
    # Je länger ich in Berlin lebe, desto besser verstehe ich die deutsche Kultur.

    # special subordinate and infinitive clauses
    relative = "relative"
    # Das ist das Auto [Bezugswort], das ich kaufen möchte.
    relative_embedded = "relative_embedded"
    # Das Auto [Bezugswort], das ich kaufen möchte, ist [Verb Pos.2] sehr teuer.
    indirect_question = "indirect_question"
    # Ich weiß nicht, ob er heute ins Kino geht.
    comparative_standard = "comparative_standard"
    # Die Prüfung war viel schwerer, als ich erwartet hatte. Es ist genau so passiert, wie er es beschrieben hat.
    comparative_unreal = "comparative_unreal"
    # Er tut so, als ob er der Chef wäre.
    comparative_unreal_inversion = "comparative_unreal_inversion"
    # Er tut so, als wäre er der Chef.
    infinitive_construction = "infinitive_construction"
    # Sie geht heute extra früh ins Bett, um am nächsten Morgen für die Prüfung fit zu sein.
    infinitive_bare = "infinitive_bare"
    # Ich versuche, jeden Tag Deutsch zu lernen. Ich habe keine Zeit, heute Abend ins Kino zu gehen.
    infinitive_front = "infinitive_front"
    # Jeden Tag Deutsch zu lernen, ist [Verb Pos.1] nicht einfach.
    infinitive_embedded = "infinitive_embedded"
    # Seine Entscheidung , nach Berlin zu ziehen, war absolut richtig.
    subordinate_embedded = "subordinate_embedded"
    # Die Tatsache , dass er heute kommt, überrascht mich. Die Frage, ob er zustimmt, bleibt offen.

    # advanced inversions and reduced clauses
    conditional_verb_first = "conditional_verb_first"
    # Hätte [ Verb Pos.1 ] ich genug Geld , würde [ Verb Pos.1 ] ich ein Auto kaufen.
    participle_clause = "participle_clause"
    # Partizip II e.g. In Berlin angekommen, suchte [ Verb Pos.1 ] er sofort ein Hotel.
    # Partizip I e.g. Laut lachend, verließ [ Verb Pos.1 ] sie den Raum.
    apposition = "apposition"
    # Herr Müller [ Pos.1 ] , unser neuer Deutschlehrer, ist [ Verb Pos.2 ] heute krank.

vocabulary_synonyms = Table (
    "vocabulary_synonyms",
    Base.metadata,
    Column("word_id", Integer, ForeignKey("vocabulary_item.id", ondelete="CASCADE"), primary_key=True),
    Column("synonym_id", Integer, ForeignKey("vocabulary_item.id", ondelete="CASCADE"), primary_key=True)
)

vocabulary_antonyms = Table (
    "vocabulary_antonyms",
    Base.metadata,
    Column("word_id", Integer, ForeignKey("vocabulary_item.id", ondelete="CASCADE"), primary_key=True),
    Column("antonym_id", Integer, ForeignKey("vocabulary_item.id", ondelete="CASCADE"), primary_key=True)
)

vocabulary_related_phrases = Table (
    "vocabulary_related_phrases",
    Base.metadata,
    Column("word_id", Integer, ForeignKey("vocabulary_item.id", ondelete="CASCADE"), primary_key=True),
    Column("related_phrase_id", Integer, ForeignKey("vocabulary_item.id", ondelete="CASCADE"), primary_key=True)
)

vocabulary_related_idioms = Table (
    "vocabulary_related_idioms",
    Base.metadata,
    Column("word_id", Integer, ForeignKey("vocabulary_item.id", ondelete="CASCADE"), primary_key=True),
    Column("related_idiom_id", Integer, ForeignKey("vocabulary_item.id", ondelete="CASCADE"), primary_key=True)
)

class WordFamilyLink(Base):
    __tablename__ = "word_family_link"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    word_id = Column(Integer, ForeignKey("vocabulary_item.id", ondelete="CASCADE"))
    related_word_id = Column(Integer, ForeignKey("vocabulary_item.id", ondelete="CASCADE"), nullable=True)

    root = Column(JSONB, nullable=True)

    related_word = relationship("VocabularyItem", foreign_keys=[related_word_id])

class VocabularyItem(Base):
    __tablename__ = "vocabulary_item"

    # core fields
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, unique=True, index=True, nullable=False)
    part_of_speech = Column(Enum(PartOfSpeechEnum), index=True, nullable=False)
    meaning = Column(JSONB, nullable=False) # mean (for search)  , example

    # noun, verb, adjective, adverb, preposition, pronoun
    image_url = Column(String, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # noun fields
    gender =Column(Enum(GenderEnum), index=True, nullable=True)
    plural = Column(String, nullable=True)

    # verb, Adjective
    is_regular = Column(Boolean, default=False)

    # Verb fields
    verb_base_forms = Column(JSONB, nullable=True)
    verb_type = Column(Enum(VerbTypeEnum), nullable=True)  # (for search)
    perfect_auxiliary = Column(Enum(PerfectAuxiliaryEnum), nullable=True)  # haben or sein or both
    conjugation_table = Column(JSONB, nullable=True)
    transitivity = Column(Enum(TransitivityEnum), nullable=True) # (for search) tr. or intr pr tr. / intr.
    reflexivity = Column(Enum(ReflexivityEnum), nullable=True) # (for search) refl. or irrefl. or both
    personality = Column(Enum(PersonalityEnum), nullable=True) # (for search) pers. or impers. or both
    separability = Column(Enum(SeparabilityEnum), default=True)  # (for search) sep. or insep. or both  (for search)

    # adjective fields
    special_declension = Column(String, nullable=True)  # Inflected Stem(e.g. hoch->hoh-, teuer->teur-, dunkel->dunkl, super-> -, lila-> -)

    # adverb fields
    adverbial_type = Column(JSONB, nullable=True)

    # adjective, adverb
    degrees = Column(JSONB, nullable=True)  # degrees of comparison: comparative: größer, superlative: am größten

    # preposition fields
    contraction = Column(JSONB, nullable=True)  # ( e.g. an + das = ans, in + dem = im)

    # pronoun fields
    pronoun_type = Column(Enum(PronounTypeEnum), nullable=True)
    declension_form = Column(String, nullable=True)
    personal_pronoun_matrix = Column(JSONB, nullable=True)
    possessive_article_matrix = Column(JSONB, nullable=True)
    possessive_pronoun_matrix = Column(JSONB, nullable=True)
    reflexive_pronoun_matrix = Column(JSONB, nullable=True)
    generic_declension_matrix = Column(JSONB, nullable=True)

    # article field
    article_type = Column(Enum(ArticleTypeEnum), nullable=True)

    # verb, Adjective, preposition
    case_governance = Column(JSONB, nullable=True)
    # pattern: e.g. mit NOM/AKK/DAT/GEN or Wechselpräpositionen, warten + auf + AKK / DAT , meaning, example

    # adverb, conjunction
    sentence_pattern = Column(JSONB, nullable=True) # (pattern type, pattern e.g.eshalb + [Verb] + [Subjekt] ..., meaning, example)

    # for all
    word_families = relationship("WordFamilyLink",
                                 primaryjoin="VocabularyItem.id == WordFamilyLink.word_id",
                                 cascade="all, delete-orphan",
                                 backref="linked_from")

    # noun, verb, adjective, adverb

    synonyms = relationship("VocabularyItem",
                           secondary = vocabulary_synonyms,
                           primaryjoin = "VocabularyItem.id == vocabulary_synonyms.c.word_id",
                           secondaryjoin = "VocabularyItem.id == vocabulary_synonyms.c.synonym_id",
                           backref = "synonymous_with")  # synonym = similar words , also for conjunction, particle, interjection

    antonyms = relationship("VocabularyItem",
                           secondary = vocabulary_antonyms,
                           primaryjoin = "VocabularyItem.id == vocabulary_antonyms.c.word_id",
                           secondaryjoin = "VocabularyItem.id == vocabulary_antonyms.c.antonym_id",
                           backref="antonym_with")

    related_phrases = relationship("VocabularyItem",
                                   secondary = vocabulary_related_phrases,
                                   primaryjoin="VocabularyItem.id == vocabulary_related_phrases.c.word_id",
                                   secondaryjoin="VocabularyItem.id == vocabulary_related_phrases.c.related_phrase_id",
                                   backref = "related_phrases_with")

    related_idioms = relationship("VocabularyItem",
                                  secondary = vocabulary_related_idioms,
                                  primaryjoin= "VocabularyItem.id == vocabulary_related_idioms.c.word_id",
                                  secondaryjoin= "VocabularyItem.id == vocabulary_related_idioms.c.related_idiom_id",
                                  backref = "related_idioms_with")

    # noun, verb, adjective, adverb, preposition, conjunction, pronoun, particle, interjection, phrase, idiom
    word_register = Column(JSONB, nullable=True)
    # noun, verb, adjective, adverb, particle, interjection, Phrases, idiom
    connotation = Column(JSONB, nullable=True)

    # noun, verb, adjective, adverb, preposition, Conjunction, pronoun
    grammar_notes = Column(JSONB, nullable=True)






