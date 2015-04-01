# colorcorrupcion
Análisis de los datos sobre cobertura de corrupción en España recopilados en PageOneX

# How to

## 1. Download data from PageOneX

Execute in terminal de bash file:

  ./wget.sh\
  
## 2. Merge all the downloaded json files

Given colorcorrupcion-1.json and colorcorrupcion-0.json it is possible to merge them to one file basic3.json with jq (http://stedolan.github.io/jq/) and only keep the data stored in object "data":

Merge two files:

   jq -s 'reduce .[] as $dot ({}; .data += $dot.data)' colorcorrupcion-1.json colorcorrupcion-0.json > colorJanFeb2015.json

(In this specific case, we are merging January and February 2013 first as February thread is partially filled with data, the other part is in January thread).  
  
Merge all the files which name start with "color":

   jq -s 'reduce .[] as $dot ({}; .data += $dot.data)' color*.json > data/total201320142015.json
  
Rename newspaper names with accents inside the file: "El País" to "El País".
