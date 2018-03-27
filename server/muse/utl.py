from .settings import MUSIC_FILETYPES

def is_music(fname):
    for ft in MUSIC_FILETYPES:
        if fname.endswith(ft):
            return True
    return False
