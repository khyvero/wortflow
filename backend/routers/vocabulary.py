from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, cast, String, func
from sqlalchemy.orm import Session
import logging
from database import get_db
import models
import schemas
import crud

# set logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/vocabulary", tags=["Vocabulary"])

# read a word by id (search)
@router.get("/{item_id}",
         response_model=schemas.VocabularyResponse,
         summary="Get a vocabulary by id",)
def read_vocabulary(item_id:int, db: Session = Depends(get_db)):
    db_item = crud.get_vocabulary(db, item_id)
    if not db_item:
        logger.warning(f"Vocabulary query failed: ID {item_id} does not exist.")
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Vocabulary with ID:{item_id} does not exist.",
        )
    return db_item

# read list of word by any column (for searching)
@router.get("",
         response_model=List[schemas.VocabularyResponse],
         summary="Search or list vocabulary items",)
def read_vocabularies(
        word: Optional[str] = None,
        gender: Optional[schemas.GenderEnum] = None,
        part_of_speech: Optional[schemas.PartOfSpeechEnum] = None,
        meaning: Optional[str] = None,
        word_register: Optional[schemas.WordRegisterEnum] = None,
        connotation: Optional[schemas.ConnotationEnum] = None,

        is_regular: Optional[bool] = None,
        perfect_auxiliary: Optional[schemas.PerfectAuxiliaryEnum] = None,
        verb_type: Optional[schemas.VerbTypeEnum] = None,
        transitivity: Optional[schemas.TransitivityEnum] = None,
        reflexivity: Optional[schemas.ReflexivityEnum] = None,
        personality: Optional[schemas.PersonalityEnum] = None,
        separability: Optional[schemas.SeparabilityEnum] = None,

        special_declension: Optional[str] = None,
        adverbial_type: Optional[schemas.AdverbialTypeEnum] = None,

        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)):
    query = db.query(models.VocabularyItem)

    # for safety, Regex search str, avoid error because user enter some specific simble
    def sanitize(text: Optional[str]) -> str:
        return text.replace('"', '').replace('\\', '') if text else ""

    if word:
        if word.strip() == "-":
            query = query.filter(
                or_(
                    models.VocabularyItem.plural.is_(None),
                    models.VocabularyItem.plural == "-",
                    models.VocabularyItem.plural == ""))
        else:
            safe_word = sanitize(word)
            # Extract Text from JSON Key
            query = query.filter(
                or_(
                    models.VocabularyItem.word.ilike(f"%{word}%"),
                    models.VocabularyItem.plural.ilike(f"%{word}%"),

                    # search specific key in verb_base_forms , for verb
                    models.VocabularyItem.verb_base_forms['infinitive'].astext.ilike(f"%{word}%"),
                    models.VocabularyItem.verb_base_forms['past'].astext.ilike(f"%{word}%"),
                    models.VocabularyItem.verb_base_forms['past_participle'].astext.ilike(f"%{word}%"),

                    # search anywhere inside the conjugation_table for verb
                    func.jsonb_path_exists(
                        models.VocabularyItem.conjugation_table,
                        f'$.** ? (@ type() == "string" && @ like_regex "{safe_word}" flag "i")'
                    ),

                    # search anywhere inside the degrees for adjective, adverb
                    models.VocabularyItem.degrees['comparative'].astext.ilike(f"%{word}%"),
                    models.VocabularyItem.degrees['superlative'].astext.ilike(f"%{word}%"),

                    # search by special_declension for adjective
                    models.VocabularyItem.special_declension.ilike(f"%{word}%"),
                )
            )

    # search by meaning
    if meaning:
        safe_meaning = sanitize(meaning)
        query = query.filter(
            func.jsonb_path_exists(
                models.VocabularyItem.meaning,
                f'$.** ? (@ type() == "string" && @ like_regex "{safe_meaning}" flag "i")'
            )
        )

    if gender:
        query = query.filter(models.VocabularyItem.gender == gender)

    if part_of_speech:
        query = query.filter(models.VocabularyItem.part_of_speech == part_of_speech)

    # search by word_register for all
    if word_register:
        query = query.filter(models.VocabularyItem.word_register.contains([word_register]))

    # search by connotation for noun, verb, adjective, adverb, particle, interjection, Phrases, idiom
    if connotation:
        query = query.filter(models.VocabularyItem.connotation.contains([connotation]))

    # search by is_regular for verb, adjective, adverb, pronoun
    if is_regular is not None:
        query = query.filter(models.VocabularyItem.is_regular == is_regular)

    # search by auxiliary_verb for verb
    if perfect_auxiliary:
        query = query.filter(models.VocabularyItem.perfect_auxiliary == perfect_auxiliary)

    # search by verb_type for verb
    if verb_type:
        query = query.filter(models.VocabularyItem.verb_type == verb_type)

    # search by transitivity for verb
    if transitivity:
        query = query.filter(models.VocabularyItem.transitivity == transitivity)

    # search by reflexivity for verb
    if reflexivity:
        query = query.filter(models.VocabularyItem.reflexivity == reflexivity)

    # search by personality for verb
    if personality:
        query = query.filter(models.VocabularyItem.personality == personality)

    # search by separability for verb
    if separability:
        query = query.filter(models.VocabularyItem.separability == separability)

    # search by adverbs_category for adverb
    if adverbial_type:
        query = query.filter(models.VocabularyItem.adverbial_type == adverbial_type)

    # search by special_declension for adjective
    if special_declension:
        query = query.filter(models.VocabularyItem.special_declension.ilike(f"%{special_declension}%"))

    # search by pattern_type in sentence_pattern for adverb, conjunction

    # search by declension_form for pronoun

    # personal_pronoun_matrix for pronoun
    # possessive_article_matrix for pronoun
    # possessive_pronoun_matrix for pronoun
    # reflexive_pronoun_matrix for pronoun
    # generic_declension_matrix for pronoun

    vocabularies = query.offset(skip).limit(limit).all()
    return [crud.get_vocabulary(db, v.id) for v in vocabularies]

# create new word
@router.post("",
          response_model=schemas.VocabularyResponse,
          status_code=status.HTTP_201_CREATED,
          summary="Create a new vocabulary",)
def create_vocabulary(item: schemas.VocabularyCreate, db: Session = Depends(get_db)):
    # check if word already exists
    existing = (db.query(models.VocabularyItem).filter(models.VocabularyItem.word == item.word).first())
    if existing:
        logger.warning(f"Failed to create vocabulary: '{item.word}' already exists.")
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = f"{item.word} already exists.",)

    try:
        result = crud.create_vocabulary(db=db, vocab_in=item)
        logger.info(f"Successfully created vocabulary: '{result.word}' (ID: {result.id})")
        return result
    except Exception as e:
        # if error, rollback transaction, protect DB
        db.rollback()
        logger.error(f"Database error while creating vocabulary '{item.word}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during database transaction.")

# update word
@router.patch("/{item_id}",
           response_model=schemas.VocabularyResponse,
           status_code=status.HTTP_200_OK,
           summary="Update a vocabulary",)
def update_vocabulary(item_id: int, item_update: schemas.VocabularyUpdate, db: Session = Depends(get_db)):

    try:
        result = crud.update_vocabulary(db=db, vocab_id=item_id, vocab_in=item_update)
        if not result:
            logger.warning(f"Vocabulary query failed: ID {item_id} does not exist.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vocabulary with ID:{item_id} does not exist.",
            )
        logger.info(f"Successfully updated vocabulary ID: {item_id}")
        return result
    except Exception as e:
        db.rollback()
        logger.error(f"Database error while updating vocabulary ID {item_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during database transaction.")

# remove word (delete)
@router.delete("/{item_id}",
            response_model=schemas.VocabularyResponse,
            summary="Delete a vocabulary",)
def delete_vocabulary(item_id:int, db: Session = Depends(get_db)):

    try:
        deleted_item = crud.delete_vocabulary(db=db, vocab_id=item_id)

        if not deleted_item:
            logger.warning(f"Vocabulary query failed: ID {item_id} does not exist.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vocabulary with ID:{item_id} does not exist.",
            )

        logger.info(f"Successfully deleted vocabulary ID: {item_id}")
        return deleted_item

    except Exception as e:
        db.rollback()
        logger.error(f"Database error while deleting vocabulary ID {item_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during database transaction.")
