#!/bin/bash
# ─────────────────────────────────────────
#  KEHILÁ — Sincronizar con GitHub
#  Uso: ./sincronizar.sh
#  O con mensaje: ./sincronizar.sh "lo que cambié"
# ─────────────────────────────────────────

cd "$(dirname "$0")"

echo "⬇  Descargando versión más reciente de GitHub..."
git pull origin master --no-rebase -X ours 2>&1

echo ""
echo "📦 Preparando cambios locales..."
git add .

# Si no hay cambios, salir
if git diff --cached --quiet; then
  echo "✓  No hay cambios nuevos. Todo ya está actualizado."
  exit 0
fi

# Mensaje de commit: argumento o timestamp automático
if [ -n "$1" ]; then
  MENSAJE="$1"
else
  MENSAJE="update: $(date '+%d %b %Y %H:%M')"
fi

git commit -m "$MENSAJE"

echo ""
echo "⬆  Subiendo a GitHub..."
git push origin master

echo ""
echo "✓  Listo. Cambios en https://github.com/mosheacrich-art/kehila.git"
