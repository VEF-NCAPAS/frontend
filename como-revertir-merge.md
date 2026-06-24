# Guía: Cómo revertir el Merge de la rama `feature/crud-empresas-diversidad-genero` en `develop`

Si por alguna razón los cambios de la funcionalidad de Empresas y Estadísticas de Diversidad de Género causan problemas en la rama `develop`, puedes revertir la fusión (merge) siguiendo una de estas opciones.

---

## Opción 1: Revertir desde la página web de GitHub (Recomendado y más fácil)

Si la fusión se subió a GitHub, GitHub permite revertir fusiones con un solo botón:
1. Ve al repositorio en GitHub (Backend o Frontend).
2. Entra a la pestaña **Commits** o a la lista de **Pull Requests** cerrados.
3. Busca el commit del merge (tendrá un mensaje como: `Merge branch 'feature/crud-empresas-diversidad-genero' into develop`).
4. Haz clic en el commit y verás un botón que dice **"Revert"** (Revertir).
5. Esto creará un nuevo Pull Request que revierte todos los cambios. Solo debes aprobar ese Pull Request y `develop` volverá a estar como antes.

---

## Opción 2: Revertir usando la Consola (Seguro para el equipo)

Este método crea un nuevo commit "antídoto" que deshace los cambios. Es la forma más segura si otros compañeros ya descargaron (hicieron `git pull`) de la rama `develop`.

Ejecuta los siguientes comandos en la terminal (ya sea en la carpeta del backend o frontend):

```bash
# 1. Asegúrate de estar en develop y con los últimos cambios
git checkout develop
git pull origin develop

# 2. Revertir el commit del merge.
# En Git, para revertir un merge commit debes usar la opción "-m 1" para indicar cuál es la rama principal (la de destino, develop).
git revert -m 1 HEAD

# 3. Se abrirá un editor para confirmar el mensaje del commit de reversión. Guarda y cierra el editor.
# 4. Sube la reversión a GitHub
git push origin develop
```

---

## Opción 3: Restablecer y eliminar la fusión del historial (Solo si nadie más ha hecho `git pull`)

**ATENCIÓN:** Solo usa este método si estás seguro de que ningún compañero ha descargado la rama `develop` después del merge. Este comando reescribe el historial de Git.

```bash
# 1. Asegúrate de estar en develop
git checkout develop

# 2. Retrocede la rama local al commit anterior al merge (1 commit atrás)
git reset --hard HEAD~1

# 3. Sobrescribe la rama develop en GitHub (forzar el push)
git push origin develop --force
```
