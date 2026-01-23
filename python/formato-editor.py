from browser import document, window
from browser import html
import os

import editor

# Ejemplos de código
examples = {
    "tercero": {
        "secuencias" : {
            "1" : "",
            "2" : "",
            "3" : "",
            "4" : ""
        },
        "condicionales" : {
            "1" : "",
            "2" : "",
            "3" : "",
            "4" : ""
        },
        "bucles" : {
            "1" : "",
            "2" : "",
            "3" : "",
            "4" : ""
        },
        "funciones" : {
            "1" : "",
            "2" : "",
            "3" : "",
            "4" : ""
        }
    },
    "cuarto": {
        "secuencias" : {
            "1" : "",
            "2" : "",
            "3" : "",
            "4" : ""
        },
        "condicionales" : {
            "1" : "",
            "2" : "",
            "3" : "",
            "4" : ""
        },
        "bucles" : {
            "1" : "",
            "2" : "",
            "3" : "",
            "4" : ""
        },
        "funciones" : {
            "1" : "",
            "2" : "",
            "3" : "",
            "4" : ""
        }
    }
}

# Cargamos los ficheros y ponemos su contenido en el diccionario
# No entiendo por qué os.path.isFile falla, parece que Brython no lo implementa bien
for curso in examples:
    for concepto in examples[curso]:
        for ejercicio in examples[curso][concepto]:
            fpath = f'ejercicios/{curso}/{concepto}/{concepto}{ejercicio}.py'
            with open(f'ejercicios/{curso}/{concepto}/{concepto}{ejercicio}.py', 'r') as file:
                examples[curso][concepto][ejercicio] = file.read()

with open('intro.py', 'r') as file:
    examples["default"] = file.read()

def run(ev):
    document['console'].value = ''
    editor.run(editor.editor.getValue())
    
def load_example(ev):
    curso = document['cursos'].value
    concepto = document['conceptos'].value
    ejercicio = document['ejercicios'].value
    if ejercicio != '0':
        editor.editor.setValue(examples[curso][concepto][ejercicio])
    else:
        editor.editor.setValue(examples["default"])
        
def load_default():
    editor.editor.setValue(examples["default"])

def change_theme(ev):
    theme = ev.target.value
    if theme:
        editor.editor.setTheme(f'ace/theme/{theme}')
    
document['run'].bind('click', run)
document['cursos'].bind('change', load_example)
document['conceptos'].bind('change', load_example)
document['ejercicios'].bind('change', load_example)
document['themes'].bind('change', change_theme)

editor.reset()
# Quiero que cargue el ejercicio base (3º, secuencia, ej1), 
# carga lo anterior si puede de todas formas
# load_example(0)