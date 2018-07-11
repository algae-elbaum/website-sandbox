from .settings import MUSIC_FILETYPES

def is_music(fname):
    """Return whether a file is a music file based on its extension"""
    for ft in MUSIC_FILETYPES:
        if fname.endswith(ft):
            return True
    return False

