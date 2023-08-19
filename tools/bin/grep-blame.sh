#!/bin/bash


# Check if a search term is provided
if [ $# -eq 0 ]; then
  echo "Please provide a search term."
  exit 1
fi

search_term="$1"
rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
  dateinfo=$(git show -s --format=%ci $hash)
  echo -e "$dateinfo\t$hash\t$file\t$lineno\t$content"
done | \
sort -r | \
awk -F '\t' '{split($1, dateparts, " "); print dateparts[1] " " dateparts[2] " " dateparts[3] " " $2 " " $3 " " $4 " \"" $5 "\""}' | \
fzf --delimiter=" " --preview "tempfile=\$(mktemp); git blame --date=short {5} | awk -v line={6} 'NR==line {print \"\033[0;32m\" \$0 \"\033[0m\"} NR!=line {print \$0}' > \$tempfile; bat -l plaintext \$tempfile; rm \$tempfile"
