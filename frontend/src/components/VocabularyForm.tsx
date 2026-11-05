import React, { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  type Path,
  type FieldErrors,
} from "react-hook-form";
import {
  PersonalPronounGrid,
  DeclensionGrid,
  ReflexiveGrid,
} from "../components/PronounMatrixInputs";
import type {
  VocabularyCreatePayload,
  VocabularyUpdatePayload,
} from "../types/vocabulary";
import type {
  PartOfSpeechType,
  WordRegisterType,
  ConnotationType,
  AdverbialType,
  CaseGovernmentType,
  SentencePatternType,
  SentencePattern,
  MeaningItem,
  SentencePatternItem,
  RelatedItem,
  WordFamilyItem,
} from "../types/common";
import {
  PartOfSpeechOptions,
  GenderOptions,
  WordRegisterOptions,
  ConnotationOptions,
  PerfectAuxiliaryOptions,
  VerbTypeOptions,
  TransitivityOptions,
  ReflexivityOptions,
  PersonalityOptions,
  SeparabilityOptions,
  AdverbialOptions,
  PronounTypeOptions,
  ArticleTypeOptions,
  CaseGovernmentOptions,
  SentencePatternTypeOptions,
  SentencePatternOptions,
} from "../utils/constants";
import CustomSelect from "../components/CustomSelect";
import CustomMultiSelect from "../components/CustomMultiSelect";
import { aiService } from "../services/aiService";
import { IconButton } from "./IconButton";
import "./VocabularyForm.css";

interface VocabularyFormProps {
  initialData?: VocabularyUpdatePayload;
  onSubmit: (data: VocabularyCreatePayload) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
}

export const VocabularyForm: React.FC<VocabularyFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  submitLabel,
}) => {
  const formatMeanings = (meanings: MeaningItem[] | null | undefined) => {
    return meanings && meanings.length > 0
      ? meanings.map((m) => ({
          ...m,
          example: m.example && m.example.length > 0 ? m.example : [],
        }))
      : []; // add empty array if null
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<VocabularyCreatePayload>({
    defaultValues: {
      word: initialData?.word || "",
      part_of_speech: initialData?.part_of_speech || ("" as PartOfSpeechType),
      meaning:
        initialData?.meaning && initialData.meaning.length > 0
          ? formatMeanings(initialData.meaning)
          : [{ mean: "", example: [] }], // at least 1 input for user filling in main field

      // noun, verb, adjective, adverb, preposition, pronoun
      image_url: initialData?.image_url || "",

      word_register: initialData?.word_register || ["standard"],
      connotation: initialData?.connotation || ["neutral"],

      // noun fields
      gender: initialData?.gender || null,
      plural: initialData?.plural || "",

      // verb, Adjective, adverb
      is_regular: initialData?.is_regular ?? null,

      // Verb fields
      // conjungation_table
      // missing
      // verb_base_forms
      verb_base_forms: initialData?.verb_base_forms || {
        present: "",
        past: "",
        past_participle: "",
      },
      perfect_auxiliary: initialData?.perfect_auxiliary || null,
      verb_type: initialData?.verb_type || null,
      transitivity: initialData?.transitivity || null,
      reflexivity: initialData?.reflexivity || null,
      personality: initialData?.personality || null,
      separability: initialData?.separability || null,

      // adjective fields
      special_declension: initialData?.special_declension || "",

      // adverb fields
      adverbial_type: initialData?.adverbial_type || [],

      // adjective, adverb
      // degrees
      degrees: initialData?.degrees || {
        comparative: "",
        superlative: "",
      },

      // pronoun fields
      pronoun_type: initialData?.pronoun_type || null,
      declension_form: initialData?.declension_form || "",
      personal_pronoun_matrix: initialData?.personal_pronoun_matrix || {
        nominativ: "",
        akkusativ: "",
        dativ: "",
        genitiv: "",
      },
      // possessive_article_matrix
      possessive_article_matrix: initialData?.possessive_article_matrix || {
        declension: {
          nominativ: { masculine: "", feminine: "", neuter: "", plural: "" },
          akkusativ: { masculine: "", feminine: "", neuter: "", plural: "" },
          dativ: { masculine: "", feminine: "", neuter: "", plural: "" },
          genitiv: { masculine: "", feminine: "", neuter: "", plural: "" },
        },
      },
      // possessive_pronoun_matrix
      possessive_pronoun_matrix: initialData?.possessive_pronoun_matrix || {
        declension: {
          nominativ: { masculine: "", feminine: "", neuter: "", plural: "" },
          akkusativ: { masculine: "", feminine: "", neuter: "", plural: "" },
          dativ: { masculine: "", feminine: "", neuter: "", plural: "" },
          genitiv: { masculine: "", feminine: "", neuter: "", plural: "" },
        },
      },
      // reflexive_pronoun_matrix
      reflexive_pronoun_matrix: initialData?.reflexive_pronoun_matrix || {
        akkusativ: {
          ich: "",
          du: "",
          er: "",
          sie_sg: "",
          es: "",
          wir: "",
          ihr: "",
          sie_pl: "",
          Sie: "",
        },
        dativ: {
          ich: "",
          du: "",
          er: "",
          sie_sg: "",
          es: "",
          wir: "",
          ihr: "",
          sie_pl: "",
          Sie: "",
        },
      },
      // generic_declension_matrix
      generic_declension_matrix: initialData?.generic_declension_matrix || {
        declension: {
          nominativ: { masculine: "", feminine: "", neuter: "", plural: "" },
          akkusativ: { masculine: "", feminine: "", neuter: "", plural: "" },
          dativ: { masculine: "", feminine: "", neuter: "", plural: "" },
          genitiv: { masculine: "", feminine: "", neuter: "", plural: "" },
        },
      },

      // article fields
      article_type: initialData?.article_type || null,

      // preposition fields
      contraction: initialData?.contraction || [],

      // verb, Adjective, preposition
      // case_governance
      case_governance:
        initialData?.case_governance && initialData.case_governance.length > 0
          ? initialData.case_governance.map((cg) => ({
              ...cg,
              type: cg.type || [],
              pattern: cg.pattern || "",
              meaning: formatMeanings(cg.meaning),
            }))
          : [],

      // adverb, conjunction
      // sentence_pattern
      sentence_pattern:
        initialData?.sentence_pattern && initialData.sentence_pattern.length > 0
          ? initialData.sentence_pattern.map((sp) => ({
              ...sp,
              type: sp.type || null,
              pattern: sp.pattern || ("" as SentencePattern),
              meaning: formatMeanings(sp.meaning),
            }))
          : [],

      // grammar_notes
      grammar_notes:
        initialData?.grammar_notes && initialData.grammar_notes.length > 0
          ? initialData.grammar_notes
          : // default have no note
            [],

      // Related Items States
      word_families: initialData?.word_families || [],
      synonyms: initialData?.synonyms || [],
      antonyms: initialData?.antonyms || [],
      related_phrases: initialData?.related_phrases || [],
      related_idioms: initialData?.related_idioms || [],
    },
  });

  // announce immediately if e.g. part_of_speech change
  const currentPos = watch("part_of_speech");
  const currentWord = watch("word");
  const meaningsWatch = watch("meaning");
  const currentImageUrl = watch("image_url");
  const isRegular = watch("is_regular");
  const currentPronounType = watch("pronoun_type");
  const currentArticleType = watch("article_type");

  const cgWatch = watch("case_governance");
  const spWatch = watch("sentence_pattern");

  // useFieldArray, map, add, remove
  const {
    fields: meaningFields,
    append: appendMeaning,
    remove: removeMeaning,
  } = useFieldArray({ control, name: "meaning" });
  const {
    fields: contractionFields,
    append: appendContraction,
    remove: removeContraction,
  } = useFieldArray({ control, name: "contraction" });
  const {
    fields: cgFields,
    append: appendCg,
    remove: removeCg,
  } = useFieldArray({ control, name: "case_governance" });
  const {
    fields: spFields,
    append: appendSp,
    remove: removeSp,
  } = useFieldArray({ control, name: "sentence_pattern" });
  const {
    fields: noteFields,
    append: appendNote,
    remove: removeNote,
  } = useFieldArray({ control, name: "grammar_notes" as never });
  // related word
  const {
    fields: wfFields,
    append: appendWf,
    remove: removeWf,
  } = useFieldArray({ control, name: "word_families" });
  const {
    fields: synFields,
    append: appendSyn,
    remove: removeSyn,
  } = useFieldArray({ control, name: "synonyms" });
  const {
    fields: antFields,
    append: appendAnt,
    remove: removeAnt,
  } = useFieldArray({ control, name: "antonyms" });
  const {
    fields: rpFields,
    append: appendRp,
    remove: removeRp,
  } = useFieldArray({ control, name: "related_phrases" });
  const {
    fields: riFields,
    append: appendRi,
    remove: removeRi,
  } = useFieldArray({ control, name: "related_idioms" });

  // Requirements checks for word_register and connotation
  const requiresWordRegister = [
    "noun",
    "verb",
    "adjective",
    "adverb",
    "preposition",
    "conjunction",
    "pronoun",
    "particle",
    "interjection",
    "phrase",
  ].includes(currentPos as string);
  const requiresConnotation = [
    "noun",
    "verb",
    "adjective",
    "adverb",
    "particle",
    "interjection",
    "phrase",
  ].includes(currentPos as string);

  // for showing and hiding case_governance
  useEffect(() => {
    if (["verb", "adjective", "preposition"].includes(currentPos as string)) {
      const currentCg = getValues("case_governance") || [];
      if (currentCg.length === 0) {
        appendCg(
          {
            type: [] as CaseGovernmentType[],
            pattern: "",
            meaning: [{ mean: "", example: [] }],
          },
          { shouldFocus: false },
        );
      }
    }
  }, [currentPos, getValues, appendCg]);

  // handle type in sentence pattern
  const handleAddSp = React.useCallback(
    (focus: boolean = true) => {
      let defaultType: SentencePatternType | null = null;
      if (currentPos === "adverb") {
        defaultType = "conjunction_adverb";
      } else if (currentPos === "conjunction") {
        defaultType = "" as SentencePatternType;
      }

      appendSp(
        {
          type: defaultType,
          pattern: "" as SentencePattern,
          meaning: [{ mean: "", example: [] }],
        },
        { shouldFocus: focus },
      );
    },
    [currentPos, appendSp],
  );

  // for showing and hiding sentence_pattern, adverb, conjunction
  React.useEffect(() => {
    if (["adverb", "conjunction"].includes(currentPos as string)) {
      const currentSp = getValues("sentence_pattern") || [];
      if (currentSp.length === 0) {
        handleAddSp(false);
      }
    }
  }, [currentPos, getValues, handleAddSp]);

  // meaning field
  const renderNestedMeanings = (
    basePath: string,
    currentMeanings: MeaningItem[],
  ) => {
    return (
      <div className="filter-group">
        {currentMeanings.length === 0 ? (
          <div className="filter-group">
            <label>Meaning</label>
            <IconButton
              icon="add"
              onClick={() =>
                setValue(
                  `${basePath}.meaning` as Path<VocabularyCreatePayload>,
                  [{ mean: "", example: [] }],
                )
              }
              title="Add Meaning"
              color="var(--primary-purple)"
            />
          </div>
        ) : (
          currentMeanings.map((m, mIndex) => {
            const currentExamples = m.example || [];
            return (
              <React.Fragment key={mIndex}>
                <div className="divider-section">
                  {/* Meaning Input */}
                  <div className="filter-group">
                    <label>
                      Meaning {currentMeanings.length > 1 ? mIndex + 1 : ""}
                    </label>
                    <div className="input-with-action">
                      <input
                        type="text"
                        {...register(
                          `${basePath}.meaning.${mIndex}.mean` as Path<VocabularyCreatePayload>,
                          { required: true },
                        )}
                        placeholder="Meaning (e.g. to wait for)"
                      />
                      {mIndex === currentMeanings.length - 1 && (
                        <IconButton
                          icon="add"
                          onClick={() =>
                            setValue(
                              `${basePath}.meaning` as Path<VocabularyCreatePayload>,
                              [...currentMeanings, { mean: "", example: [] }],
                            )
                          }
                          title="Add Meaning"
                          color="var(--primary-purple)"
                        />
                      )}
                      <IconButton
                        icon="remove"
                        onClick={() =>
                          setValue(
                            `${basePath}.meaning` as Path<VocabularyCreatePayload>,
                            currentMeanings.filter((_, i) => i !== mIndex),
                          )
                        }
                        title="Remove Meaning"
                        color="#ff4d4f"
                      />
                    </div>
                  </div>

                  {/* Example Inputs */}
                  <div className="filter-group">
                    <div className="input-with-action">
                      {currentExamples.length === 0 && (
                        <IconButton
                          icon="add"
                          onClick={() =>
                            setValue(
                              `${basePath}.meaning.${mIndex}.example` as Path<VocabularyCreatePayload>,
                              [""],
                            )
                          }
                          title="Add Example"
                          color="var(--primary-purple)"
                        />
                      )}
                      <label>
                        Example {currentMeanings.length > 1 ? mIndex + 1 : ""}
                      </label>
                    </div>

                    {currentExamples.length > 0 &&
                      currentExamples.map((ex, exIndex) => (
                        <div
                          className="input-with-action"
                          key={exIndex}
                          style={{
                            marginBottom:
                              exIndex < currentExamples.length - 1
                                ? "8px"
                                : "0",
                          }}
                        >
                          <input
                            type="text"
                            {...register(
                              `${basePath}.meaning.${mIndex}.example.${exIndex}` as Path<VocabularyCreatePayload>,
                            )}
                            placeholder="Example (e.g. Ich warte auf dich.)"
                          />
                          {exIndex === currentExamples.length - 1 && (
                            <IconButton
                              icon="add"
                              onClick={() =>
                                setValue(
                                  `${basePath}.meaning.${mIndex}.example` as Path<VocabularyCreatePayload>,
                                  [...currentExamples, ""],
                                )
                              }
                              title="Add Example"
                              color="var(--primary-purple)"
                            />
                          )}
                          <IconButton
                            icon="remove"
                            onClick={() =>
                              setValue(
                                `${basePath}.meaning.${mIndex}.example` as Path<VocabularyCreatePayload>,
                                currentExamples.filter((_, i) => i !== exIndex),
                              )
                            }
                            title="Remove Example"
                            color="#ff4d4f"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    );
  };

  // Loading states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiImageLoading, setIsAiImageLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAiAutoFill = async () => {
    const currentData = getValues();
    if (!currentData.word?.trim()) return;

    setIsAiLoading(true);
    setSubmitError(null);
    try {
      const result = await aiService.generateCompletion({
        word: currentData.word.trim(),
        current_data: currentData as unknown as Record<string, unknown>,
      });

      // AI result fill in RHF state
      Object.entries(result).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          setValue(
            key as keyof VocabularyCreatePayload,
            value as VocabularyCreatePayload[keyof VocabularyCreatePayload],
            { shouldValidate: true },
          );
        }
      });
    } catch (err) {
      console.error("AI Auto-fill failed:", err);
      setSubmitError("Failed to auto-fill with AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiGenerateImage = async () => {
    if (!currentWord?.trim()) return;
    setIsAiImageLoading(true);

    setSubmitError(null);
    try {
      const imageData = await aiService.generateImage({
        word: currentWord.trim(),
      });
      if (imageData.image_url) {
        setValue("image_url", imageData.image_url);
      }
    } catch (err) {
      console.error("AI Image failed:", err);
      setSubmitError("Failed to generate AI image.");
    } finally {
      setIsAiImageLoading(false);
    }
  };

  // handle capital letter
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // handle lowercase letter
  const lowercaseFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toLowerCase() + str.slice(1);
  };

  // error from RHF, gernarte error Banner
  const onFormError = (formErrors: FieldErrors<VocabularyCreatePayload>) => {
    const missing: string[] = [];
    if (formErrors.word) missing.push("German Word");
    if (formErrors.part_of_speech) missing.push("Part of Speech");
    if (formErrors.word_register) missing.push("Register");
    if (formErrors.connotation) missing.push("Connotation");

    if (formErrors.gender) missing.push("Gender");
    if (formErrors.plural) missing.push("Plural");

    if (
      formErrors.verb_base_forms?.present ||
      formErrors.verb_base_forms?.past ||
      formErrors.verb_base_forms?.past_participle
    )
      missing.push("Verb Base Forms (Präsens, Präteritum, Partizip II)");
    if (formErrors.perfect_auxiliary) missing.push("Perfect Auxiliary");
    if (formErrors.verb_type) missing.push("Type of Verb");
    if (formErrors.transitivity) missing.push("Transitivity");
    if (formErrors.reflexivity) missing.push("Reflexivity");
    if (formErrors.personality) missing.push("Personality");
    if (formErrors.separability) missing.push("Separability");

    if (formErrors.adverbial_type) missing.push("Adverbial Type");
    if (formErrors.degrees?.comparative || formErrors.degrees?.superlative)
      missing.push("Degrees of Comparison");
    if (formErrors.pronoun_type) missing.push("Pronoun Type");
    if (formErrors.article_type) missing.push("Acticle Type");
    if (formErrors.meaning) missing.push("Meaning");

    setSubmitError(
      `Missing required fields for ${currentPos ? currentPos.toUpperCase() : "this word"}: ${missing.join(", ")}`,
    );
  };

  const onFormSubmit = async (data: VocabularyCreatePayload) => {
    setSubmitError(null);

    const payload: Partial<VocabularyCreatePayload> = {
      word: data.word.trim(),
      part_of_speech: data.part_of_speech,
      meaning: data.meaning
        .map((m) => ({
          mean: m.mean.trim(),
          example: Array.isArray(m.example)
            ? m.example.filter((ex) => ex.trim() !== "")
            : [],
        }))
        .filter((m) => m.mean !== ""),
      image_url: data.image_url?.trim() || null,
    };

    if (requiresWordRegister && data.word_register)
      payload.word_register = data.word_register;
    if (requiresConnotation && data.connotation)
      payload.connotation = data.connotation;

    if (data.part_of_speech === "noun") {
      payload.gender = data.gender;
      payload.plural = data.plural?.trim();
    }

    if (data.part_of_speech === "verb") {
      payload.is_regular = data.is_regular;

      // verb_base_forms
      const present = data.verb_base_forms?.present?.trim();
      const past = data.verb_base_forms?.past?.trim();
      const pastParticiple = data.verb_base_forms?.past_participle?.trim();

      if (
        !present ||
        present === "-" ||
        !past ||
        past === "-" ||
        !pastParticiple ||
        pastParticiple === "-"
      ) {
        setSubmitError(
          "Präsens, Präteritum, and Partizip II are required for verbs.",
        );
        return;
      }

      payload.verb_base_forms = {
        present: present,
        past: past,
        past_participle: pastParticiple,
      };

      payload.perfect_auxiliary = data.perfect_auxiliary;
      payload.verb_type = data.verb_type;
      payload.transitivity = data.transitivity;
      payload.reflexivity = data.reflexivity;
      payload.personality = data.personality;
      payload.separability = data.separability;

      // case_governance
      payload.case_governance = (data.case_governance || [])
        // save record if type is not empty
        .filter((cg) => cg.type && cg.type.length > 0)
        // null if pattern field is empty
        .map((cg) => ({
          ...cg,
          pattern: cg.pattern?.trim() || null,
          meaning: formatMeanings(cg.meaning),
        }));

      if (data.case_governance.length === 0) {
        setSubmitError("Case Governance is required for verbs.");
        return;
      }
    }

    if (data.part_of_speech === "adjective") {
      payload.is_regular = data.is_regular;
      if (!data.is_regular && data.special_declension) {
        payload.special_declension = data.special_declension.trim();
      }

      const hasComp = data.degrees?.comparative?.trim();
      const hasSup = data.degrees?.superlative?.trim();

      if (hasComp && hasSup) {
        payload.degrees = {
          comparative: hasComp,
          superlative: hasSup,
        };
      }
    }

    if (data.part_of_speech === "adverb") {
      payload.adverbial_type = data.adverbial_type;

      const hasComp = data.degrees?.comparative?.trim();
      const hasSup = data.degrees?.superlative?.trim();

      if (hasComp && hasSup) {
        payload.degrees = {
          comparative: hasComp,
          superlative: hasSup,
        };
      }

      // sentence_pattern
      payload.sentence_pattern = (data.sentence_pattern || [])
        // save record if pattern is not empty
        .filter((sp) => sp.pattern)
        .map((sp) => ({
          ...sp,
          type: sp.type,
          meaning: formatMeanings(sp.meaning),
        }));

      if (
        payload.sentence_pattern.length === 0 ||
        payload.sentence_pattern.some((sp: SentencePatternItem) => !sp.type)
      ) {
        setSubmitError(
          "Sentence Pattern and Pattern Type are required for adverbs.",
        );
        return;
      }
    }

    if (data.part_of_speech === "pronoun") {
      payload.pronoun_type = data.pronoun_type;

      // personal_pronoun_matrix
      if (data.pronoun_type === "personal") {
        //                 payload.personal_pronoun_matrix = {
        //                     nominativ: data.personal_pronoun_matrix?.nominativ?.trim() || '',
        //                     akkusativ: data.personal_pronoun_matrix?.akkusativ?.trim() || '',
        //                     dativ: data.personal_pronoun_matrix?.dativ?.trim() || '',
        //                     genitiv: data.personal_pronoun_matrix?.genitiv?.trim() || '',
        //                 };
        payload.pronoun_type = data.pronoun_type;
      } else if (data.pronoun_type === "possessive") {
        // possessive_article_matrix
        payload.possessive_article_matrix = data.possessive_article_matrix;
        // possessive_pronoun_matrix
        payload.possessive_pronoun_matrix = data.possessive_pronoun_matrix;
      } else if (data.pronoun_type === "reflexive") {
        // reflexive_pronoun_matrix
        payload.reflexive_pronoun_matrix = data.reflexive_pronoun_matrix;
      } else {
        // generic_declension_matrix
        payload.generic_declension_matrix = data.generic_declension_matrix;
      }
    }

    if (data.part_of_speech === "article") {
      payload.article_type = data.article_type;
    }

    if (data.part_of_speech === "preposition") {
      if (data.contraction && data.contraction.length > 0) {
        payload.contraction = data.contraction.filter(
          (c) =>
            c.preposition?.trim() !== "" &&
            c.article?.trim() !== "" &&
            c.result?.trim() !== "",
        );
      }

      // case_governance
      payload.case_governance = (data.case_governance || [])
        // save record if type is not empty
        .filter((cg) => cg.type && cg.type.length > 0)
        // null if pattern field is empty
        .map((cg) => ({
          ...cg,
          pattern: cg.pattern?.trim() || null,
          meaning: formatMeanings(cg.meaning),
        }));

      if (data.case_governance.length > 0) {
        setSubmitError("Case Governance is required for verbs.");
        return;
      }
    }

    if (data.part_of_speech === "conjunction") {
      // sentence_pattern
      payload.sentence_pattern = (data.sentence_pattern || [])
        // save record if pattern is not empty
        .filter((sp) => sp.pattern)
        .map((sp) => ({
          ...sp,
          type: sp.type,
          meaning: formatMeanings(sp.meaning),
        }));

      if (
        payload.sentence_pattern.length === 0 ||
        payload.sentence_pattern.some((sp: SentencePatternItem) => !sp.type)
      ) {
        setSubmitError(
          "Sentence Pattern and Pattern Type are required for adverbs.",
        );
        return;
      }
    }

    // optional case_governance
    if (!["verb", "adjective", "preposition"].includes(data.part_of_speech)) {
      const optionalCg = (data.case_governance || []).filter(
        (cg) => cg.type && cg.type.length > 0,
      );
      if (optionalCg.length > 0) {
        payload.case_governance = optionalCg.map((cg) => ({
          ...cg,
          pattern: cg.pattern?.trim() || null,
          meaning: formatMeanings(cg.meaning),
        }));
      }
    }

    // optional sentence_pattern
    if (!["adverb", "conjunction"].includes(data.part_of_speech)) {
      const optionalSp = (data.sentence_pattern || []).filter(
        (sp) => sp.pattern && sp.pattern.trim() !== "",
      );
      if (optionalSp.length > 0) {
        payload.sentence_pattern = optionalSp.map((sp) => ({
          ...sp,
          type: sp.type || null,
          meaning: formatMeanings(sp.meaning),
        }));
      }
    }

    payload.grammar_notes =
      data.grammar_notes?.filter(
        (n) => typeof n === "string" && n.trim() !== "",
      ) || [];

    // relative word - word families
    if (data.word_families && data.word_families.length > 0) {
      const validGroups: WordFamilyItem[] = [];

      data.word_families.forEach((group) => {
        const cleanRoot = group.root?.trim() || "";
        const cleanWords =
          group.words?.filter((w) => w.word?.trim() !== "") || [];

        if (cleanRoot.length > 0 || cleanWords.length > 0) {
          validGroups.push({
            root: cleanRoot.length > 0 ? cleanRoot : undefined,
            words: cleanWords.length > 0 ? cleanWords : undefined,
          });
        }
      });

      if (validGroups.length > 0) {
        payload.word_families = validGroups;
      }
    }

    // other relative word
    ["synonyms", "antonyms", "related_phrases", "related_idioms"].forEach(
      (key) => {
        const arr = data[key];
        if (arr && arr.length > 0) {
          payload[key] = arr.filter(
            (item: RelatedItem) => item.word?.trim() !== "",
          );
        }
      },
    );

    try {
      await onSubmit(payload as VocabularyCreatePayload);
    } catch (err) {
      console.error("Submit failed:", err);
      setSubmitError("Failed to save the new word. Please try again.");
    }
  };

  return (
    <form
      className="filter-card vocab-form"
      onSubmit={handleSubmit(onFormSubmit, onFormError)}
    >
      {submitError && <div className="error-banner">{submitError}</div>}

      {/* Core Word Input */}
      <div className="filter-group">
        <div className="label-with-action">
          <label>German Word *</label>
          <button
            type="button"
            onClick={handleAiAutoFill}
            disabled={isAiLoading || !currentWord.trim()}
            className="ai-action-btn"
          >
            {isAiLoading ? "Thinking..." : "AI Auto-fill"}
          </button>
        </div>
        <input
          type="text"
          className={errors.word ? "input-error" : ""}
          {...register("word", {
            required: true,
            onChange: (e) => {
              if (currentPos === "noun") {
                setValue("word", capitalizeFirstLetter(e.target.value));
              } else if (
                [
                  "verb",
                  "adjective",
                  "adverb",
                  "preposition",
                  "conjunction",
                  "particle",
                ].includes(currentPos as string)
              ) {
                setValue("word", lowercaseFirstLetter(e.target.value));
              }
            },
          })}
          placeholder="e.g. Apfel"
        />
      </div>

      {/* Part of Speech */}
      <div className="filter-group">
        <label>Part of Speech *</label>
        <div className={errors.part_of_speech ? "select-error" : ""}>
          <Controller
            name="part_of_speech"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomSelect
                value={value || ""}
                onChange={(val) => {
                  onChange(val);
                  const currentWord = getValues("word");
                  if (val === "noun") {
                    setValue("word", capitalizeFirstLetter(currentWord));
                  } else if (
                    [
                      "verb",
                      "adjective",
                      "adverb",
                      "preposition",
                      "conjunction",
                      "particle",
                    ].includes(val)
                  ) {
                    setValue("word", lowercaseFirstLetter(currentWord));
                  }
                }}
                options={PartOfSpeechOptions}
                placeholder="Select..."
              />
            )}
          />
        </div>
      </div>

      {/* Register and Connotation */}
      {(requiresWordRegister || requiresConnotation) && (
        <div
          className={
            requiresWordRegister && requiresConnotation ? "two-col-grid" : ""
          }
        >
          {requiresWordRegister && (
            <div className="filter-group">
              <label>Register *</label>
              <div className={errors.word_register ? "select-error" : ""}>
                <Controller
                  name="word_register"
                  control={control}
                  rules={{ required: requiresWordRegister }}
                  render={({ field: { value, onChange } }) => (
                    <CustomMultiSelect
                      value={value || []}
                      onChange={(val) => onChange(val as WordRegisterType[])}
                      options={WordRegisterOptions}
                      placeholder="Select Register..."
                    />
                  )}
                />
              </div>
            </div>
          )}
          {requiresConnotation && (
            <div className="filter-group">
              <label>Connotation *</label>
              <div className={errors.connotation ? "select-error" : ""}>
                <Controller
                  name="connotation"
                  control={control}
                  rules={{ required: requiresConnotation }}
                  render={({ field: { value, onChange } }) => (
                    <CustomMultiSelect
                      value={value || []}
                      onChange={(val) => onChange(val as ConnotationType[])}
                      options={ConnotationOptions}
                      placeholder="Select Connotation..."
                    />
                  )}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {currentPos === "noun" && (
        <div className="two-col-grid">
          <div className="filter-group">
            <label>Gender *</label>
            <div className={errors.gender ? "select-error" : ""}>
              <Controller
                name="gender"
                control={control}
                rules={{ required: currentPos === "noun" }}
                render={({ field: { value, onChange } }) => (
                  <CustomSelect
                    value={value || ""}
                    onChange={onChange}
                    options={GenderOptions}
                    placeholder="Select..."
                  />
                )}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>Plural *</label>
            <input
              type="text"
              className={errors.plural ? "input-error" : ""}
              {...register("plural", { required: currentPos === "noun" })}
              placeholder="e.g. Äpfel or - if no Plural"
            />
          </div>
        </div>
      )}

      {/* meaning field */}
      {meaningFields.map((field, mIndex) => {
        const currentExamples = meaningsWatch?.[mIndex]?.example || [];
        return (
          <React.Fragment key={field.id}>
            <div className="filter-group">
              <label>Meaning {mIndex > 0 ? mIndex + 1 : ""} *</label>
              <div className="input-with-action">
                <input
                  type="text"
                  className={
                    errors.meaning?.[mIndex]?.mean ? "input-error" : ""
                  }
                  {...register(
                    `meaning.${mIndex}.mean` as Path<VocabularyCreatePayload>,
                    { required: true },
                  )}
                  placeholder="e.g. Apple"
                />
                {mIndex === meaningFields.length - 1 && (
                  <IconButton
                    icon="add"
                    onClick={() => appendMeaning({ mean: "", example: [] })}
                    title="Add Meaning"
                    color="var(--primary-purple)"
                  />
                )}
                {meaningFields.length > 1 && (
                  <IconButton
                    icon="remove"
                    onClick={() => removeMeaning(mIndex)}
                    title="Remove Meaning"
                    color="#ff4d4f"
                  />
                )}
              </div>
            </div>

            <div className="filter-group">
              <div className="input-with-action">
                {currentExamples.length === 0 && (
                  <IconButton
                    icon="add"
                    onClick={() =>
                      setValue(
                        `meaning.${mIndex}.example` as Path<VocabularyCreatePayload>,
                        [""],
                      )
                    }
                    title="Add Example"
                    color="var(--primary-purple)"
                  />
                )}
                <label>Example</label>
              </div>
              {currentExamples.length > 0 &&
                currentExamples.map((ex, exIndex) => (
                  <div className="input-with-action" key={exIndex}>
                    <input
                      type="text"
                      {...register(
                        `meaning.${mIndex}.example.${exIndex}` as Path<VocabularyCreatePayload>,
                      )}
                      placeholder="e.g. Ich esse jeden Tag einen Apfel."
                    />
                    {exIndex === currentExamples.length - 1 && (
                      <IconButton
                        icon="add"
                        onClick={() =>
                          setValue(
                            `meaning.${mIndex}.example` as Path<VocabularyCreatePayload>,
                            [...currentExamples, ""],
                          )
                        }
                        title="Add Example"
                        color="var(--primary-purple)"
                      />
                    )}
                    <IconButton
                      icon="remove"
                      onClick={() =>
                        setValue(
                          `meaning.${mIndex}.example` as Path<VocabularyCreatePayload>,
                          currentExamples.filter((_, i) => i !== exIndex),
                        )
                      }
                      title="Remove Example"
                      color="#ff4d4f"
                    />
                  </div>
                ))}
            </div>
          </React.Fragment>
        );
      })}

      {/**is_regular */}
      {["verb", "adjective"].includes(currentPos as string) && (
        <div className="filter-group">
          <label>Regular *</label>
          <div className={errors.is_regular ? "select-error" : ""}>
            <Controller
              name="is_regular"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <div className="segmented-control">
                  {/* is regular, true */}
                  <label
                    className={`segment-label ${value === true ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="is_regular"
                      checked={value === true}
                      onChange={() => onChange(true)} // Boolean True to RHF
                    />
                    <span className="radio-circle"></span>
                    is regular
                  </label>
                  {/* is not regular, False */}
                  <label
                    className={`segment-label ${value === false ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="is_regular"
                      checked={value === false}
                      onChange={() => onChange(false)} // Boolean False to RHF
                    />
                    <span className="radio-circle"></span>
                    is not regular
                  </label>
                </div>
              )}
            />
          </div>
        </div>
      )}

      {/* verb field */}
      {currentPos === "verb" && (
        <>
          <div className="filter-group">
            <label>Verb Base Forms (Präsens, Präteritum, Partizip II) *</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                className={errors.verb_base_forms?.present ? "input-error" : ""}
                {...register("verb_base_forms.present", {
                  required: currentPos === "verb",
                })}
                placeholder="Präsens (e.g. isst)"
              />
              <input
                type="text"
                className={errors.verb_base_forms?.past ? "input-error" : ""}
                {...register("verb_base_forms.past", {
                  required: currentPos === "verb",
                })}
                placeholder="Präteritum (e.g. aß)"
              />
              <input
                type="text"
                className={
                  errors.verb_base_forms?.past_participle ? "input-error" : ""
                }
                {...register("verb_base_forms.past_participle", {
                  required: currentPos === "verb",
                })}
                placeholder="Partizip II (e.g. gegessen)"
              />
            </div>
          </div>

          <div className="two-col-grid">
            <div className="filter-group">
              <label>Perfect Auxiliary *</label>
              <div className={errors.perfect_auxiliary ? "select-error" : ""}>
                <Controller
                  name="perfect_auxiliary"
                  control={control}
                  rules={{ required: currentPos === "verb" }}
                  render={({ field: { value, onChange } }) => (
                    <CustomSelect
                      value={value || ""}
                      onChange={onChange}
                      options={PerfectAuxiliaryOptions}
                      placeholder="Select..."
                    />
                  )}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Type of Verb *</label>
              <div className={errors.verb_type ? "select-error" : ""}>
                <Controller
                  name="verb_type"
                  control={control}
                  rules={{ required: currentPos === "verb" }}
                  render={({ field: { value, onChange } }) => (
                    <CustomSelect
                      value={value || ""}
                      onChange={onChange}
                      options={VerbTypeOptions}
                      placeholder="Select..."
                    />
                  )}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Transitivity *</label>
              <div className={errors.transitivity ? "select-error" : ""}>
                <Controller
                  name="transitivity"
                  control={control}
                  rules={{ required: currentPos === "verb" }}
                  render={({ field: { value, onChange } }) => (
                    <CustomSelect
                      value={value || ""}
                      onChange={onChange}
                      options={TransitivityOptions}
                      placeholder="Select..."
                    />
                  )}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Reflexivity *</label>
              <div className={errors.reflexivity ? "select-error" : ""}>
                <Controller
                  name="reflexivity"
                  control={control}
                  rules={{ required: currentPos === "verb" }}
                  render={({ field: { value, onChange } }) => (
                    <CustomSelect
                      value={value || ""}
                      onChange={onChange}
                      options={ReflexivityOptions}
                      placeholder="Select..."
                    />
                  )}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Personality *</label>
              <div className={errors.personality ? "select-error" : ""}>
                <Controller
                  name="personality"
                  control={control}
                  rules={{ required: currentPos === "verb" }}
                  render={({ field: { value, onChange } }) => (
                    <CustomSelect
                      value={value || ""}
                      onChange={onChange}
                      options={PersonalityOptions}
                      placeholder="Select..."
                    />
                  )}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Separability *</label>
              <div className={errors.separability ? "select-error" : ""}>
                <Controller
                  name="separability"
                  control={control}
                  rules={{ required: currentPos === "verb" }}
                  render={({ field: { value, onChange } }) => (
                    <CustomSelect
                      value={value || ""}
                      onChange={onChange}
                      options={SeparabilityOptions}
                      placeholder="Select..."
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* adjective fields */}
      {currentPos === "adjective" && !isRegular && (
        <div className="filter-group">
          <label>Inflected Stem *</label>
          <input
            type="text"
            className={errors.special_declension ? "input-error" : ""}
            {...register("special_declension", { required: true })}
            placeholder="e.g. hoh-"
          />
        </div>
      )}

      {/* adverb fields */}
      {currentPos === "adverb" && (
        <div className="filter-group">
          <label>Adverbial Type *</label>
          <div className={errors.adverbial_type ? "select-error" : ""}>
            <Controller
              name="adverbial_type"
              control={control}
              rules={{ required: currentPos === "adverb" }}
              render={({ field: { value, onChange } }) => (
                <CustomMultiSelect
                  value={value || []}
                  onChange={(val) => onChange(val as AdverbialType[])}
                  options={AdverbialOptions}
                  placeholder="Select..."
                />
              )}
            />
          </div>
        </div>
      )}

      {/*degrees for adjective and adverb but not must fill in if adverb */}
      {(currentPos === "adjective" || currentPos === "adverb") && (
        <div className="filter-group">
          <label>Degrees of Comparison (Comparative, Superlative)</label>
          <div className="two-col-grid">
            <input
              type="text"
              {...register("degrees.comparative")}
              placeholder="Comparative (e.g. größer)"
            />
            <input
              type="text"
              {...register("degrees.superlative")}
              placeholder="Superlative (e.g. am größten)"
            />
          </div>
        </div>
      )}

      {/* pronoun field */}
      {currentPos === "pronoun" && (
        <div className="filter-group">
          <label>Pronoun Type *</label>
          <div className={errors.pronoun_type ? "select-error" : ""}>
            <Controller
              name="pronoun_type"
              control={control}
              rules={{ required: currentPos === "pronoun" }}
              render={({ field: { value, onChange } }) => (
                <CustomSelect
                  value={value || ""}
                  onChange={onChange}
                  options={PronounTypeOptions}
                  placeholder="Select..."
                />
              )}
            />
          </div>
        </div>
      )}

      {currentPos === "pronoun" &&
        ["personal", "possessive", "reflexive"].includes(
          currentPronounType as string,
        ) && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="filter-group">
              <label>Personal Pronoun</label>
              <PersonalPronounGrid
                register={register}
                matrixName="personal_pronoun_matrix"
              />
            </div>
            <div className="filter-group">
              <label>Possessive Article</label>
              <DeclensionGrid
                register={register}
                matrixName="possessive_article_matrix"
              />
            </div>
            <div className="filter-group">
              <label>Possessive Pronoun</label>
              <DeclensionGrid
                register={register}
                matrixName="possessive_pronoun_matrix"
              />
            </div>
            <div className="filter-group">
              <label>Reflexive Pronoun</label>
              <ReflexiveGrid
                register={register}
                matrixName="reflexive_pronoun_matrix"
              />
            </div>
          </div>
        )}

      {currentPos === "pronoun" &&
        ["relative", "demonstrative", "indefinite", "interrogative"].includes(
          currentPronounType as string,
        ) && (
          <div className="filter-group">
            <label>Declension Table</label>
            <DeclensionGrid
              register={register}
              matrixName="generic_declension_matrix"
            />
          </div>
        )}

      {/* article field */}
      {currentPos === "article" && (
        <div className="filter-group">
          <label>Article Type *</label>
          <div className={errors.article_type ? "select-error" : ""}>
            <Controller
              name="article_type"
              control={control}
              rules={{ required: currentPos === "article" }}
              render={({ field: { value, onChange } }) => (
                <CustomSelect
                  value={value || ""}
                  onChange={onChange}
                  options={ArticleTypeOptions}
                  placeholder="Select..."
                />
              )}
            />
          </div>
        </div>
      )}

      {currentPos === "article" &&
        [
          "definite_article",
          "indefinite_article",
          "negative_article",
          "demonstrative_article",
          "indefinite_quantifier",
        ].includes(currentArticleType as string) && (
          <div className="filter-group">
            <label>Declension Table</label>
            <DeclensionGrid
              register={register}
              matrixName="generic_declension_matrix"
            />
          </div>
        )}

      {currentPos === "article" &&
        currentArticleType === "possessive_article" && (
          <div className="filter-group">
            <label>Possessive Article</label>
            <DeclensionGrid
              register={register}
              matrixName="possessive_article_matrix"
            />
          </div>
        )}

      {/*contraction, contraction input: e.g. an + das = ans, in + dem = im*/}
      {currentPos === "preposition" && (
        <div className="filter-group">
          <label>Contraction</label>
          {contractionFields.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <IconButton
                icon="add"
                onClick={() =>
                  appendContraction({
                    preposition: "",
                    article: "",
                    result: "",
                  })
                }
                title="Add"
                color="var(--primary-purple)"
              />
            </div>
          ) : (
            contractionFields.map((field, index) => (
              <div className="input-with-action" key={field.id}>
                <input
                  type="text"
                  {...register(`contraction.${index}.preposition`)}
                  placeholder="Preposition (e.g. an)"
                />
                <span>+</span>
                <input
                  type="text"
                  {...register(`contraction.${index}.article`)}
                  placeholder="Article (e.g. das)"
                />
                <span>=</span>
                <input
                  type="text"
                  {...register(`contraction.${index}.result`)}
                  placeholder="Result (e.g. ans)"
                />
                <IconButton
                  icon="remove"
                  onClick={() => removeContraction(index)}
                  title="Remove"
                  color="#ff4d4f"
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* case_governance*/}
      {![
        "adverb",
        "conjunction",
        "pronoun",
        "article",
        "numeral",
        "particle",
        "interjection",
      ].includes(currentPos as string) && (
        <div className="filter-group">
          {cgFields.length === 0 ? (
            <div className="nested-section-header">
              <h3 className="nested-section-title">
                Case Governance
                {["verb", "preposition"].includes(currentPos as string)
                  ? "*"
                  : ""}
              </h3>
              <div className="nested-section-action">
                <IconButton
                  icon="add"
                  onClick={() =>
                    appendCg({
                      type: [] as CaseGovernmentType[],
                      pattern: "",
                      meaning: [{ mean: "", example: [] }],
                    })
                  }
                  title="Add Case Rule"
                  color="var(--primary-purple)"
                />
              </div>
            </div>
          ) : (
            cgFields.map((field, index) => {
              const currentCgMeanings = cgWatch?.[index]?.meaning || [];
              const basePath = `case_governance.${index}`;

              const isCgRequiredPos = [
                "verb",
                "adjective",
                "preposition",
              ].includes(currentPos as string);
              const hideRemoveBtn = isCgRequiredPos && cgFields.length === 1;
              return (
                <div className="nested-card" key={field.id}>
                  <div className="nested-card-header">
                    <h3 className="nested-section-title">
                      Case Governance ({index + 1})
                      {["verb", "adjective", "preposition"].includes(
                        currentPos as string,
                      ) && index === 0
                        ? "*"
                        : ""}
                    </h3>
                    <div className="nested-section-action">
                      {index === cgFields.length - 1 && (
                        <IconButton
                          icon="add"
                          onClick={() =>
                            appendCg({
                              type: [] as CaseGovernmentType[],
                              pattern: "",
                              meaning: [{ mean: "", example: [] }],
                            })
                          }
                          title="Add Case Rule"
                          color="var(--primary-purple)"
                        />
                      )}
                      {!hideRemoveBtn && (
                        <IconButton
                          icon="delete"
                          onClick={() => removeCg(index)}
                          title="Remove"
                          color="#ff4d4f"
                        />
                      )}
                    </div>
                  </div>
                  <div className="filter-group">
                    <div className="two-col-grid">
                      <div className="filter-group">
                        <label>Select Case</label>
                        <div
                          className={
                            errors.case_governance?.[index]?.type
                              ? "select-error"
                              : ""
                          }
                        >
                          <Controller
                            name={
                              `${basePath}.type` as Path<VocabularyCreatePayload>
                            }
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <CustomMultiSelect
                                value={(value as string[]) || []}
                                onChange={(val) =>
                                  onChange(val as CaseGovernmentType[])
                                }
                                options={CaseGovernmentOptions}
                                placeholder="Select Case..."
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="filter-group">
                        <label>Pattern</label>
                        <input
                          type="text"
                          {...register(`case_governance.${index}.pattern`)}
                          placeholder="Pattern (e.g. mit + DAT)"
                        />
                      </div>
                    </div>
                  </div>
                  {renderNestedMeanings(basePath, currentCgMeanings)}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* sentence_pattern*/}
      {![
        "noun",
        "adjective",
        "preposition",
        "pronoun",
        "article",
        "numeral",
        "particle",
        "interjection",
      ].includes(currentPos as string) && (
        <div className="filter-group">
          {spFields.length === 0 ? (
            <div className="nested-section-header">
              <h3 className="nested-section-title">
                Sentence Pattern
                {["adverb", "conjunction"].includes(currentPos as string)
                  ? " *"
                  : ""}
              </h3>
              <div className="nested-section-action">
                <IconButton
                  icon="add"
                  onClick={() => handleAddSp(true)}
                  title="Add Sentence Pattern"
                  color="var(--primary-purple)"
                />
              </div>
            </div>
          ) : (
            spFields.map((field, index) => {
              const currentSpMeanings = spWatch?.[index]?.meaning || [];
              const basePath = `sentence_pattern.${index}`;
              const isAdverb = currentPos === "adverb";
              const isConjunction = currentPos === "conjunction";
              const showTypeField = isAdverb || isConjunction;

              let spTypeOptions = SentencePatternTypeOptions;
              if (isAdverb) {
                // show Conjunction Adverb only
                spTypeOptions = SentencePatternTypeOptions.filter(
                  (opt) => opt.value === "conjunction_adverb",
                );
              } else if (isConjunction) {
                // not include Conjunction Adverb
                spTypeOptions = SentencePatternTypeOptions.filter(
                  (opt) => opt.value !== "conjunction_adverb",
                );
              }

              const hideRemoveBtn = showTypeField && spFields.length === 1;

              return (
                <div className="nested-card" key={field.id}>
                  <div className="nested-card-header">
                    <h3 className="nested-section-title">
                      Sentence Pattern ({index + 1})
                      {["adverb", "conjunction"].includes(
                        currentPos as string,
                      ) && index === 0
                        ? " *"
                        : ""}
                    </h3>
                    <div className="nested-section-action">
                      {index === spFields.length - 1 && (
                        <IconButton
                          icon="add"
                          onClick={() => handleAddSp(true)}
                          title="Add Sentence Pattern"
                          color="var(--primary-purple)"
                        />
                      )}
                      {!hideRemoveBtn && (
                        <IconButton
                          icon="delete"
                          onClick={() => removeSp(index)}
                          title="Remove"
                          color="#ff4d4f"
                        />
                      )}
                    </div>
                  </div>

                  <div className="filter-group">
                    {showTypeField && (
                      <div className="filter-group">
                        <label>Pattern Type *</label>
                        <div
                          className={
                            errors.sentence_pattern?.[index]?.type
                              ? "select-error"
                              : ""
                          }
                        >
                          <Controller
                            name={
                              `${basePath}.type` as Path<VocabularyCreatePayload>
                            }
                            control={control}
                            rules={{ required: showTypeField }}
                            render={({ field: { value, onChange } }) => (
                              <CustomSelect
                                value={(value as string) || ""}
                                onChange={onChange}
                                options={spTypeOptions}
                                placeholder="Pattern Type"
                              />
                            )}
                          />
                        </div>
                      </div>
                    )}

                    <div className="filter-group">
                      <label>Sentence Pattern *</label>
                      <div
                        className={
                          errors.sentence_pattern?.[index]?.pattern
                            ? "select-error"
                            : ""
                        }
                      >
                        <Controller
                          name={
                            `${basePath}.pattern` as Path<VocabularyCreatePayload>
                          }
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomSelect
                              value={(value as string) || ""}
                              onChange={onChange}
                              options={SentencePatternOptions}
                              placeholder="Specific Pattern"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  {renderNestedMeanings(basePath, currentSpMeanings)}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Image */}
      {["noun", "verb", "adjective", "adverb", "preposition"].includes(
        currentPos as string,
      ) && (
        <div className="filter-group">
          <div className="label-with-action">
            <label>Image</label>
            <button
              type="button"
              onClick={handleAiGenerateImage}
              disabled={isAiImageLoading || !currentWord?.trim()}
              className="ai-action-btn"
            >
              {isAiImageLoading ? "Painting..." : "AI Generate Image"}
            </button>
          </div>
          <input
            type="url"
            {...register("image_url")}
            placeholder="e.g. https://example.com/apple.jpg"
          />

          {/* image preview */}
          {currentImageUrl.trim() && (
            <div className="image-preview-wrapper">
              <span className="preview-label">Image Preview</span>
              <img
                src={currentImageUrl}
                alt="Vocabulary Preview"
                className="preview-thumbnail"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Grammar Notes*/}
      <div className="filter-group">
        {noteFields.length === 0 ? (
          <div className="nested-card-header">
            <h3 className="nested-section-title">Grammar Notes</h3>
            <div className="nested-section-action">
              <IconButton
                icon="add"
                onClick={() => appendNote("")}
                title="Add Note"
                color="var(--primary-purple)"
              />
            </div>
          </div>
        ) : (
          noteFields.map((field, index) => (
            <div className="nested-card">
              <div className="nested-card-header">
                <h4 className="nested-section-title">Grammar Notes</h4>
              </div>
              <div className="input-with-action" key={field.id}>
                <input
                  type="text"
                  {...register(`grammar_notes.${index}` as const)}
                  placeholder="e.g. Takes 'sein' as perfect auxiliary in Southern Germany"
                />
                {index === noteFields.length - 1 && (
                  <IconButton
                    icon="add"
                    onClick={() => appendNote("")}
                    title="Add Note"
                    color="var(--primary-purple)"
                  />
                )}
                <IconButton
                  icon="remove"
                  onClick={() => removeNote(index)}
                  title="Remove Note"
                  color="#ff4d4f"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Related words */}
      {!["article", "numeral"].includes(currentPos as string) &&
        (() => {
          const renderRelatedList = (
            label: string,
            fields: RelatedItem[],
            append: (payload: RelatedItem) => void,
            remove: (index: number) => void,
            nameKey:
              | "synonyms"
              | "antonyms"
              | "related_phrases"
              | "related_idioms",
          ) => {
            return (
              <div className={"group-divider-section"}>
                <div className="label-with-action">
                  <h4 className="nested-section-subtitle">{label}</h4>
                  {fields.length === 0 && (
                    <IconButton
                      icon="add"
                      onClick={() =>
                        append({
                          id: 0,
                          word: "",
                          part_of_speech: "" as PartOfSpeechType,
                        })
                      }
                      title={`Add ${label}`}
                      color="var(--primary-purple)"
                    />
                  )}
                </div>

                {fields.length > 0 && (
                  <div className="filter-group">
                    {fields.map((item, index) => (
                      <div className="two-col-grid" key={item.id}>
                        <div className="filter-group">
                          {index === 0 && <label>Word / Phrase</label>}
                          <input
                            type="text"
                            {...register(
                              `${nameKey}.${index}.word` as Path<VocabularyCreatePayload>,
                            )}
                            placeholder="Word / Phrase"
                          />
                        </div>
                        <div className="filter-group">
                          {index === 0 && <label>Part of Speech</label>}
                          <div className="input-with-action">
                            <Controller
                              name={
                                `${nameKey}.${index}.part_of_speech` as Path<VocabularyCreatePayload>
                              }
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <CustomSelect
                                  value={(value as string) || ""}
                                  onChange={onChange}
                                  options={PartOfSpeechOptions}
                                  placeholder="Select..."
                                />
                              )}
                            />
                            {index === fields.length - 1 && (
                              <IconButton
                                icon="add"
                                onClick={() =>
                                  append({
                                    id: 0,
                                    word: "",
                                    part_of_speech: "" as PartOfSpeechType,
                                  })
                                }
                                title={`Add ${label}`}
                                color="var(--primary-purple)"
                              />
                            )}
                            <IconButton
                              icon="remove"
                              onClick={() => remove(index)}
                              title="Remove"
                              color="#ff4d4f"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          };

          return (
            <div className="nested-card">
              <div className="nested-section-header">
                <h3 className="nested-section-title">Word connections</h3>
              </div>

              <div className="group-section">
                {wfFields.length === 0 ? (
                  <div className="nested-card-action">
                    <h4 className="nested-section-subtitle">Word Family</h4>
                    <div className="nested-section-action">
                      <IconButton
                        icon="add"
                        onClick={() => appendWf({ root: "", words: [] })}
                        title="Add Word Family Group"
                        color="var(--primary-purple)"
                      />
                    </div>
                  </div>
                ) : (
                  wfFields.map((r, rIndex) => {
                    const currentWords =
                      watch(`word_families.${rIndex}.words`) || [];

                    return (
                      <div className="filter-group" key={r.id}>
                        <div
                          className={
                            rIndex !== 0
                              ? "group-divider-section"
                              : "filter-group"
                          }
                        >
                          <div className="label-with-action">
                            <h4 className="nested-section-subtitle">
                              Word Family ({rIndex + 1})
                            </h4>
                            <div className="nested-card-action">
                              {rIndex === wfFields.length - 1 && (
                                <IconButton
                                  icon="add"
                                  onClick={() =>
                                    appendWf({ root: "", words: [] })
                                  }
                                  title="Add Word Family Group"
                                  color="var(--primary-purple)"
                                />
                              )}
                              <IconButton
                                icon="delete"
                                onClick={() => removeWf(rIndex)}
                                title="Remove Group"
                                color="#ff4d4f"
                              />
                            </div>
                          </div>
                          <div className="filter-group">
                            <label>Root</label>
                            <div className="input-with-action" key={r.id}>
                              <input
                                type="text"
                                {...register(
                                  `word_families.${rIndex}.root` as const,
                                )}
                                placeholder="e.g. fahr-"
                              />
                            </div>
                          </div>

                          <div className="filter-group">
                            {currentWords.length === 0 ? (
                              <div className="label-with-action">
                                <label>Word</label>
                                <IconButton
                                  icon="add"
                                  onClick={() => {
                                    setValue(`word_families.${rIndex}.words`, [
                                      {
                                        id: 0,
                                        word: "",
                                        part_of_speech: "" as PartOfSpeechType,
                                      },
                                    ]);
                                  }}
                                  title="Add Word"
                                  color="var(--primary-purple)"
                                />
                              </div>
                            ) : (
                              currentWords.map((w, wIndex) => (
                                <div className="filter-group">
                                  <div
                                    className="two-col-grid"
                                    key={w.id}
                                    style={{
                                      marginBottom:
                                        wIndex < currentWords.length - 1
                                          ? "8px"
                                          : "0",
                                    }}
                                  >
                                    <div className="filter-group">
                                      {wIndex === 0 && <label>Word</label>}
                                      <input
                                        type="text"
                                        {...register(
                                          `word_families.${rIndex}.words.${wIndex}.word` as const,
                                        )}
                                        placeholder="Word / Phrase"
                                      />
                                    </div>
                                    <div className="filter-group">
                                      {wIndex === 0 && (
                                        <label>Part of Speech</label>
                                      )}
                                      <div className="input-with-action">
                                        <Controller
                                          name={
                                            `word_families.${rIndex}.words.${wIndex}.part_of_speech` as const
                                          }
                                          control={control}
                                          render={({
                                            field: { value, onChange },
                                          }) => (
                                            <CustomSelect
                                              value={(value as string) || ""}
                                              onChange={onChange}
                                              options={PartOfSpeechOptions}
                                              placeholder="Select..."
                                            />
                                          )}
                                        />
                                        {wIndex === currentWords.length - 1 && (
                                          <IconButton
                                            icon="add"
                                            onClick={() => {
                                              const currentWords =
                                                getValues(
                                                  `word_families.${rIndex}.words`,
                                                ) || [];
                                              setValue(
                                                `word_families.${rIndex}.words` as const,
                                                [
                                                  ...currentWords,
                                                  {
                                                    id: 0,
                                                    word: "",
                                                    part_of_speech:
                                                      "" as PartOfSpeechType,
                                                  },
                                                ],
                                              );
                                            }}
                                            title="Add Word"
                                            color="var(--primary-purple)"
                                          />
                                        )}
                                        <IconButton
                                          icon="remove"
                                          onClick={() => {
                                            const newWords =
                                              currentWords.filter(
                                                (_, i) => i !== wIndex,
                                              );
                                            setValue(
                                              `word_families.${rIndex}.words` as const,
                                              newWords,
                                            );
                                          }}
                                          title="Remove Word"
                                          color="#ff4d4f"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {renderRelatedList(
                "Synonyms",
                synFields,
                appendSyn,
                removeSyn,
                "synonyms",
              )}
              {renderRelatedList(
                "Antonyms",
                antFields,
                appendAnt,
                removeAnt,
                "antonyms",
              )}
              {renderRelatedList(
                "Related Phrases",
                rpFields,
                appendRp,
                removeRp,
                "related_phrases",
              )}
              {renderRelatedList(
                "Related Idioms",
                riFields,
                appendRi,
                removeRi,
                "related_idioms",
              )}
            </div>
          );
        })()}

      <button
        type="submit"
        className="search-button submit-btn"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};
