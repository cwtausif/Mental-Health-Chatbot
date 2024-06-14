import os

folders = [
    'static',
    'templates'
]

files = [
    'static/scripts.js',
    'templates/index.html',
    'app.py',
    'requirements.txt'
]

for folder in folders:
    os.makedirs(folder, exist_ok=True)

for file in files:
    with open(file, 'w') as f:
        pass  # Create empty file

print("Folder structure created successfully!")
