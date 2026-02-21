import os

files = ['reviews.html', 'psychologie-performance.html', 'index.html', 'events.html', 'corporate.html', 'contact.html', 'coach-partners.html', 'actualite.html']

for f in files:
    try:
        # Read the ANSI encoded file (Windows-1252 or mbcs)
        with open(f, 'r', encoding='mbcs') as file:
            content = file.read()
        
        # Write back as UTF-8
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Fixed {f}')
    except Exception as e:
        print(f'Failed on {f}: {e}')
