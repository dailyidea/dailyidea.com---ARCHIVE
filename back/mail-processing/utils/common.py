SEND_BATCH_EMAIL_CHUNK_SIZE = 50


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


def progressive_chunks(lst, n):
    tmp_lst = list()
    while True:
        try:
            tmp_lst.append(next(lst))
        except StopIteration:
            if len(tmp_lst):
                yield tmp_lst
            break
        if len(tmp_lst) == n:
            yield tmp_lst
            tmp_lst = list()
