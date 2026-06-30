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

### ¿Qué es una release branch?

En Git Flow clásico, una `release/<version>` se crea desde `main` (o `develop`) cuando se acerca una publicación. En ella **no se añaden features nuevos**, solo:
- Bump de versión en archivos
- Ajustes de documentación
- Bug fixes menores
- CHANGELOG

Una vez lista, se mergea a `main` **y se taguea**.

### ¿Por qué necesito hacer `git pull` si ya está mergeado en GitHub?

El merge se hizo en GitHub (web), no en tu máquina. Tu local y el remoto están desincronizados:

```
Local (antes del pull):   A---B---C (main)
Remote (GitHub):          A---B---C---D (main, con merge commit)
```

- `git pull origin main` descarga el commit `D` a tu local.
- `git tag v1.0.0` crea un alias apuntando al commit `D`.
- `git push origin v1.0.0` sube ese tag a GitHub.

### Diferencia entre tag y release

| Concepto | Qué es | Dónde vive |
|----------|--------|-----------|
| **Tag** | alias inmutable a un commit | Git (local + remoto) |
| **Release** | tag + notas de versión + assets | GitHub (UI web) |

Un tag es solo un marcador en Git. Una release es la interfaz de GitHub alrededor de ese tag: puedes añadir changelog, adjuntar binarios, y notificar a los usuarios.

### Tabla comparativa de ramas

| Aspecto | Feature | Hotfix | Release |
|---------|---------|--------|---------|
| Origen | `main` | `main` | `main` |
| Propósito | Nueva funcionalidad | Parche crítico | Preparar versión |
| Versionado | Minor bump | Patch bump | Major/Minor bump |
| Contenido | Código nuevo | Bug fix | Changelog + versión |
| Post-merge | Nada | Tag patch | Tag release |

### Cambios realizados

1. **`CHANGELOG.md`** (nuevo) — documento que registra todos los cambios agrupados por versión. Estándar en cualquier proyecto.

### Pasos

```bash
# 1. Crear release branch desde main
git checkout main && git pull origin main
git checkout -b release/v1.0.0

# 2. Crear CHANGELOG.md
#    (ver contenido más abajo)

# 3. Commit y push
git add -A
git commit -m "chore: prepare release v1.0.0"
git push -u origin release/v1.0.0

# 4. PR en GitHub: release/v1.0.0 → main
#    Title: "release v1.0.0"
#    Review → Approved → Merge

# 5. Sincronizar local y taguear
git checkout main && git pull origin main
git tag v1.0.0
git push origin v1.0.0

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

**Publicar release en GitHub:**
1. GitHub → repo → **Releases** → **Create a new release**
2. Elegir tag: `v1.0.0`
3. Title: `v1.0.0`
4. Description: pegar contenido del CHANGELOG
5. **Publish release**

---

## Ejercicio 5 — Revert (deshacer un merge)

**Objetivo:** Simular un merge que introduce un bug crítico en producción y deshacerlo con `git revert`.

**Escenario:** Se mergea una feature que rompe la página (CSS oculta todo). Hay que deshacerlo rápido sin borrar historial.

---

### ¿Por qué `revert` y no `reset`?

| Comando | Efecto | Cuándo usarlo |
|---------|--------|---------------|
| `git reset --hard <commit>` | Borra commits del historial | Solo en ramas **locales** sin compartir |
| `git revert <commit>` | Crea un nuevo commit que deshace los cambios | En ramas **compartidas** como `main` |

`reset` reescribe la historia (peligroso si otros ya tienen ese commit). `revert` es seguro: añade un commit nuevo que invierte los cambios, manteniendo el registro.

### Revertir un merge commit

Cuando un merge tiene 2 padres (main + feature), hay que decirle a git qué lado mantener:

```
A (main antes) --- M (merge commit) --- R (revert commit)
                    |\
                    B (feature)
```

`git revert -m 1 M` significa:
- `-m 1` → "quédate con el primer padre (main)" → descarta los cambios de la feature
- El commit `R` contiene el mismo código que `A`, pero el historial conserva `M`

### Ramas creadas

| Rama | Contenido | Acción |
|------|-----------|--------|
| `feature/buggy-widget` | Añade `body { display: none !important; }` en CSS | Merge a main (bug!) |
| `hotfix/revert-buggy` | Revierte el merge anterior | Restaura la página |

### Pasos ejecutados

```bash
# Fase 1 — Crear el bug
git checkout main && git pull origin main
git checkout -b feature/buggy-widget
# añadir body { display: none !important; } a src/css/style.css
git add -A && git commit -m "feat: add widget section"
git push -u origin feature/buggy-widget
# PR → Approve → Merge

# Fase 2 — Revertir
git checkout main && git pull origin main
git log --oneline -5            # identificar hash del merge commit
git checkout -b hotfix/revert-buggy
git revert -m 1 <hash> --no-edit
git push -u origin hotfix/revert-buggy
# PR → Approve → Merge

# Fase 3 — Limpieza
git checkout main && git pull origin main
git branch -d feature/buggy-widget hotfix/revert-buggy
git push origin --delete feature/buggy-widget hotfix/revert-buggy
```

### Resultado ✅

- El historial de `main` muestra el merge del bug **y** el revert.
- El código final es el mismo que antes del merge.
- Si en el futuro se quisiera reintroducir esa feature, habría que revertir el revert primero.

---

## Ejercicio 6 — Cherry-pick

**Objetivo:** Llevar un commit específico de una rama a otra sin mergear todo el historial.

**Escenario:** Se mergeó un fix a `main` (un meta description para SEO), pero la rama `feature/analytics` se creó antes de ese fix. En vez de mergear `main` entera (que traería otros cambios), hacemos cherry-pick del fix.

---

### ¿Qué es cherry-pick?

`git cherry-pick <hash>` toma **un commit específico** de cualquier rama y lo aplica como un commit nuevo en la rama actual. Es como "copiar y pegar" un cambio concreto.

### Diagrama

```
main:        A---B---C (fix SEO)
                    \
feature/analytics:   D---E (sin el fix)
                        \
cherry-pick:             E' (copia de C, mismo cambio)
```

El commit `C` se copia como `E'` en la feature. `A`, `B`, `D`, `E` no se ven afectados.

---

### Pasos

#### 1. Crear un fix en `main`

```bash
git checkout main && git pull origin main
git checkout -b fix/seo-description
```

Añadir en `<head>` de `src/index.html`:

```html
<meta name="description" content="Landing page del equipo Team Toy" />
```

```bash
git add -A && git commit -m "fix: add meta description for SEO"
git push -u origin fix/seo-description
```

PR: base `main` ← `fix/seo-description` → Approve → Merge

#### 2. Volver a main y guardar el hash

```bash
git checkout main && git pull origin main
git log --oneline -3
```

Anota el hash del commit `fix: add meta description for SEO` (será algo como `a1b2c3d`).

#### 3. Crear feature branch desde el commit anterior

```bash
git checkout -b feature/analytics
```

Añadir al final de `<body>` en `src/index.html`:

```html
<!-- Google Analytics placeholder -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
```

```bash
git add -A && git commit -m "feat: add analytics snippet"
git push -u origin feature/analytics
```

#### 4. Cherry-pick el fix SEO

```bash
git cherry-pick <hash-del-fix-seo>
```

Si no hay conflictos, se aplica automáticamente. Verifica:

```bash
git log --oneline -5
```

Verás el commit cherry-pickeado al final. Push:

```bash
git push origin feature/analytics
```

#### 5. PR y merge (opcional)

PR: base `main` ← `feature/analytics` → Approve → Merge

Limpieza:

```bash
git checkout main && git pull origin main
git branch -d fix/seo-description feature/analytics
git push origin --delete fix/seo-description feature/analytics
```

---

### ¿Cuándo se usa cherry-pick en la vida real?

| Situación | Por qué cherry-pick |
|-----------|-------------------|
| Un hotfix en `main` que también necesita una feature branch | En vez de mergear todo `main`, solo el fix |
| Recuperar un commit borrado accidentalmente | Cherry-pick desde el reflog |
| Llevar un cambio específico a una release branch anterior | Sin tener que mergear features nuevas |
| Backport de fixes a versiones anteriores (LTS) | Cherry-pick commit por commit |

---

## Notas

- `git branch -d <rama>` solo borra si está mergeada. Usar `-D` para forzar.
- `git push origin --delete <rama>` borra la rama remota.
- `git tag -a v1.0.0 -m "mensaje"` crea un tag **anotado** (con metadata). Preferible al lightweight.
- GitHub no permite aprobar tu propio PR con branch protection activa.
