install.packages("rjson")
library("rjson")
json_file <- "total2013-2016.json"
json_data <- fromJSON(paste(readLines(json_file), collapse=""))
head(json_data)

# json_data$data$`2013-01-31`$`El Mundo`$PP

dayslist <- data.frame(as.Date(names(json_data$data), "%Y-%m-%d"))
colnames(dayslist)[1] = "date"
# dayslist<- dayslist[order(-dayslist)] TODO ordena datos

newspapers <- names(json_data$data$`2013-01-31`)
topics <- names(json_data$data$`2016-08-31`$`El Pais`)

#creates dataframe for day 1

n = length(newspapers) - 1 # do not count "total"
m = length(topics)
day1 <- data.frame(c(1:n))
rownames(day1) <- newspapers[1:8] # sets row names with newspapers
day1 <- subset( day1, select = -c.1.n. ) #removes column with rownames (not needed)

day1$PP = 0
day1$PSOE = 0
day1$CiU = 0
day1$CasaReal = 0
day1$UGT = 0
day1$Otros = 0
day1$Bankia = 0
day1$Podemos = 0
day1$Ciudadanos = 0

day2 <- data.frame(c(1:n))
rownames(day2) <- newspapers[1:8] # sets row names with newspapers
day2 <- subset( day2, select = -c.1.n. ) #removes column with rownames (not needed)

day2$PP = 0
day2$PSOE = 0
day2$CiU = 0
day2$CasaReal = 0
day2$UGT = 0
day2$Otros = 0
day2$Bankia = 0
day2$Podemos = 0
day2$Ciudadanos = 0
# 
# json_data$data$'2013-01-31'[[1]]$PP
# 
# day1$PP[1] = json_data$data$'2013-01-31'$'El Pais'$PP # El Pais
# day1$PP[1] = json_data$data$'2013-01-31'[[1]]$PP # El Pais con entrada como número
# day1$PP[1] = json_data$data$'2013-01-31'[[1]][[1]] # El Pais con entrada como número y PP
# day1$PP[1]
# day1[[1]][1]
# json_data$data$'2013-01-31'[[1]][[1]]
# 
# day1$PP[2] = json_data$data$'2013-01-31'$'El Mundo'$PP  # El Mundo
# 
# day1[[1]][2]
# day1[[m]][n] = 9
# json_data$data$'2013-01-31'[[m]]
# json_data$data$'2013-01-31'[[m]][[n-2]]
# 
# json_data$data$'2013-01-31'$'El Pais'$PP


for (i in 1:8) { # iterates through newspapers. It should use n
  #TODO do not use La Gaceta!! that stopped pulbication. It gives error when here is n-1 newspapers
  for (j in 1:7) { # iterates through topics. It should use m
    #TODO as Podemos and CIudadanos are not in the first month, it gives error for the first years
    day1[[j]][i] <- json_data$data$'2016-09-15'[[i]][[j]]
    day2[[j]][i] <- json_data$data$'2016-09-16'[[i]][[j]]
  }
}

# test manually insert dataframes in dataframe
totaly <- data.frame(dayslist$date)
colnames(totaly)  <- "date" #renames column
totaly$dataframes  <- 0 # creates column
totaly$dataframes[[1]] <- list(day1) # inserts day1 dataframe in column $dataframes
totaly$dataframes[[2]] <- list(day2) # inserts day1 dataframe in column $dataframes
json_data$data[[3]]
totaly$dataframes[[3]] <- json_data$data[[3]][[i]][[j]]


for (i in 1:8) { # iterates through newspapers. It should use n
  #TODO do not use La Gaceta!! that stopped pulbication. It gives error when here is n-1 newspapers
  for (j in 1:7) { # iterates through topics. It should use m
    #TODO as Podemos and CIudadanos are not in the first month, it gives error for the first years
    day2[[j]][i] <- json_data$data[[32]][[i]][[j]]
  }
}

str(totaly$dataframes[[1]])
totaly$dataframes[[2]][[1]][[1]][[1]] # 1st column ($dataframes), 1st dataframe, 1st row, 1st column
totaly$dataframes[[2]][[1]]

# Creates dataframe with list of dates
totalx <- data.frame(dayslist$date)
colnames(totalx)  <- "date" #renames column
totalx$year <- as.numeric(format(totalx$date, "%Y"))
totalx$month <- as.numeric(format(totalx$date, "%m"))
  
# json_data$data[[1431]][[1]][[1]]

p = length(totalx$date)
str(day1)
totalx$dataframes[32] <- day1

for (k in 1:500) {
  day <- data.frame(c(1:n))
  rownames(day) <- newspapers[1:8] # sets row names with newspapers
  day <- subset( day, select = -c.1.n. ) #removes column
  day$PP = 0
  day$PSOE = 0
  day$CiU = 0
  day$CasaReal = 0
  day$UGT = 0
  day$Otros = 0
  day$Bankia = 0
  day$Podemos = 0
  day$Ciudadanos = 0
  for (i in 1:8) { # iterates through newspapers. It should use n
    #TODO do not use La Gaceta!! that stopped pulbication. It gives error when here is n-1 newspapers
    for (j in 1:7) { # iterates through topics. It should use m
      #TODO as Podemos and CIudadanos are not in the first month, it gives error for the first years
      day[[j]][i] <- json_data$data[[k]][[i]][[j]]
    }
  }
  totalx$dataframes[[k]] <- list(day)
}
totalx$dataframes[[1]]
json_data$data[[500]][[8]][[8]]

totalx$data[1431]

day1[[j]][i] <- json_data$data$'2016-09-15'[[i]][[j]]

# trying to flat the json.
# read https://cran.r-project.org/web/packages/jsonlite/vignettes/json-mapping.pdf
# we must have the json properly formated. Ler email "Basic doubt about exporting to json" y formatear con javascript

totalxx<-data.frame(author=newspapers)
totalxx$date<-list(data.frame(date=data.frame(as.Date(names(json_data$data), "%Y-%m-%d")))
                   ,value=json_data$data
                   )

totalxx$topics<-list(data.frame(topics=topics))

xx<-data.frame(author=c("Homer","Virgil","Jeroen"))
xx$poems<-list(data.frame(title= c( "Iliad" , "Odyssey"),
                          year= c( - 1194 , - 800)),
                            data.frame(title= c( "Eclogues" , "Georgics" , "Aeneid"),
                          year= c(-44 ,-29 ,-19)),data.frame()
               )

