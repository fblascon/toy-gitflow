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

### Cambios

1. **`src/index.html`** — actualizar año del footer al actual
2. **`README.md`** — añadir sección de versionado y enlace a la release
3. **`CHANGELOG.md`** (nuevo) — registrar cambios de la v1.0.0

### Pasos

```bash
git checkout main && git pull origin main
git checkout -b release/v1.0.0
```

Editar `src/index.html`: cambiar `&copy; 2026` por `&copy; 2026` (se queda igual, o se puede cambiar dinámicamente).

**Crear `CHANGELOG.md`:**

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

**Commit y push:**

```bash
git add -A
git commit -m "chore: prepare release v1.0.0"
git push -u origin release/v1.0.0
```

**PR en GitHub:**
- Title: `release v1.0.0`
- Base: `main` ← compare: `release/v1.0.0`
- Review → Approved ✅
- Merge Pull Request

**Post-merge (local):**

```bash
git checkout main && git pull origin main
git tag v1.0.0
git push origin v1.0.0
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

**En GitHub:** Ir a Releases → Create a new release → elegir tag `v1.0.0` → escribir notas → Publish release.

---

## Notas

- `git branch -d <rama>` solo borra si está mergeada. Usar `-D` para forzar.
- `git push origin --delete <rama>` borra la rama remota.
- `git tag -a v1.0.0 -m "mensaje"` crea un tag **anotado** (con metadata). Preferible al lightweight.
- GitHub no permite aprobar tu propio PR con branch protection activa.
