import io
import base64
from rembg import remove
from PIL import Image


def remove_it(file):
    infile = Image.open(file)
    infile.thumbnail((300, 200), Image.ANTIALIAS)
    newfile = remove(infile) # remove bg
    newfile.save("newfile-rembg.png")
    buf = io.BytesIO()
    newfile.save(buf, format='PNG')
    byte_im = buf.getvalue()
    return base64.b64encode(byte_im)