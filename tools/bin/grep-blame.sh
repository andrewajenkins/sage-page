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
fzf --delimiter=" " --preview "cat {5}"

#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
#  dateinfo=$(git show -s --format=%ci $hash)
#  echo -e "$dateinfo\t$hash\t$file\t$lineno\t$content"
#done | \
#sort -r | \
#awk -F '\t' '{split($1, dateparts, " "); print dateparts[1] " " dateparts[2] " " dateparts[3] " " $2 " " $3 " " $4 " \"" $5 "\""}'
#fzf --delimiter=" " --preview "echo \"File: {5}\"; echo \"Line: {6}\"; echo \"Content: {7}\"; echo \"File Preview:\"; cat {5}"

#fzf --delimiter=" " --preview 'echo "File: {5}"; echo "Line: {6}"; echo "Content: {7}"; echo "File Preview:"; cat {5}'

## Search for the pattern using rg, annotate with git blame, and sort by date
#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
#  dateinfo=$(git show -s --format=%ci $hash)
#  echo -e "$dateinfo\t$hash\t$file\t$lineno\t$content"
#done | \
#sort -r | \
#awk -F '\t' '{split($1, dateparts, " "); print dateparts[1] " " dateparts[2] " " dateparts[3] " " $2 " " $3 " " $4 " \"" $5 "\""}'
#fzf --delimiter=" " --preview 'echo "Date: {1}"; echo "Time: {2}"; echo "Timezone: {3}"; echo "Hash: {4}"; echo "File: {5}"; echo "Line: {6}"; echo "Content: {7}"; echo "File Preview:"; cat {1}'


#fzf --delimiter=" " --preview 'echo "Date: {1}"; echo "Time: {2}"; echo "Timezone: {3}"; echo "Hash: {4}"; echo "File: {5}"; echo "Line: {6}"; echo "Content: {7}"; echo "bat --color \"always\" --line-range {6}:{6} {5}"; bat --color "always" --line-range {6}:{6} {5}'



## Check if a search term is provided
#if [ $# -eq 0 ]; then
#  echo "Please provide a search term."
#  exit 1
#fi
#
#search_term="$1"
#
## Search for the pattern using rg, annotate with git blame, and sort by date
#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
#  date=$(git show -s --format=%ci $hash)
#  echo -e "$date\t$hash\t$file\t$lineno\t$content"
#done | \
#sort -r | \
#awk -F '\t' '{print $1 " " $2 " " $3 " " $4 " \"" $5 "\""}' | \
#fzf --delimiter=" " --preview 'echo "Date: {1}"; echo "Hash: {2}"; echo "File: {3}"; echo "Line: {4}"; echo "Content: {5}"; echo "bat --color \"always\" --line-range {4}:{4} {3}"; bat --color "always" --line-range {4}:{4} {3}'

## Check if a search term is provided
#if [ $# -eq 0 ]; then
#  echo "Please provide a search term."
#  exit 1
#fi
#
#search_term="$1"
#
## Search for the pattern using rg, annotate with git blame, and sort by date
#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
#  date=$(git show -s --format=%ci $hash)
#  echo -e "$date\t$hash\t$file\t$lineno\t$content"
#done | \
#sort -r | \
#awk -F '\t' '{print $1 " " $2 " " $3 " " $4 " " $5}' | \
#fzf --delimiter=" " --preview 'echo "bat --color \"always\" --line-range {4}:{4} {3}"; bat --color "always" --line-range {4}:{4} {3}'

## Check if a search term is provided
#if [ $# -eq 0 ]; then
#  echo "Please provide a search term."
#  exit 1
#fi
#
#search_term="$1"
#
## Search for the pattern using rg, annotate with git blame, and sort by date
#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
#  date=$(git show -s --format=%ci $hash)
#  echo -e "$date\t$hash\t$file\t$lineno\t$content"
#done | \
#sort -r | \
#awk -F '\t' '{print $1 " " $2 " " $3 ":" $4 ":" $5}' | \
#fzf --delimiter=":" --preview 'echo "bat --color \"always\" --line-range {2}:{2} {1}"; bat --color "always" --line-range {2}:{2} {1}'


## Check if a search term is provided
#if [ $# -eq 0 ]; then
#  echo "Please provide a search term."
#  exit 1
#fi
#
#search_term="$1"
#
## Search for the pattern using rg, annotate with git blame, and sort by date
#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
#  date=$(git show -s --format=%ci $hash)
#  echo "$date $hash $file $lineno \"$content\""
#done | \
#sort -r | \
#fzf --delimiter=" " --preview 'echo "bat --color \"always\" --line-range {5}:{5} {4}"; bat --color "always" --line-range {5}:{5} {4}'


## Check if a search term is provided
#if [ $# -eq 0 ]; then
#  echo "Please provide a search term."
#  exit 1
#fi
#
#search_term="$1"
#
## Search for the pattern using rg, annotate with git blame, and sort by date
#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
#  date=$(git show -s --format=%ci $hash)
#  echo "$date $hash $file $lineno $content"
#done | \
#sort -r | \
#fzf --delimiter=" " --preview 'echo "bat --color \"always\" --line-range {4}:{4} {3}"; bat --color "always" --line-range {4}:{4} {3}'


## Check if a search term is provided
#if [ $# -eq 0 ]; then
#  echo "Please provide a search term."
#  exit 1
#fi
#
#search_term="$1"
#
## Search for the pattern using rg, annotate with git blame, and sort by date
#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
#  date=$(git show -s --format=%ci $hash)
#  echo "$date $hash $file:$lineno:$content"
#done | \
#sort -r | \
#fzf --delimiter=" " --preview 'bat --color "always" --line-range {4}:{4} {3}'


## Check if a search term is provided
#if [ $# -eq 0 ]; then
#  echo "Please provide a search term."
#  exit 1
#fi
#
#search_term="$1"
#
## Search for the pattern using rg, annotate with git blame, and sort by date
#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
#  date=$(git show -s --format=%ci $hash)
#  echo "$date $hash $file:$lineno:$content"
#done | \
#sort -r | \
#fzf --delimiter=" " --preview 'bat --color "always" {3} -r {4}'


#set -x
## Check if a search term is provided
#if [ $# -eq 0 ]; then
#  echo "Please provide a search term."
#  exit 1
#fi
#
#search_term="$1"
#
## Search for the pattern using rg, annotate with git blame, and sort by date
#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  blame=$(git blame -L $lineno,$lineno --date=short -- $file)
#  date=$(echo $blame | cut -d ' ' -f 3)
#  hash=$(echo $blame | cut -d ' ' -f 1)
#  echo "$date $hash $file:$lineno:$content"
#done | \
#sort -r
##sort -r | \
##fzf --delimiter=" " --preview 'bat --color "always" {3} -r {4}'
#

## Check if a search term is provided
#if [ $# -eq 0 ]; then
#  echo "Please provide a search term."
#  exit 1
#fi
#
#search_term="$1"
#
## Search for the pattern using rg, annotate with git blame, and sort by date
#rg --color=never -n -o --vimgrep "$search_term" | while IFS=: read -r file lineno content; do
#  hash=$(git blame -L $lineno,$lineno -- $file | awk '{print $1}')
#  date=$(git show -s --format=%ci $hash)
#  echo "$date $hash $file:$lineno:$content"
#done | \
#sort -r | \
#fzf --delimiter=":" --preview 'bat --color "always" {1} -r {2}'
