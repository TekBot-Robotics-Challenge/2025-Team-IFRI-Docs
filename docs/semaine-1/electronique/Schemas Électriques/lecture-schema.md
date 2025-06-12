
# Comprendre les Schémas Électroniques

Un guide pour lire et interpréter les schémas électroniques fournis.

## Symboles Courants
- **Résistance :** Zigzag ou rectangle.
- **Condensateur :** Deux lignes parallèles.
- **Diode :** Triangle pointant vers une barre.
- **Transistor :** Symbole à trois pattes (BJT, MOSFET).
- **Circuit Intégré (CI) :** Rectangle avec des pattes numérotées.

## Conventions
- **Alimentation :** VCC, VDD pour le positif ; GND pour la masse.
- **Flux du signal :** Généralement de gauche à droite, et de haut en bas.
- **Points de connexion :** Un point noir indique une jonction électrique. Des lignes qui se croisent sans point ne sont pas connectées.

## Exemple d'Analyse
Prenons un exemple simple : un circuit LED avec une résistance de limitation de courant.
\`\`\`
VCC ---[ R1 ]---|>|--- GND
           (LED)
\`\`\`
- VCC est la source de tension.
- R1 est la résistance.
- |>| est la LED.
- GND est la masse.

Analysez toujours les chemins de courant et les tensions attendues à différents points.
    