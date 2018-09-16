from pynamodb.attributes import BooleanAttribute, UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.models import Model


class IdeaModel(Model):
    class Meta:
        table_name = "ideas"
        host = "http://localhost:4569"

    ideaId = UnicodeAttribute(hash_key=True)
    content = UnicodeAttribute(null=True)
    title = UnicodeAttribute(null=True)
    userId = UnicodeAttribute(range_key=True)
    createdDate = UTCDateTimeAttribute(null=True)

class UserEmailIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 2
        write_capacity_units = 1
        projection = AllProjection()
    email = UnicodeAttribute(hash_key=True)


class UserModel(Model):
    class Meta:
        table_name = "users"
        host = "http://localhost:4569"

    userId = UnicodeAttribute(hash_key=True)
    email = UnicodeAttribute(null=True)
    # sortKey = UnicodeAttribute(range_key=True)
    createdDate = UTCDateTimeAttribute(null=True)
    firstLogin = BooleanAttribute(null=True)
    emailIndex = UserEmailIndex()
