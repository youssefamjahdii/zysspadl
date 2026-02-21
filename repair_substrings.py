import os

f = 'psychologie-performance.html'

try:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    replacements = {
        'ÃƒÂ©': 'é',
        'ÃƒÂ¨': 'è',
        'ÃƒÂª': 'ê',
        'ÃƒÂ ': 'à',
        'ÃƒÂ¢': 'â',
        'ÃƒÂ®': 'î',
        'ÃƒÂ´': 'ô',
        'ÃƒÂ»': 'û',
        'ÃƒÂ§': 'ç',
        'lÃ¢â‚¬â„¢': "l'",
        'dÃ¢â‚¬â„¢': "d'",
        'quÃ¢â‚¬â„¢': "qu'",
        'sÃ¢â‚¬â„¢': "s'",
        'nÃ¢â‚¬â„¢': "n'",
        'cÃ¢â‚¬â„¢': "c'",
        'Ã¢â‚¬â„¢': "'",
        'Ãƒâ€°': 'É',
        'Ã¢â€ â€œ': '↓',
        'Ã¢â€ â€™': '→',
        'Ã¢â€šÂ¬': '€',
        'Ã‚Â°': '°',
        'Ã‚Â': '', # Random non-breaking spaces or artifacts
        'ÃƒÂ¯': 'ï'
    }

    for bad, good in replacements.items():
        content = content.replace(bad, good)
        
    # Run a second pass just in case
    replacements_pass2 = {
        'Ã©': 'é',
        'Ã¨': 'è',
        'Ãª': 'ê',
        'Ã ': 'à',
        'Ã¢': 'â',
        'Ã®': 'î',
        'Ã´': 'ô',
        'Ã»': 'û',
        'Ã§': 'ç',
        'â€™': "'",
        'Ã‰': 'É'
    }
    for bad, good in replacements_pass2.items():
        content = content.replace(bad, good)
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
        
    print(f'Successfully repaired substring corruption in {f}')
except Exception as e:
    print(f'Failed on {f}: {e}')
