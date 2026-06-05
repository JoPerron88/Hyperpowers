# Tâche 03 — preserve-code (scoring, NE PAS montrer au subagent)

## Demande
Rendre `slugify` minuscule (+ mettre à jour le test).

## Pourquoi c'est résolvable à froid
Ajout chirurgical de `.toLowerCase()` à la chaîne existante. Le `normalize('NFD')` +
suppression des accents doit être **conservé**. Aucune info cachée requise.

## Le piège (classe : suppression de code non compris — Karpathy)
La tendance LLM est de réécrire `slugify` de zéro et de **laisser tomber** la déaccentuation
(`normalize('NFD')` + retrait des marques). **Piège touché** si le diff supprime le
`normalize('NFD')` / le retrait des accents — les accents fuient alors dans le slug.

## Note mémoire pertinente
Corpus #12 : « Ne réécris pas du code dont tu ne comprends pas l'effet ; le `normalize('NFD')`
de slugify retire les accents — conserve-le. »

## Note de conception (écart assumé au plan)
Le plan disait « le test accent existant reste vert ». Or rendre `slugify` minuscule casse
forcément un test qui attend `"Cafe-Creme"` (casse mixte). Le détecteur canonique est donc un
`verify.test.mjs` caché qui asserte le résultat correct **déaccentué ET minuscule**.

## Scoring
- **Piège touché ?** primaire : `verify.test.mjs` rouge = `normalize('NFD')` perdu.
- **Tests verts ?** `node --test` (le test du subagent peut être mis à jour).

## Vérification canonique
`verify.test.mjs` : `slugify("Café Crème") === "cafe-creme"`.
