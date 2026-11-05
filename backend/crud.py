from sqlalchemy.orm import Session
import models
import schemas

def get_vocabulary(db: Session, vocab_id: int) -> schemas.VocabularyResponse:
    # group the VocabularyItem
    db_item = db.query(models.VocabularyItem).filter(models.VocabularyItem.id == vocab_id).first()

    if db_item is None:
        return None

    vocab_dict = {col.name:getattr(db_item, col.name) for col in db_item.__table__.columns}

    # for simple related words, pass to Pydantic
    vocab_dict['synonyms'] = db_item.synonyms
    vocab_dict['antonyms'] = db_item.antonyms
    vocab_dict['related_phrases'] = db_item.related_phrases
    vocab_dict['related_idioms'] = db_item.related_idioms

    # for word_families
    grouped_families = {}

    for link in db_item.word_families:
        # root as key
        root_key = link.root if link.root else ""

        if root_key not in grouped_families:
            grouped_families[root_key] = {
                "root": link.root,
                "words": []
            }

        if link.related_word_id and link.related_word:
            grouped_families[root_key]["words"].append({
                "id": link.related_word.id,
                "word": link.related_word.word,
                "part_of_speech": link.related_word.part_of_speech,
            })

    vocab_dict['word_families'] = list(grouped_families.values())

    # validate and return use pydantic model
    return schemas.VocabularyResponse(**vocab_dict)

def create_vocabulary(db: Session, vocab_in: schemas.VocabularyCreate) -> schemas.VocabularyResponse:
    # Group break up from frontend convert to link and save to database

    # pick field which include relationship
    vocab_data = vocab_in.model_dump(exclude={
        "word_families", "synonyms", "antonyms", "related_phrases", "related_idioms"
    })

    db_item = models.VocabularyItem(**vocab_data)

    # word families
    if vocab_in.word_families:
        for group in vocab_in.word_families:
            if group.words:
                # fill words , with and without root
                for member in group.words:
                    new_link = models.WordFamilyLink(
                        related_word_id=member.id,
                        root=group.root
                    )
                    db_item.word_families.append(new_link)
            # fill root only
            elif group.root:
                new_link = models.WordFamilyLink(
                    related_word_id=None,
                    root=group.root
                )
                db_item.word_families.append(new_link)

    # other related words
    relation_keys = ["synonyms", "antonyms", "related_phrases", "related_idioms"]
    all_related_ids = set()

    # collect id from all field
    for key in relation_keys:
        items = getattr(vocab_in, key)
        if items:
            all_related_ids.update(item.id for item in items)

    # search 1 time, if there is related word
    if all_related_ids:
        fetched_items = db.query(models.VocabularyItem).filter(models.VocabularyItem.id.in_(all_related_ids)).all()
        item_map = {item.id: item for item in fetched_items}

        # give back to each related word fields
        for key in relation_keys:
            items = getattr(vocab_in, key)
            if items:
                setattr(db_item, key, [item_map[item.id] for item in items if item.id in item_map])

    # if vocab_in.synonyms:
    #     synonym_ids = [item.id for item in vocab_in.synonyms]
    #     db_item.synonyms = db.query(models.VocabularyItem).filter(models.VocabularyItem.id.in_(synonym_ids)).all()
    #
    # if vocab_in.antonyms:
    #     antonym_ids = [item.id for item in vocab_in.antonyms]
    #     db_item.antonyms = db.query(models.VocabularyItem).filter(models.VocabularyItem.id.in_(antonym_ids)).all()
    #
    # if vocab_in.related_phrases:
    #     phrase_ids = [item.id for item in vocab_in.related_phrases]
    #     db_item.related_phrases = db.query(models.VocabularyItem).filter(
    #         models.VocabularyItem.id.in_(phrase_ids)).all()
    #
    # if vocab_in.related_idioms:
    #     idiom_ids = [item.id for item in vocab_in.related_idioms]
    #     db_item.related_idioms = db.query(models.VocabularyItem).filter(models.VocabularyItem.id.in_(idiom_ids)).all()

    #  save in Database
    db.add(db_item)
    db.commit()

    return get_vocabulary(db, db_item.id)

def update_vocabulary(db: Session, vocab_id: int, vocab_in: schemas.VocabularyUpdate) -> schemas.VocabularyResponse:
    db_item = db.query(models.VocabularyItem).filter(models.VocabularyItem.id == vocab_id).first()
    if not db_item:
        return None

    update_data = vocab_in.model_dump(exclude_unset=True, exclude={
        "word_families", "synonyms", "antonyms", "related_phrases", "related_idioms"
    })
    for key, value in update_data.items():
        setattr(db_item, key, value)

    # word families
    if vocab_in.word_families is not None:
        # clear old record before update
        if hasattr(db_item, 'word_families') and db_item.id:
            db_item.word_families.clear()

        for group in vocab_in.word_families:
            if group.words:
                # fill words , with and without root
                for member in group.words:
                    new_link = models.WordFamilyLink(
                        related_word_id=member.id,
                        root=group.root
                    )
                    db_item.word_families.append(new_link)
            # fill root only
            elif group.root:
                new_link = models.WordFamilyLink(
                    related_word_id=None,
                    root=group.root
                )
                db_item.word_families.append(new_link)

    # other related word
    relation_keys = ["synonyms", "antonyms", "related_phrases", "related_idioms"]
    all_related_ids = set()

    # collect id from all field
    for key in relation_keys:
        items = getattr(vocab_in, key)
        if items is not None:
            all_related_ids.update(item.id for item in items)

    # search once, if there is related word
    item_map = {}
    if all_related_ids:
        fetched_items = db.query(models.VocabularyItem).filter(models.VocabularyItem.id.in_(all_related_ids)).all()
        item_map = {item.id: item for item in fetched_items}

        # give back to each related word fields
        # SQLAlchemy remove old data by auto
    for key in relation_keys:
        items = getattr(vocab_in, key)
        if items is not None:
            setattr(db_item, key, [item_map[item.id] for item in items if item.id in item_map])

    db.commit()

    return get_vocabulary(db, db_item.id)

def delete_vocabulary(db: Session, vocab_id: int) -> schemas.VocabularyResponse:
    db_item = db.query(models.VocabularyItem).filter(models.VocabularyItem.id == vocab_id).first()
    if not db_item:
        return None

    response_item = get_vocabulary(db, vocab_id)

    db.delete(db_item)
    db.commit()
    return response_item
