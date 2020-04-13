import bleach


def sanitize_idea_content(content):
    if not content or not len(content):
        return None
    return bleach.clean(content,
                        tags=['b', 'strong', 'p', 'br', 'a', 's', 'em', 'u', 'span',
                              'ol', 'ul', 'li',
                              'h1', 'h2', 'h3', 'h4',
                              'sub', 'sup',
                              'div', 'del', 'blockquote', 'pre',
                              'figure', 'figcaption',
                              'img', 'textarea', 'button'
                              ],
                        attributes={
                            'a': ['href', 'target', 'rel'],
                            'span': ['class', 'data-trix-cursor-target', 'data-trix-serialize',
                                     'data-trix-cursor-target', 'data-trix-serialize'],
                            'figure': ['contenteditable', 'class', 'data-trix-attachment', 'data-trix-content-type',
                                       'data-trix-id', 'data-trix-attributes', 'data-trix-mutable'],
                            'figcaption': ['class', ],
                            'textarea': ['class', 'placeholder', 'data-trix-mutable', 'tabindex', ],
                            'img': ['src', 'width', 'height', 'data-trix-store-key', 'data-trix-mutable'],
                            'button': ['type', 'class', 'title', 'data-trix-action', ]
                        }, strip_comments=False)


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
