import bleach


def sanitize_idea_content(content):
    if not content or not len(content):
        return None
    return bleach.clean(content,
                        tags=['b', 'strong', 'p', 'br', 'a', 's', 'em', 'u',
                              'ol', 'ul', 'li',
                              'h1', 'h2', 'h3', 'h4',
                              'sub', 'sup',
                              'div', 'del', 'blockquote', 'pre'],
                        attributes={'a': ['href', 'target']}, strip_comments=False)


def prepare_idea_tags_for_put_request(tags: list, idea_owner_id, idea_id):
    prepared_tags = [
        {'PutRequest':
            {'Item':
                {
                    'userId': {"S": idea_owner_id},
                    "ideaId": {"S": idea_id},
                    "tag": {"S": tag},
                    "tag_lowercase": {"S": tag.lower()},
                    'index': {"N": str(tags.index(tag))}
                }
            }
        }
        for tag in tags
    ]
    return prepared_tags


def prepare_idea_tags_for_delete_request(tags: list, idea_id):
    prepared_tags = [
        {'DeleteRequest':
            {'Key':
                {
                    "ideaId": {"S": idea_id},
                    "tag": {"S": tag},
                }
            }
        }
        for tag in tags
    ]
    return prepared_tags
