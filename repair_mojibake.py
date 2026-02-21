import os

files = ['reviews.html', 'psychologie-performance.html', 'index.html', 'events.html', 'corporate.html', 'contact.html', 'coach-partners.html', 'actualite.html']

for f in files:
    try:
        # Read the currently mojibaked UTF-8 file
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Repair the double-encoding ( mojibake )
        # By encoding to cp1252 (to get back the raw utf-8 bytes)
        # And decoding back as true utf-8
        try:
            fixed_content = content.encode('cp1252').decode('utf-8')
            
            with open(f, 'w', encoding='utf-8') as file:
                file.write(fixed_content)
            print(f'Successfully repaired {f}')
        except Exception as repair_e:
            print(f'Repair failed (maybe not mojibaked?) for {f}: {repair_e}')
            
    except Exception as e:
        print(f'Failed on {f}: {e}')
