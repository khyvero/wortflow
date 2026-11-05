import base64
from openai import OpenAI
from google import genai
from google.genai import types
from config import settings

import schemas

import logging

logger = logging.getLogger(__name__)

client = genai.Client(api_key=settings.GEMINI_API_KEY)

class AIService:
    @staticmethod
    def generate_completion(word: str, current_data: dict) -> dict:
        logger.info(f"Generating AI completion for word: '{word}'")

        prompt = f"""
                Analyze the German word "{word}".

                The user has partially filled out a database record for this word. 
                Here is the current data (some fields may be correct, some incorrect, and some null/missing):
                {current_data}

                YOUR TASK:
                1. VALIDATE: Check if the user's filled fields are grammatically correct for this German word.
                2. CORRECT: If a filled field is WRONG (e.g., wrong gender, wrong verb type), FIX it.
                3. FILL: Fill in all the missing (`null` or empty) fields with the correct linguistic data.
                4. PRESERVE: If a user's filled field is correct (especially 'meaning' or 'example'), keep it EXACTLY as it is. Do not overwrite correct data.

                RULES FOR TEXT GENERATION:
                - word: The corrected base form or canonical form of the input expression.
                - part_of_speech: "noun", "verb", "adjective", "adverb", "preposition", "conjunction","pronoun", "particle", "interjection", "phrase", or "idiom"
                - gender: "masculine", "feminine", "neuter", or null
                - plural: string or null
                - is_regular: true or false (boolean) or null
                - perfect_auxiliary: "haben", "sein", "both", or null
                - verb_type: "full", "modal", "auxiliary", or null
                - transitivity: "transitive", "intransitive", "ambitransitive", or null
                - reflexivity: "reflexive", "irreflexive", "pseudo_reflexive", or null
                - personality: "personal", "impersonal", "both", or null
                - separability: "separable", "inseparable", "both", or null
                - adverbial_type: array of ["time", "reason", "manner", "place"], or null
                - pronoun_type: "personal", "possessive", "reflexive", "relative", "demonstrative", "indefinite", "interrogative", or null
                - word_register: array of ["standard", "conversational", "formal", "literary", "slang"], or null
                - connotation: array of ["neutral", "positive", "negative", "ironic", "pejorative"], or null

                For 'verb_base_forms', provide a dict with keys: 'infinitive', 'present', 'past', 'past_participle'.
                For 'degrees', provide a dict with keys: 'comparative', 'superlative'.
                
                For 'meaning', provide an array of objects. Each object must contain:
                    - 'mean': its meaning in English as a string
                    - 'example': a list of natural German example sentences (array of strings)
                
                For 'contraction' (applicable to prepositions), provide an array of objects. Each object must contain:
                    - 'preposition': the base preposition (e.g., "an", "in")
                    - 'article': the definite article it combines with (e.g., "das", "dem")
                    - 'result': the contracted form (e.g., "ans", "im")
                 
                For 'case_governance', if the word dictates a specific grammatical case (e.g., verbs, prepositions, adjectives), provide an array of objects. Each object must contain:
                    - 'type': array of strings matching EXACTLY ["nominativ", "akkusativ", "dativ", "genitiv", "prepositional", "none", "reflexive", "impersonal"]
                    - 'pattern': a string showing the grammar pattern (e.g., "sich auf + AKK freuen" or "schlafen (no object)")
                    - 'meaning': array of objects with 'mean' (English translation of this specific pattern) and 'example' (array of German sentences).

                For 'sentence_pattern', if the word determines a specific sentence structure (e.g., conjunctions, adverbs), provide an array of objects. Each object must contain:
                    - 'type': string matching EXACTLY one of ["conjunction_aduso", "subordinating_conjunction", "conjunction_adverb", "double_conjunction", "proportional_conjunction", "infinitive_construction"]
                    - 'pattern': string matching exactly one of the valid SentencePatternEnum values (e.g., "tekamolo", "imperative", "yes_no_question", "w_question", "conjunction_aduso", "subordinating_main_first", "subordinating_sub_first", "conjunctive_adverb_front", "conjunctive_adverb_mid", "dual_standard", "dual_inversion", "dual_mid_sentence", "dual_concession", "proportional_conjunction", "relative", "relative_embedded", "indirect_question", "comparative_standard", "comparative_unreal", "comparative_unreal_inversion", "infinitive_construction", "infinitive_bare", "infinitive_front", "infinitive_embedded", "subordinate_embedded", "conditional_verb_first", "participle_clause", "apposition")
                    - 'meaning': array of objects with 'mean' (English translation) and 'example' (array of German sentences).

                Return the fully completed and corrected JSON object conforming to the schema.
                """

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    # Pass existing Pydantic schema to enforce JSON structure
                    response_schema=schemas.AICompletionResponse,
                    temperature=0.3
                )
            )
            return response.parsed.model_dump()
        except Exception as e:
            logger.error(f"Failed to generate completion for '{word}': {e}", exc_info=True)
            raise

    @staticmethod
    def generate_image(word:str) -> str:
        logger.info(f"Generating AI image for word: '{word}'")

        prompt = f""" Generate an image that represents the meaning of the German word '{word}'.
                STYLE RULES: MUST be a flat vector illustration, modern UI style, bright colors, isolated on a pure white background.
                CONSTRAINT: ABSOLUTELY NO TEXT OR LETTERS in the image.
                """

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash-image",
                contents=prompt,
                config=types.GenerateContentConfig(
                    # Tell Gemini we expect an image back
                    response_modalities=["TEXT", "IMAGE"],
                    image_config=types.ImageConfig(
                        aspect_ratio="16:9"
                    )
                )
            )

            # Loop through the response parts to find the raw image data
            for part in response.candidates[0].content.parts:
                if part.inline_data is not None:
                    image_bytes = part.inline_data.data
                    b64_str = base64.b64encode(image_bytes).decode('utf-8')
                    return f"data:image/png;base64,{b64_str}"

            # If the loop finishes without returning, something went wrong (like safety filters)
            logger.warning(f"Gemini failed to return valid image data for '{word}'. Possible safety block.")
            raise ValueError("Gemini failed to generate an image. It may have been blocked by safety filters.")
        except Exception as e:
            logger.error(f"Error during image generation for '{word}': {e}", exc_info=True)
            raise