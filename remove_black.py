from PIL import Image
import os

img_path = 'assets/otak.png'
out_path = 'assets/otak_transparent.png'

if not os.path.exists(img_path):
    print('Image not found')
else:
    img = Image.open(img_path).convert('RGBA')
    data = img.getdata()
    new_data = []
    
    # We will measure the darkest pixel in the background
    # But let's just use a luminosity threshold. 
    # Anything very dark (lum < 20) becomes fully transparent.
    # Anything above that becomes partially or fully opaque.
    for item in data:
        r, g, b, a = item
        lum = (0.299*r + 0.587*g + 0.114*b)
        
        # If it's very dark (close to black background)
        if lum < 25:
            new_data.append((r, g, b, 0))
        else:
            # We scale alpha so the bright parts stay bright
            # For lum > 25, map 25->0 and 255->255
            alpha = min(255, int(((lum - 25) / 230.0) * 255 * 1.5))
            new_data.append((r, g, b, min(255, alpha)))
            
    img.putdata(new_data)
    img.save(out_path, 'PNG')
    print('Done')
