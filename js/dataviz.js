//On click, update with new data

//initially based on http://bl.ocks.org/mbostock/1134768 and http://bl.ocks.org/anupsavvy/9513382
var w = 1300,
    h = 800,
    p = [50, 80, 430, 50],
    p2 = [100, 50, 50, 20],
    h2 = h - p[0] - p[2] - p2[0] - p2[2],
    x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]), //https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeRoundBands
    y = d3.scale.linear().range([0, h - p[0] - p[2]]),
    colors = ["blue","red", "orange","darkgreen","lime","#FBBBB9","grey","grey","#9e398b"],
    color = d3.scale.ordinal().range(colors),
    //parties = ['PP','PSOE','CiU','Casa Real','Bankia','UGT-A y CCOO','Otros'];
    //parties = {'PP':"blue",'PSOE':"red",'CiU':"orange",'Casa Real':"darkgreen",'Bankia':"lime",'UGT-A y CCOO':"#FBBBB9",'Otros':"grey};
    //parse = d3.time.format("%m-%Y").parse,
    format = d3.time.format("%b");
    var formato = d3.time.format("%m-%Y");
    //parse = d3.time.format("%Y-%m-%d").parse
    var yCIS = d3.scale.linear().range([0, h - p[0] - p[2]]); //scale for CIS data
    var ySum = d3.scale.linear().range([0, h2 - 10]); //scale for CIS data
    
//Adds the div that is used for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//Adds datavis div to insert the svg
var svg = d3.select("#datavis").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

//Set up stack method
var stack = d3.layout.stack();

//Adds boundary tonewspaper
svg.append("rect")
	.attr("x", 140)
  .attr("y", 40 )
  .attr("width", 180)
  .attr("height", h2 + p2[2])
  .attr("class","boundary")
  .style("stroke","#bbb")
  .style("fill","#fefefe");

svg.append("svg:text")
  .attr("x", 150)
  .attr("y", 274 )
  .text("Total acumulado de todo el periodo");
   
//var str = "data/perMonthElMundo.json";	
//console.log("str",str);

//On click, update with new data
d3.selectAll(".m").on("click", function() {
	var date = this.getAttribute("value");
	//console.log("this",this.getAttribute("value"));
	//console.log("date",date);
	var str = "data/perMonthElMundo.json";
	//console.log("str 0",str);
	if(date == "El Pais"){
		str = "data/perMonthElPais.json";
	}else if(date == "El Mundo"){
		str = "data/perMonthElMundo.json";
	}else if(date == "ABC"){
		str = "data/perMonthABC.json";
	}else if(date == "La Razon"){
		str = "data/perMonthLaRazon.json";
	}else if(date == "La Gaceta"){
		str = "data/perMonthLaGaceta.json";
	}else if(date == "La Vanguardia"){
		str = "data/perMonthLaVanguardia.json";
	}else if(date == "El Periodico"){
		str = "data/perMonthElPeriodico.json";
	}else if(date == "Ara"){
		str = "data/perMonthAra.json";
	}else if(date == "Total mes"){
		str = "data/perMonthTotal.json";
	//}else if(date == "Total dia"){
	//	str = "data/perDayTotal.json";
	}else{
		str = "data/perMonthLaVanguardia.json";
	}
	//console.log("str 1",str);

//d3.csv("crimea.csv", function(crimea) {
d3.json(str, function(total) { //Reads json file 'data/perMonthElMundo.json'

console.log(total);

var sum = total['sum'];
console.log(sum);

media = total['media'];
console.log("media",media);

total = total['data'];
for ( var i = 0; i < total.length; i++ ){
	total[i].sort(function(a,b){
		// Turn your strings into dates, and then subtract them
		// to get a value that is either negative, positive, or zero.
		return new Date(a.x) - new Date(b.x);
	});
}

//For json
dataset = total;
stack(dataset);
console.log("stack(dataset) ",dataset);

// Compute the x-domain (by date) and y-domain (by top).
x.domain(	dataset[0].map(function(d) { return d.x; }) ); //coge la primera de las n arrays, podŕia ser 1 o 2 tambien
y.domain([
	0, //valor minimo
	14 //TODO calculate the max value (y0) of all the possible arrays to keep y scale constant
	/*d3.max(
		dataset[dataset.length - 1], function(d) { return d.y0 + d.y; console.log(d.y0 + d.y);} //coge la array ultima que ya tienen todos los valors acumulados
	) */ //valor maximo
]); //usa la ultima array, la que tiene los valores de las otras ya acumulados para calcular el maximos valos de y

//Labels in x axis
svg.selectAll(".xlabels").remove();

var xlabels = svg.append("svg:g").attr("class","xlabels");

xlabels.selectAll("text")
   .data(dataset[0])
   .enter()
   .append("text")
   .text(function(d) {
        return String(formato(new Date(d.x)));
   })
   .attr("x", function(d, i) {
        //return i * (w / dataset[0].length);
        return x(d.x);
   })
   .attr("y", 15)
   .style("font-size","8px");

//Creates groups for codes. Every rectangle with a color (=code or party) is in a svg group
groups = svg.selectAll(".party").data(dataset);
groups.enter().append("g") //adds groups and asig color to every fill
        .attr("class","party")
        .style("fill",function(d,i) {
            return color(i);
        });
//Removes rectangles to insert them again (cleans previous drawn rectangles(
groups.selectAll("rect").data(function(d){return d;}).remove();

//Adds rectangles the stack bars
rect = groups.selectAll("rect").data(function(d){return d;});

rect.enter()
  .append("rect")
  //.attr("x",function(d,i) { return i*w/dataset[0].length-20; })
  .attr("x", function(d) { return x(d.x); })
  .attr("y", function(d) { return -y(d.y0) - y(d.y); })
  .attr("width",(w - p[1] - p[3])/(dataset[0].length*1.15))
  .attr("height", function(d) { return y(d.y); })
  .style("fill-opacity",1)
  //The tooltip
	.on("mouseover", function(d) {
    div.transition().duration(200).style("opacity", .9);
    div.html("<span style='font-size:24px;'><strong>"  + d.y.toPrecision(3) + "</span></strong>" + "<br>portadas de este mes dedicadas a corrupci&oacute;n y <br><strong><span style='font-size:16px;'>" + d.party + "</span></strong><br>"
    	+ formato(new Date(d.x)))
			.style("left", (d3.event.pageX + 10) + "px")
			.style("top", (d3.event.pageY + 20) + "px");
	})
	.on("mouseout", function(d) {
    div.transition().duration(500).style("opacity", 0);
	});

//Adds legend
/*legend = svg.selectAll("rect");

var legend = svg.append("rect")
  //.attr("x",function(d,i) { return i*w/dataset[0].length-20; })
  .attr("x", function(d,i) { return i*10; })
  .attr("y", function(d,i) { return h; })
  .attr("width",20)
  .attr("height",20)
  .attr("fill","#f00")
  .style("fill-opacity",1);
*/
// Add y-axis rules.
var rule = svg.selectAll("g.rule")
    .data(y.ticks(5))
  .enter().append("svg:g")
    .attr("class", "rule")
    .attr("transform", function(d) { return "translate(0," + -y(d) + ")"; });

rule.append("svg:line")
    .attr("x2", w - p[1] - p[3])
    .style("stroke", function(d) { return d ? "#fff" : "#000"; })
    .style("stroke-width", 1)
    .style("stroke-opacity", function(d) { return d ? .7 : null; });

rule.append("svg:text")
    .attr("x", -15)
    .attr("dy", ".35em")
    .text(d3.format(",d"));

d3.select(".explain").remove();
      
  var explain = svg.append("svg:g").attr("class","explain");
  
  explain.append("svg:text")
      .attr("x", 40)
      .attr("y", -30)
      .text("Numero de portadas/mes. 1 = superficie 1 portada")
      .style("text-anchor", "start")
      .attr("transform", function(d) {
         return "rotate(-90)"
     });
  explain.append("svg:text")
      .attr("x", 60)
      .attr("y", w - p[1] )
      .text("Porcentaje de respuestas Barómetro CIS")
      .style("text-anchor", "start")
      .attr("transform", function(d) {
         return "rotate(-90)"
     	});

	//Adds medianame to chart
	d3.select(".medianame").remove();
	
  var mediaName = svg.append("svg:text")
    .attr("x", 50)
    .attr("y", -h + p [2] + 5)
    .attr("dy", "1em")
    .attr("class", "medianame")
    .attr("text-anchor", "right")
    .style("font-size","20px")
    .text(media);
  
  //Adds media logo to chart title
  d3.select(".medialogo").remove();
  
  //replaces spaces and .
	var replacement = function(d) { return d.replace(/\s+/g, '').replace(/\.+/g, '').toLowerCase();};

  var mediaLogo = svg.append("svg:image")
  	.attr("class", "medialogo")
   .attr('x',150)
   .attr('y', p[0] )
   .attr('width', 160)
   .attr('height', 24)
   .attr("xlink:href","img/" + replacement(media) + ".png")

//Sum bar
ySum.domain([0,140]);

dataSum = sum;
stack(dataSum);

stack(dataSum);

console.log("dataSumStack",dataSum);

//Adds the sum stacked bar
groupsSum = svg.selectAll(".sum").data(dataSum);
groupsSum.enter().append("g") //adds groups and asign color to every fill
        .attr("class","sum")
        .style("fill",function(d,i) {
            return color(i);
        });

//Removes rectangles to insert them again (cleans previous drawn rectangles(
groupsSum.selectAll("rect").data(function(d){return d;}).remove();
        
//Adds rectangles the stack bars
rectSum = groupsSum.selectAll("rect").data(function(d){return d;});

rectSum.enter()
  .append("rect")
  .attr("x", 154)
  .attr("y", function(d) { return -ySum(d.y0) - ySum(d.y) + h2 + p2[2] + 30; })
  .attr("width",150)
  .attr("height", function(d) { return ySum(d.y); })
  .style("fill-opacity",1)
  //The tooltip
	.on("mouseover", function(d) {
    div.transition().duration(200).style("opacity", .9);
    div.html("<span style='font-size:24px;'><strong>"  + d.y.toPrecision(3) + "%</span></strong>" + "<br>portadas en total<br><strong>" + d.party + "</strong>")  
			.style("left", (d3.event.pageX + 10) + "px")
			.style("top", (d3.event.pageY + 20) + "px");
	})
	.on("mouseout", function(d) {
    div.transition().duration(500).style("opacity", 0);
	});
	
//Data from CIS on corruption perception
yCIS.domain([0,70]);
var datosCIS = [
	{x:"2013-01-01",y:17.7},
	{x:"2013-02-01",y:40.0},
	{x:"2013-03-01",y:44.5},
	{x:"2013-04-01",y:39.3},
	{x:"2013-05-01",y:30.7},
	{x:"2013-06-01",y:32.5},
	{x:"2013-07-01",y:37.4},
	{x:"2013-08-01",y:37.2},//invented value
	{x:"2013-09-01",y:37.1},
	{x:"2013-10-01",y:31.3},
	{x:"2013-11-01",y:31.8},
	{x:"2013-12-01",y:37.6},
	{x:"2014-01-01",y:39.5},
	{x:"2014-02-01",y:44.2},
	{x:"2014-03-01",y:41.0},
	{x:"2014-04-01",y:36.3},
	{x:"2014-05-01",y:35.7},
	{x:"2014-06-01",y:38.8},
	{x:"2014-07-01",y:41.5},
	{x:"2014-08-01",y:41.9},//invented value
	{x:"2014-09-01",y:42.7},
	{x:"2014-10-01",y:42.3},
	{x:"2014-11-01",y:63.8},
	{x:"2014-12-01",y:60.0},
	{x:"2015-01-01",y:55.5},
	{x:"2015-02-01",y:48.5},
	{x:"2015-03-01",y:50.8},
]
//console.log("datosCIS[2]['x']",x(datosCIS[2]['x']));
//console.log("yCIS(datosCIS[0]['y'])",yCIS(datosCIS[1]['y']));
//console.log("ddd",w/(dataset[0].length));

//Adds CIS line
var barWidth = (w - p[1] - p[3])/(dataset[0].length);
var lineFunc = d3.svg.line()
  .x(function(d,i) { return (i+1)*barWidth-barWidth/2; })
  .y(function(d) {
    return -yCIS(d.y);
  })
  .interpolate('linear');

svg.append('svg:path')
  .attr('d', lineFunc(datosCIS))
  .attr('stroke', '#666')
  .attr('class', 'cis-line')
  .attr('title', 'Corrupcion y fraude como problema (Barometro CIS)')
  .attr('stroke-width', 2)
  .attr('fill', 'none');

//sets group with CIS circles
var circles = svg.append('g').attr('id','circles');

circles.selectAll("circle")
	.data(datosCIS)
	.enter().append("circle")
	.attr("fill", "#666")
	.attr("cx", function(d,i) { return (i+1)*barWidth-barWidth/2; })
	.attr("cy",function(d) { return -yCIS(d.y); })
	.attr("r", function(d) { //do not display circle for months in august (invented values), radios = 0
			if ( d.x == "2013-08-01" || d.x == "2014-08-01") {
				return "0";
			} else {
				return "5";
			}
		}
	)
	//The tooltip
	.on("mouseover", function(d) {
    div.transition().duration(200).style("opacity", .9);
    div.html("<span style='font-size:24px;'><strong>"  + d.y + "%</span></strong>"  + "<br>Corrupción y fraude como problema (bar&oacute;metro CIS)<br>" + d.x )
			.style("left", (d3.event.pageX + 10) + "px")
			.style("top", (d3.event.pageY + 20) + "px");
	})
	.on("mouseout", function(d) {
    div.transition().duration(500).style("opacity", 0);
	});

  // Add y-axis for CIS rules.
  var ruleccis = svg.selectAll("g.rulecis")
      .data(yCIS.ticks(4))
    .enter().append("svg:g")
      .attr("class", "rulecis")
      .attr("transform", function(d) { return "translate(0," + -yCIS(d) + ")"; });

  ruleccis.append("svg:text")
      .attr("x", w - p[1] - p[3] + 5)
      .attr("dy", ".35em")
      .text(d3.format());
	ruleccis.append("svg:text")
			.attr("x", w - p[1] - p[3] + 18)
			.attr("dy", ".35em")
			.text(" %");

//Changes background to none to remove explanation image #datavis
d3.select("body").select("#datavis").style("background","no-repeat url('')");

});
});//end on click
