# Downloads all raw and export json files from a series of threads in Pageonex.com 
# (in this case a local installation)
# .............................................................................

# Load libraries ----------
library(rjson)
library(tidyverse)


# Download files --------
# Download list of files
files <- read_csv(file="data/original/color-corrupcion-threads-pageonex.csv")

path <- "data/original/raw"

# Download one file
download.file( paste0(files$url[1],"/raw.json"), 
               paste0( path,"/", files$slug[1] %>% str_remove("numeroteca/"),"_raw-areas.json") )

# Download all the raw area files -------
# select only the threads that are available
files_available <- files %>% filter( !is.na(slug))

path <- "data/original/raw"

for ( i in 1:nrow(files_available)) {
  download.file( paste0(files$url[i],"/raw.json"), 
                 paste0( path,"/", files$slug[i] %>% str_remove("numeroteca/"),"_raw-areas.json") )
}

# Download all the export.json -----------
# These json have three parts:
# media: list of media available. Ex: "El País"
# codes: list of main categories to code. Ex: "PP"
# dates: available dates. Ex: "2010-01-01"
# color: code and color. Ex: "PP": "#266bff"
# data: 
# "data": {
#   "2010-02-01": {
#     "El País": {
#       "PP": 0.1752192192192192,
#       "PSOE": 0,
#       "CiU": 0,
#       "Casa Real": 0,
#       "UGT-A y CCOO": 0,
#       "Otros": 0,
#       "Bankia": 0,
#       "Podemos": 0,
#       "Ciudadanos": 0,
#       "Judicatura": 0
#     },
#     "El Mundo": {
#       "PP": 0,

path <- "data/original/export"

for ( i in 1:nrow(files_available)) {
  download.file( paste0(files$url[i],"/export.json"), 
                 paste0( path,"/", files$slug[i] %>% str_remove("numeroteca/"),"_export.json") )
}


# Join all the downloaded files -------------

path <- "data/original/raw"

# lista archivos en directorio "path"
files <- list.files(path) %>% as.data.frame() %>% rename( name = 1)

# TODO: está pendiente hacer esto desde R. Mientras uso bash y jq:
# merges the areas
# jq -s 'reduce .[] as $dot ({}; .data += $dot.areas)' *.json > join/total2009-2016_raw.json

# merges the images. WARNING: images in February 2013 are repeated, as the first thread includes days from January and February 2013.
# jq -s 'reduce .[] as $dot ({}; .data += $dot.images)' *.json > join/total2009-2016_img.json