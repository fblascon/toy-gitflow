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

## Ejercicio 2 — Conflicto

**Objetivo:** Dos devs modifican la misma línea → conflicto al mergear.

### Ramas creadas

| Rama | Dev | Cambios |
|------|-----|---------|
| `feature/navbar` | fblascon | `<p>Navegación principal</p>` + `<nav>` |
| `feature/hero` | opencode-bot | `<p>Héroe principal</p>` + `<div id="hero-banner">` |

### Secuencia

1. `feature/navbar` mergeada a `main` sin conflicto (PR #2)
2. `feature/hero` → PR #3 — conflicto al tocar misma línea del `<header>`

### Resolución

Se usó el editor web de GitHub ("Resolve conflicts") para combinar ambos cambios.

### Resultado

PR #3 mergeado exitosamente ✅

---

## Ejercicio 4 — Release Branch (v1.0.0)

**Objetivo:** Preparar una release oficial con bump de versión, CHANGELOG y tag.

**Rama:** `release/v1.0.0`

### Pasos ejecutados

```bash
git checkout main && git pull origin main
git checkout -b release/v1.0.0
# crear CHANGELOG.md
git add -A && git commit -m "chore: prepare release v1.0.0"
git push -u origin release/v1.0.0
# PR → Approve → Merge
git checkout main && git pull origin main
git tag v1.0.0 && git push origin v1.0.0
git branch -d release/v1.0.0 && git push origin --delete release/v1.0.0
```

---

## Ejercicio 3 — Hotfix (v1.0.1)

**Objetivo:** Parche urgente para formulario de contacto.

**Rama:** `hotfix/contact-form`

### Pasos ejecutados

```bash
git checkout main && git pull origin main
git checkout -b hotfix/contact-form
# añadir action, method, name, required al form
git add -A && git commit -m "hotfix: add missing form attributes"
git push -u origin hotfix/contact-form
# PR → Approve → Merge
git checkout main && git pull origin main
git tag v1.0.1 && git push origin v1.0.1
git branch -d hotfix/contact-form && git push origin --delete hotfix/contact-form
```

---

## Pendientes

- **Ejercicio 5 — Revert** (`feature/buggy-widget` + `hotfix/revert-buggy`) — en progreso
- **Ejercicio 6 — Cherry-pick** (`fix/seo-description` + `feature/analytics` + `fix/footer-text`)
- **Squash & Merge**
- **Rebase interactivo**
- **GitHub Actions**

---

## Notas

- `git branch -d <rama>` solo borra si está mergeada. Usar `-D` para forzar.
- `git push origin --delete <rama>` borra la rama remota.
