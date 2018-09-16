from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, BooleanAttribute


class IdeaModel(Model):
    class Meta:
        table_name = "ideas"
        host = "http://localhost:4570"
    ideaId = UnicodeAttribute(hash_key=True)
    content = UnicodeAttribute()
    title = UnicodeAttribute()
    userId = UnicodeAttribute(range_key=True)


class UserModel(Model):
    class Meta:
        table_name = "users"
        host = "http://localhost:4570"
    userId = UnicodeAttribute(hash_key=True)
    email = UnicodeAttribute()
    # sortKey = UnicodeAttribute(range_key=True)
    createdDate = UnicodeAttribute()
    firstLogin = BooleanAttribute()
