#!/bin/sh -e

# Go to OUTPUT_PATH
cd "$(dirname "${0}")/.."
echo "Dumping database..."
npm run dump

# Archive all except current
cd "${OUTPUT_PATH:-data}"
echo "Archiving from: ${PWD}"
echo

archive() {
  tar -cJf "$1.tar.xz" "$1" &&
    rm -R "$1"
}

CUR="$(date -u +%Y-%m)"
for f in ????-??; do
  a="${f}.tar.xz"
  if [ "${f}" != "${CUR}" ]; then
    if [ -s "$a" ]; then
      echo "> Error archiving ${f}: archive already exists..."
    else
      echo "> Archiving ${f}..."
      archive "${f}"
    fi
  fi
done

# we allow to override sql_dump archive
if [ -d "sql_dump" ]; then
  echo "> Archiving SQL dump..."
  archive "sql_dump"
fi

echo
echo "Done."
