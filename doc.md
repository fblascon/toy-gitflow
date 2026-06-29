# Práctica Git & GitHub — toy-gitflow

## Escenario

Simulación de equipo de 2 desarrolladores:
- **fblascon** (tú)
- **opencode-bot** (yo)

Proyecto: landing page HTML/CSS/JS básico.

---

## Ejercicio 1 — PR básico

**Objetivo:** Crear una feature branch, añadir cambios, PR, merge.

**Rama:** `feature/contact`

**Cambios:**
- `src/index.html` — añadida sección `<section id="contact">` con formulario
- `src/css/style.css` — estilos del formulario (flex column, inputs, botón)

**Pasos:**

```bash
git checkout -b feature/contact
# editar archivos
git add -A
git commit -m "feat: add contact section"
git push -u origin feature/contact
```

**PR creado en la rama nueva, en GitHub:**
- Title: `feat: add contact section`
- Base: `main` ← compare: `feature/contact`
- Code review → Approved ✅
- Merge Pull Request (botón en GitHub)
- Delete branch (opcional)

**Post-merge local:**

```bash
git checkout main
git pull origin main
git branch -d feature/contact
git push origin --delete feature/contact   # si no se borró desde GitHub
```

---

## Branch Protection Rule

Configurada en GitHub repo → Settings → Branches → Add classic branch protection rule.

**Regla aplicada a `main`:**

- ✅ Require a pull request before merging
  - Require approvals: `1`
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Do not allow bypassing the above settings

**Efecto:** Ahora cada PR necesita al menos 1 approval de otro miembro del equipo antes de mergear. El autor del PR no puede aprobarlo él mismo.

---

## Ejercicio 2 — [próximo]

---

## Notas

- `git branch -d <rama>` solo borra si está mergeada. Usar `-D` para forzar.
- `git push origin --delete <rama>` borra la rama remota.
