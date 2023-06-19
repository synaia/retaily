from io import BytesIO
import base64
from rembg import remove
from PIL import Image


def image_to_base64(file_name):
    if isinstance(file_name, str):
        try:
            file_name = Image.open(f'../uploaded/{file_name}.png')
        except Exception as ex:
            file_name = Image.open(f'./server/uploaded/{file_name}.png')

    buf = BytesIO()
    file_name.save(buf, format='PNG')
    byte_im = buf.getvalue()
    return base64.b64encode(byte_im).decode('ascii')


def remove_it(file, file_name):
    infile = Image.open(file)
    infile.thumbnail((infile.size[0] // 4, infile.size[1] // 4), Image.ANTIALIAS)
    newfile = remove(infile) # remove bg
    try:
        newfile.save(f'../uploaded/{file_name}.png')
    except Exception as ex:
        newfile.save(f'./server/uploaded/{file_name}.png')

    return image_to_base64(newfile)
