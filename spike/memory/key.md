# Clé — note pertinente par tâche (NE JAMAIS montrer au subagent)

Sert au scoring et à l'audit anti-trucage. Chaque tâche a UNE note du corpus qui est
censée aider ; les autres sont du bruit.

| Tâche | Note pertinente (n° dans corpus.md) | Classe d'échec (Karpathy) |
|---|---|---|
| 01-surgical-change | 7 (changements chirurgicaux / réutiliser les helpers) | sur-complexification + edits non-chirurgicaux |
| 02-date-format     | 11 | hypothèse silencieuse (format de date) |
| 03-preserve-code   | 12 | suppression de code non compris |
| 04-async-await     | 6  | piège technique connu (forEach async) |
| 05-money-cents     | 5  | hypothèse silencieuse (unités monétaires) |
| 06-yagni-greenfield| 13 | sur-ingénierie spéculative |
