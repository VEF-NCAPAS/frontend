# Guía: Cómo revertir los cambios de hoy en la rama `develop`

Si por alguna razón a tus compañeros no les gustan las actualizaciones de hoy (reportes dinámicos, CRUD de empresas, CRUD de candidatos y la integración de géneros) o causan problemas con otros módulos, puedes devolver ambas ramas `develop` exactamente al estado en el que estaban antes de que empezáramos a trabajar hoy.

---

## Método Rápido y Seguro: Forzar el restablecimiento al estado original

Este método borra los commits que subimos hoy en `develop` y deja la rama idéntica a como estaba antes de comenzar.

### 1. En la carpeta del FRONTEND:
Ejecuta estos comandos en tu terminal:
```bash
# 1. Asegúrate de estar en develop
git checkout develop

# 2. Restablecer la rama al commit previo a nuestros cambios de hoy (commit: 9759c89)
git reset --hard 9759c89

# 3. Forzar la subida a GitHub para actualizar el repositorio remoto
git push origin develop --force
```

### 2. En la carpeta del BACKEND (WorkHive):
Ejecuta estos comandos en tu terminal:
```bash
# 1. Asegúrate de estar en develop
git checkout develop

# 2. Restablecer la rama al commit previo a nuestra fusión de hoy (commit: e43a26c)
git reset --hard e43a26c

# 3. Forzar la subida a GitHub para actualizar el repositorio remoto
git push origin develop --force
```

---

## Método Alternativo: Crear un commit "antídoto" (Si otros compañeros ya hicieron pull)

Si algún compañero ya descargó los cambios de hoy con `git pull`, usar el método de arriba (`--force`) podría causarles conflictos en su historial. En ese caso, es mejor revertir creando un commit que deshace los cambios:

```bash
# En el frontend o backend:
git checkout develop
git pull origin develop

# Revertir el último commit de fusión
git revert -m 1 HEAD

# Guardar el mensaje del commit de reversión y subir
git push origin develop
```
