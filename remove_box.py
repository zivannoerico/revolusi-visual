from PIL import Image

img_path = 'assets/panca_indra_sketch.png'
img = Image.open(img_path).convert('RGBA')
pixels = img.load()
width, height = img.size

# Erase a 150x150 box in the bottom right
for x in range(width - 150, width):
    for y in range(height - 150, height):
        pixels[x, y] = (0, 0, 0, 0)

img.save(img_path)
print('Box removed successfully.')
