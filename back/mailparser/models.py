from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, BooleanAttribute


class IdeaModel(Model):
    class Meta:
        table_name = "ideas"
    ideaId = UnicodeAttribute(hash_key=True)
    content = UnicodeAttribute(range_key=True)
    title = UnicodeAttribute()
    userId = UnicodeAttribute()


class UserModel(Model):
    class Meta:
        table_name = "users"
    userId = UnicodeAttribute(hash_key=True)
    email = UnicodeAttribute()
    sortKey = UnicodeAttribute(range_key=True)
    createdDate = UnicodeAttribute()
    firstLogin = BooleanAttribute()
