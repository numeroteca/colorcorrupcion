# Color Corrupción
Análisis de los datos sobre cobertura de corrupción en España recopilados en PageOneX
http://numeroteca.org/colorcorrupcion

# How to

## 1. Download and process datadata from PageOneX

There is an R script that describes de process: `download_process_cc-files.R`.`

## In the past the process involved the following steps (deprecated)

### 1. Download and process datadata from PageOneX

In the past this process was done execute in terminal the bash file:

`./wget.sh\`

If it doesn't work for you: just copy and paste the content of the script wget.sh.
  
### 2. Merge all the downloaded json files

Given colorcorrupcion-1.json and colorcorrupcion-0.json it is possible to merge them to one file basic3.json with jq (http://stedolan.github.io/jq/) and only keep the data stored in object "data":

Merge two files:

`jq -s 'reduce .[] as $dot ({}; .data += $dot.data)' colorcorrupcion-1.json colorcorrupcion-0.json > colorJanFeb2015.json`

(In this specific case, we are merging January and February 2013 first as February thread is partially filled with data, the other part is in January thread).  

We remove then remove colorcorrupcion-1.json colorcorrupcion-0.json, as their data have been merged in colorJanFeb2013.json.
  
Merge all the files which name start with "color":

`jq -s 'reduce .[] as $dot ({}; .data += $dot.data)' color*.json > data/total201320142015.json`
  
Rename newspaper names with accents inside the file. Ex: "El País" to "El País".

###  3. Generate json files

One file per each media must be generated with the file `json_to_d3_ready_script.html`

Change "var media" to the name of the newspaper that applies and save the file as .json

###  4. Use

Navigate to `index.html` or / where the files are stored and enjoy the data visualization.
