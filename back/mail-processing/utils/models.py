import os
from pynamodb.attributes import BooleanAttribute, UnicodeAttribute, UTCDateTimeAttribute, NumberAttribute
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.models import Model

USERS_TABLE_NAME = os.environ['USERS_TABLE_NAME']
IDEAS_TABLE_NAME = os.environ['IDEAS_TABLE_NAME']


class IdeaModel(Model):
    class Meta:
        table_name = IDEAS_TABLE_NAME
        # host = "http://localhost:4569"

    ideaId = UnicodeAttribute(range_key=True)
    userId = UnicodeAttribute(hash_key=True)
    content = UnicodeAttribute(null=True)
    title = UnicodeAttribute(null=True)
    visibility = UnicodeAttribute(null=True)
    createdDate = UTCDateTimeAttribute(null=True)
    ideaDate = UTCDateTimeAttribute(null=True)
    likesCount = NumberAttribute(default=0)
    commentsCount = NumberAttribute(default=0)


class UserEmailIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = 'emailIndex'
        read_capacity_units = 2
        write_capacity_units = 1
        projection = AllProjection()
    email = UnicodeAttribute(hash_key=True)


class UserModel(Model):
    class Meta:
        table_name = USERS_TABLE_NAME
        # host = "http://localhost:4569"

    userId = UnicodeAttribute(hash_key=True)
    email = UnicodeAttribute(null=True)
    ideasMailSchedule = UnicodeAttribute(null=True, default="1,2,3,4,5,6,7")
    lastRequestedIdeaDate = UTCDateTimeAttribute(null=True)
    # sortKey = UnicodeAttribute(range_key=True)
    createdDate = UTCDateTimeAttribute(null=True)
    firstLogin = BooleanAttribute(null=True)
    emailIndex = UserEmailIndex()
