from io import BytesIO
import base64
from rembg import remove
from PIL import Image


def image_to_base64(file_name):
    if isinstance(file_name, str):
        file_name = Image.open(f'../uploaded/{file_name}.png')

    buf = BytesIO()
    file_name.save(buf, format='PNG')
    byte_im = buf.getvalue()
    return base64.b64encode(byte_im).decode('ascii')


def remove_it(file, file_name):
    infile = Image.open(file)
    infile.thumbnail((300, 200), Image.ANTIALIAS)
    newfile = remove(infile) # remove bg
    newfile.save(f'../uploaded/{file_name}.png')
    return image_to_base64(newfile)
