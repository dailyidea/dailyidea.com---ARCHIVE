import os
from pynamodb.attributes import BooleanAttribute, UnicodeAttribute, UTCDateTimeAttribute, NumberAttribute
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.models import Model

USERS_TABLE_NAME = os.environ['USERS_TABLE_NAME']
IDEAS_TABLE_NAME = os.environ['IDEAS_TABLE_NAME']


class UsersIdeasByDateIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = 'myIdeasByDate'
        projection = AllProjection()
        write_capacity_units = 100
        read_capacity_units = 100
    userId = UnicodeAttribute(hash_key=True)
    createdDate = UTCDateTimeAttribute(range_key=True)


class IdeaModel(Model):
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


class UserEmailIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = 'emailIndex'
        projection = AllProjection()
        write_capacity_units = 100
        read_capacity_units = 100
    email = UnicodeAttribute(hash_key=True)


class UserModel(Model):
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
    snoozeEmails = UTCDateTimeAttribute(null=True)
    emailToken = UnicodeAttribute(null=True)

    followersCount = NumberAttribute(default=0)
    ideasCreated = NumberAttribute(default=0)
    followeesCount = NumberAttribute(default=0)

    emailIndex = UserEmailIndex()
