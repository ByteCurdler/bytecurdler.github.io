ls *.png | sed 's/\.png//g' | awk '{printf "\"%s\"%s", $0, (NR==NR ? ", " : "")}' | sed 's/^, //' | awk '{print "[" $0 "]"}'
