import os

files = ['contact.html', 'coach-partners.html', 'psychologie-performance.html', 'stage-padel.html']

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # 1. Fix massive typography clamp overlapping on mobile
        content = content.replace('clamp(8rem, 20vw, 25rem)', 'clamp(4.5rem, 15vw, 25rem)')
        
        # 2. Fix flex column min-widths causing horizontal scroll on 375px screens
        content = content.replace('min-width: 400px', 'min-width: 280px')
        content = content.replace('min-width: 350px', 'min-width: 280px')
        content = content.replace('min-width: 300px', 'min-width: 280px')
        
        # 3. Reduce absolute gap pixel sizes that break wrapping
        content = content.replace('gap: 80px;', 'gap: 40px;')
        content = content.replace('gap: 60px;', 'gap: 40px;')
        
        # 4. Reduce top padding on massive heros
        content = content.replace('padding: 250px 20px 150px;', 'padding: 180px 20px 100px;')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
            
        print(f"Responsive inline fixes applied to {f}")
    except Exception as e:
        print(f"Failed on {f}: {e}")
