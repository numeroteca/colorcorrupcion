#!/bin/bash
####################
#
# file: wget.sh
#
# Download PageOneX Threads about colorcorrupción
#
# Based on script by Sean O'Donnell <sean@seanodonnell.com>
# http://code.seanodonnell.com/?id=53
#
# Execute it from directory colorcorrupcion/data
#
####################

mirror=http://pageonex.com/numeroteca

file[0]=corrupcion-spain-enero-2013/
file[1]=colorcorrupcion-espana-febrero-2013/
file[2]=corrupcion-espana-marzo-2013/
file[3]=corrupcion-espana-abril-2013/
file[4]=corrupcion-espana-mayo-2013/
file[5]=corrupcion-espana-junio-2013/
file[6]=corrupcion-espana-julio-2013/
file[7]=corrupcion-espana-agosto-2013/
file[8]=corrupcion-espana-septiembre-2013/
file[9]=corrupcion-espana-octubre-2013/
file[10]=corrupcion-espana-noviembre-2013/
file[11]=corrupcion-espana-diciembre-2013/

file[12]=corrupcion-espana-enero-2014/
file[13]=corrupcion-espana-febrero-2014/
file[14]=corrupcion-espana-marzo-2014/
file[15]=corrupcion-espana-abril-2014/
file[16]=corrupcion-espana-mayo-2014/
file[17]=corrupcion-espana-junio-2014/
file[18]=corrupcion-espana-julio-2014/
file[19]=corrupcion-espana-agosto-2014/
file[20]=corrupcion-espana-septiembre-2014/
file[21]=corrupcion-espana-octubre-2014/
file[22]=corrupcion-espana-noviembre-2014/
file[23]=corrupcion-espana-diciembre-2014/

file[24]=corrupcion-espana-enero-2015/
file[25]=corrupcion-espana-febrero-2015/
file[26]=corrupcion-espana-marzo-2015/
file[27]=corrupcion-espana-abril-2015/
file[28]=corrupcion-espana-mayo-2015/
file[29]=corrupcion-espana-junio-2015/
file[30]=corrupcion-espana-julio-2015/
file[31]=corrupcion-espana-agosto-2015/
file[32]=corrupcion-espana-septiembre-2015/
file[33]=corrupcion-espana-octubre-2015/
file[34]=corrupcion-espana-noviembre-2015/
file[35]=corrupcion-espana-diciembre-2015/

file[36]=corrupcion-espana-enero-2016/
file[37]=corrupcion-espana-febrero-2016/
file[38]=corrupcion-espana-marzo-2016/
file[39]=corrupcion-espana-abril-2016/
file[40]=corrupcion-espana-mayo-2016/
file[41]=corrupcion-espana-junio-2016/
file[42]=corrupcion-espana-julio-2016/
file[43]=corrupcion-espana-agosto-2016/
file[44]=corrupcion-espana-septiembre-2016/
file[45]=corrupcion-espana-octubre-2016/
file[46]=corrupcion-espana-noviembre-2016/
file[47]=corrupcion-espana-diciembre-2016/



for (( i = 0 ; i < ${#file[@]} ; i++ ))
do
	wget -O colorcorrupcion-$i.json $mirror/${file[$i]}raw.json
done

unset file
unset mirror

# merges downloaded files
# jq -s 'reduce .[] as $dot ({}; .data += $dot.data)' colorcorrupcion-1.json colorcorrupcion-0.json > colorJanFeb2015.json
# rm colorcorrupcion-0.json
# rm colorcorrupcion-1.json
# merges the areas
jq -s 'reduce .[] as $dot ({}; .data += $dot.areas)' color*.json > total2013-2016_raw.json
# merges the images. WARNING: images in February 2013 are repeated, as the first thread includes days from January and February 2013.
jq -s 'reduce .[] as $dot ({}; .data += $dot.images)' color*.json > total2013-2016_img.json
exit
