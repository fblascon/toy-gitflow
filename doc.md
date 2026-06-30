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

Se usó el editor web de GitHub ("Resolve conflicts") para combinar ambos cambios:

```html
<header>
  <h1>Team Toy</h1>
  <p>Navegación principal</p>
</header>
<nav>
  <a href="#about">Sobre</a>
  <a href="#members">Miembros</a>
  <a href="#contact">Contacto</a>
</nav>
<div id="hero-banner">
  <p>Bienvenido a nuestro proyecto de práctica</p>
</div>
```

### Resultado

PR #3 mergeado exitosamente ✅

```bash
git checkout main && git pull origin main
git branch -d feature/hero
git push origin --delete feature/hero
```

---

## Ejercicio 3 — Hotfix

**Objetivo:** Simular un bug crítico en producción que requiere parche urgente.

**Escenario:** Se detecta que el formulario de contacto no puede enviar datos porque:
- Falta `action` y `method` en `<form>` → sin `action` el navegador no sabe a dónde enviar los datos
- Los inputs no tienen `name` → sin `name` el servidor no recibe los campos
- Falta `required` → el usuario puede enviar el formulario vacío sin validación

**Rama:** `hotfix/contact-form`

**Cambios en `src/index.html`:**

```html
<form id="contact-form" action="#" method="POST">
  <input type="text" name="name" placeholder="Nombre" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Mensaje" required></textarea>
  <button type="submit">Enviar</button>
</form>
```

### ¿Por qué hotfix y no feature?

| Aspecto | Feature branch | Hotfix branch |
|---------|---------------|---------------|
| Origen | `main` | `main` |
| Destino | `main` vía PR | `main` vía PR urgente |
| Contenido | Nueva funcionalidad | Parche crítico |
| Revisión | Normal (1 approval) | Express (misma regla, pero prioritaria) |
| Versionado | Minor / Major bump | **Patch bump** (v1.0.0 → v1.0.1) |

### Tags y versionado semántico

Un **tag** es un alias inmutable que apunta a un commit concreto. Sirve para marcar versiones en el historial.

**Semantic Versioning (SemVer):** `MAJOR.MINOR.PATCH`

| Versión | Cuándo se incrementa | Ejemplo |
|---------|---------------------|---------|
| MAJOR | Cambio incompatible (breaking) | v1.0.0 → v2.0.0 |
| MINOR | Nueva funcionalidad (backwards-compatible) | v1.0.0 → v1.1.0 |
| PATCH | Bug fix (backwards-compatible) | v1.0.0 → v1.0.1 |

**Comandos de tags:**

```bash
git tag v1.0.1              # crea tag local
git push origin v1.0.1      # sube tag a GitHub
git tag -d v1.0.1           # borra tag local
git push origin --delete v1.0.1  # borra tag remoto
```

En GitHub, desde un tag puedes crear un **Release** con notas de versión y adjuntos (binarios, changelog, etc).

### Pasos ejecutados

```bash
git checkout main
git pull origin main
git checkout -b hotfix/contact-form
# editar src/index.html
git add -A
git commit -m "hotfix: add missing form attributes (action, method, name, required)"
git push -u origin hotfix/contact-form
# PR en GitHub → Approved → Merge
git checkout main && git pull origin main
git tag v1.0.1
git push origin v1.0.1
git branch -d hotfix/contact-form
git push origin --delete hotfix/contact-form
```

---

## Ejercicio 4 — Release Branch

**Objetivo:** Preparar una release oficial con bump de versión, CHANGELOG y tag.

**Escenario:** El equipo ha acumulado varios features en `main` (contacto, navbar, hero) y toca preparar una release `v1.0.0` estable.

**Rama:** `release/v1.0.0`

---

### ¿Qué es una release branch?

Cuando el equipo termina un conjunto de features y toca publicar, se crea una `release/<version>` desde `main`. En esta rama **solo** se hacen ajustes menores de cara a la publicación:

- Bump de versión
- CHANGELOG / release notes
- Bug fixes menores (no features nuevas)

Una vez aprobada, se mergea a `main` y se marca con un tag. Así queda trazabilidad de qué código corresponde a qué versión.

### ¿Por qué necesito hacer `git pull` si ya está mergeado en GitHub?

El merge se hizo en GitHub (web), no en tu máquina. Tu repositorio local y el remoto están **desincronizados**:

```
Local (antes del pull):   A---B---C (main)
Remote (GitHub):          A---B---C---D (main, con merge commit)
```

- `git pull origin main` descarga el commit `D` a tu local.
- `git tag v1.0.0` crea un alias apuntando al commit `D` en tu local.
- `git push origin v1.0.0` sube ese tag a GitHub.

Sin este paso, el tag solo existiría en tu máquina y nadie más lo vería.

### ¿Qué diferencia hay entre tag y release?

| Concepto | Qué es | Dónde vive |
|----------|--------|-----------|
| **Tag** | alias inmutable a un commit | Git (local + remoto) |
| **Release** | tag + notas de versión + assets | GitHub (UI web) |

Un tag es solo un marcador en Git. Una release es la interfaz de GitHub alrededor de ese tag: puedes añadir changelog, adjuntar binarios, y notificar a los usuarios.

---

### Tabla comparativa de ramas

| Aspecto | Feature | Hotfix | Release |
|---------|---------|--------|---------|
| Origen | `main` | `main` | `main` |
| Propósito | Nueva funcionalidad | Parche crítico | Preparar versión |
| Versionado | Minor bump | Patch bump | Major/Minor bump |
| Contenido | Código nuevo | Bug fix | Changelog + versión |
| Post-merge | Nada | Tag patch | Tag release |

---

### Cambios realizados

1. **`CHANGELOG.md`** (nuevo) — documento que registra todos los cambios agrupados por versión. Estándar en cualquier proyecto open-source.
2. El resto del código no se tocó: la release branch solo añade metadata de la versión.

### Flujo completo

```bash
# 1. Crear release branch desde main
git checkout main && git pull origin main
git checkout -b release/v1.0.0

# 2. Crear CHANGELOG.md con los cambios de esta versión
#    (ver contenido más abajo)

# 3. Commit y push
git add -A
git commit -m "chore: prepare release v1.0.0"
git push -u origin release/v1.0.0

# 4. PR en GitHub: release/v1.0.0 → main
#    Title: "release v1.0.0"
#    Review → Approved → Merge

# 5. Sincronizar local y taguear
git checkout main && git pull origin main   # trae el merge commit
git tag v1.0.0                               # marca la versión
git push origin v1.0.0                       # publica el tag

# 6. Limpieza
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

**CHANGELOG.md creado:**

```markdown
# Changelog

## v1.0.0 (2026-06-30)

### Added
- Sección de contacto con formulario
- Barra de navegación con enlaces
- Banner de héroe con mensaje de bienvenida
- Lista dinámica de miembros del equipo

### Fixed
- Atributos faltantes en formulario de contacto (action, method, name, required)
```

### Publicar release en GitHub

1. Ir a GitHub → repo → **Releases** → **Create a new release**
2. Elegir tag: `v1.0.0`
3. Title: `v1.0.0`
4. Description (release notes): copiar contenido del CHANGELOG
5. **Publish release**

Esto genera una página pública con las notas de la versión, visible para el equipo y usuarios.

---

## Ejercicio 5 — Revert (deshacer un merge)

**Objetivo:** Simular un merge que introduce un bug crítico en producción y deshacerlo con `git revert`.

**Escenario:** Un compañero mergea una feature que rompe la página (el CSS oculta todo el contenido). Hay que deshacer el cambio rápido sin perder el historial.

---

### ¿Por qué `revert` y no `reset`?

| Comando | Efecto | Cuándo usarlo |
|---------|--------|---------------|
| `git reset --hard <commit>` | Borra commits del historial | Solo en ramas **locales** sin compartir |
| `git revert <commit>` | Crea un nuevo commit que deshace los cambios | En ramas **compartidas** como `main` |

`reset` reescribe la historia (peligroso si otros ya tienen ese commit). `revert` es seguro: añade un commit nuevo que invierte los cambios, manteniendo el registro de qué pasó.

### Revertir un merge commit

Cuando un merge tiene 2 padres (main + feature), hay que decirle a git qué lado mantener:

```
Antes del merge:   A---B---C (main)
                        \---D (feature/x)
Merge commit:       A---B---C---E (main, merge de feature/x)
                                |\
                                D 
Revert (-m 1):      A---B---C---E---~E (main, deshecho)
```

`git revert -m 1 <merge-commit>` significa:
- `-m 1` → "quédate con el primer padre (main)" → descarta los cambios de la feature

---

### Ramas creadas

| Rama | Contenido | Acción |
|------|-----------|--------|
| `feature/buggy-widget` | Añade `body { display: none; }` en CSS | Merge a main (bug!) |
| `hotfix/revert-buggy` | Revierte el merge anterior | Restaura la página |

### Pasos

#### Fase 1 — Crear el bug

```bash
git checkout main && git pull origin main
git checkout -b feature/buggy-widget
```

Añadir al final de `src/css/style.css`:

```css
/* 🔴 BUG: esto oculta toda la página */
body {
  display: none !important;
}
```

```bash
git add -A && git commit -m "feat: add widget section"
git push -u origin feature/buggy-widget
```

**PR en GitHub:** Title `feat: add widget section`, base `main` ← `feature/buggy-widget`
→ Approve → Merge

Después del merge, actualiza local:

```bash
git checkout main && git pull origin main
```

#### Fase 2 — Revertir el bug

```bash
git checkout -b hotfix/revert-buggy
```

Buscar el hash del merge commit:

```bash
git log --oneline -5
```

Sale algo como:

```
a1b2c3d (HEAD -> main) Merge pull request #5 from fblascon/feature/buggy-widget
e4f5g6h chore: prepare release v1.0.0
...
```

Revertir usando el hash del merge commit:

```bash
git revert -m 1 a1b2c3d -m "hotfix: revert buggy widget merge"
```

Esto crea un nuevo commit que deshace todo el diff de `feature/buggy-widget`, dejando `main` como estaba antes del merge.

```bash
git push -u origin hotfix/revert-buggy
```

**PR en GitHub:** Title `hotfix: revert buggy widget`, base `main` ← `hotfix/revert-buggy`
→ Approve → Merge

#### Fase 3 — Limpieza

```bash
git checkout main && git pull origin main
git branch -d feature/buggy-widget
git branch -d hotfix/revert-buggy
git push origin --delete feature/buggy-widget
git push origin --delete hotfix/revert-buggy
```

---

### Verificación

Abre `src/css/style.css` y confirma que el `display: none` ya no está. El historial de git muestra:

```
a1b2c3d Merge feature/buggy-widget (bug)
f6g7h8i Revert "feat: add widget section" (fix)
```

El commit del bug **no se borró** — quedó registrado, pero su efecto está deshecho.

---

## Notas

- `git branch -d <rama>` solo borra si está mergeada. Usar `-D` para forzar.
- `git push origin --delete <rama>` borra la rama remota.
- `git tag -a v1.0.0 -m "mensaje"` crea un tag **anotado** (con metadata). Preferible al lightweight.
- GitHub no permite aprobar tu propio PR con branch protection activa.
- `git revert -m 1` es específico para merge commits (2 padres). Para commits normales, basta `git revert <hash>`.
- Si más adelante quieres mergear de nuevo la feature revertida, primero hay que revertir el revert (git no permite mergear cambios que ya están en el historial).
