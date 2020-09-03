import os
from datetime import datetime
from pynamodb.attributes import Attribute, MapAttribute, BooleanAttribute, UnicodeAttribute, UTCDateTimeAttribute, NumberAttribute
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.models import Model

USERS_TABLE_NAME = os.getenv('USERS_TABLE_NAME', 'dailyidea-users-dev')
IDEAS_TABLE_NAME = os.getenv('IDEAS_TABLE_NAME', 'dailyidea-ideas-dev')
COMMENTS_TABLE_NAME = os.getenv('COMMENTS_TABLE_NAME', 'dailyidea-comments-dev')
LIKES_TABLE_NAME = os.getenv('LIKES_TABLE_NAME', 'dailyidea-likes-dev')

def one(some_query):
    result = next(some_query, None)
    extra = next(some_query, None)
    if extra is not None:  # too many
        return None
    # first or None
    return result

class BaseModel(Model):
    def to_json(self, indent=2):
        return json.dumps(self.to_dict(), indent=indent)

    def to_dict(self):
        ret_dict = {}
        for name, attr in self.attribute_values.items():
            ret_dict[name] = self._attr2obj(attr)

        return ret_dict

    def _attr2obj(self, attr):
        # compare with list class. It is not ListAttribute.
        if isinstance(attr, list):
            _list = []
            for l in attr:
                _list.append(self._attr2obj(l))
            return _list
        elif isinstance(attr, MapAttribute):
            _dict = {}
            for k, v in attr.attribute_values.items():
                _dict[k] = self._attr2obj(v)
            return _dict
        elif isinstance(attr, datetime):
            return attr.isoformat()
        else:
            return attr

class UsersIdeasByDateIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = 'myIdeasByDate'
        projection = AllProjection()
        write_capacity_units = 100
        read_capacity_units = 100
    userId = UnicodeAttribute(hash_key=True)
    createdDate = UTCDateTimeAttribute(range_key=True)

class IdeasById(GlobalSecondaryIndex):
    class Meta:
        index_name = 'ideasById'
        projection = AllProjection()
        write_capacity_units = 100
        read_capacity_units = 100
    ideaId = UnicodeAttribute(hash_key=True)


class IdeaModel(BaseModel):
    class Meta:
        table_name = IDEAS_TABLE_NAME
        write_capacity_units = 100
        read_capacity_units = 100
        # host = "http://localhost:4569"

    ideaId = UnicodeAttribute(range_key=True)
    sortKey = UnicodeAttribute(default='idea')
    userId = UnicodeAttribute(hash_key=True)
    content = UnicodeAttribute(null=True)
    title = UnicodeAttribute(null=True)
    visibility = UnicodeAttribute(null=True)
    authorName = UnicodeAttribute(null=True)
    authorSlug = UnicodeAttribute(null=True)
    authorAvatar = UnicodeAttribute(null=True)
    createdDate = UTCDateTimeAttribute(null=True)
    ideaDate = UTCDateTimeAttribute(null=True)
    likesCount = NumberAttribute(default=0)
    commentsCount = NumberAttribute(default=0)

    usersIdeasByDateIndex = UsersIdeasByDateIndex()
    ideasByIdIndex = IdeasById()


class UserEmailIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = 'emailIndex'
        projection = AllProjection()
        write_capacity_units = 100
        read_capacity_units = 100
    email = UnicodeAttribute(hash_key=True)


class UserModel(BaseModel):
    class Meta:
        table_name = USERS_TABLE_NAME
        write_capacity_units = 100
        read_capacity_units = 100
        # host = "http://localhost:4569"

    userId = UnicodeAttribute(hash_key=True)
    email = UnicodeAttribute(null=True)
    name = UnicodeAttribute(null=True)
    slug = UnicodeAttribute(null=True)
    avatar = UnicodeAttribute(null=True)
    ideasMailSchedule = UnicodeAttribute(null=True, default="1,2,3,4,5,6,7")
    lastRequestedIdeaDate = UTCDateTimeAttribute(null=True)
    # sortKey = UnicodeAttribute(range_key=True)
    createdDate = UTCDateTimeAttribute(null=True)
    firstLogin = BooleanAttribute(null=True)

    ideaReminders = BooleanAttribute(null=True)
    hotStreaks = BooleanAttribute(null=True)
    dailyDigests = BooleanAttribute(null=True)
    weeklyDigests = BooleanAttribute(null=True)
    ideaActivity = BooleanAttribute(null=True)
    snoozeEmails = UTCDateTimeAttribute(null=True)
    unsubscribedAt = UTCDateTimeAttribute(null=True)
    emailToken = UnicodeAttribute(null=True)

    followersCount = NumberAttribute(default=0)
    ideasCreated = NumberAttribute(default=0)
    followeesCount = NumberAttribute(default=0)

    emailIndex = UserEmailIndex()


class CommentModel(BaseModel):
    class Meta:
        table_name = COMMENTS_TABLE_NAME
        write_capacity_units = 100
        read_capacity_units = 100
        # host = "http://localhost:4569"

    ideaId = UnicodeAttribute(hash_key=True)
    commentId = UnicodeAttribute(hash_key=True)
    createdDate = UTCDateTimeAttribute(null=True)
    body = UnicodeAttribute(null=True)
    ideaOwnerId = UnicodeAttribute(null=True)
    userId = UnicodeAttribute(null=True)
    userName = UnicodeAttribute(null=True)
    userSlug = UnicodeAttribute(null=True)

class LikeModel(BaseModel):
    class Meta:
        table_name = LIKES_TABLE_NAME
        write_capacity_units = 100
        read_capacity_units = 100
        # host = "http://localhost:4569"

    ideaId = UnicodeAttribute(hash_key=True)
    userId = UnicodeAttribute(hash_key=True)
    ideaOwnerId = UnicodeAttribute(null=True)
    likedTime = UTCDateTimeAttribute(null=True)

