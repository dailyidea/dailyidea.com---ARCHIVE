import uuid

from utils.models import IdeaModel, UserModel

import mailparser
from flanker import mime
if __name__ == '__main__':
    idea_id = str(uuid.uuid4())
    userId = str(uuid.uuid4())
    idea = IdeaModel(idea_id, userId)
    print('idea id', idea_id, idea.ideaId)

    print('x')
# if __name__ == '__main__':
#     f = open('testmail').read()
#     parsed_email = mailparser.parse_from_string(f)
#     msg = mime.from_string(f)
#     print('x')
