var app = angular.module('myApp');

app.directive('trendingChart', function($window){
   return{
      restrict:'EA',
      replace:true,
       link: function(scope, elem, attrs){

       	//console.log(scope.arr);
		var margin = {top:20,right:20,bottom:30,left:50},
					width=860-margin.left,
					height=400;

	   d3.json('http://localhost:4005/projectsdata',function(error, pop){

	   	  var data = [];
        var dataset = [];
        console.log(pop);

        for(var prop in pop){  //get original json data, contert string to number
            if(pop.hasOwnProperty(prop)){
                data.push(pop[prop])
            }
        }

        var salesDataToPlot = d3.nest() //retrive date and sum values put into new a new json data
                  .key(function(d){return d.date;
                  })
                  .rollup(function(d){return d.length;})
                  .entries(data); 

        salesDataToPlot.forEach(function(d){ //filter data
            d.key = Date.parse(d.key);
            d.values = +d.values;
            dataset.push(d.values);
        })
        console.log(salesDataToPlot);

	   	drawSvgframe();

	   function drawSvgframe(){
		   	var svg = d3.select("#trendingChart")
					.append("svg")
					.attr("width",width+margin.left+margin.right)
					.attr("height",height+margin.top+margin.bottom);
		   var padding = {left:50, right:50, top:20, bottom:20};

           var pathClass="path";
           var xScale, yScale, xAxisGen, yAxisGen, lineFun;

               xScale = d3.time.scale()
                   .domain([salesDataToPlot[0].key, salesDataToPlot[salesDataToPlot.length-1].key])
                   .range([padding.left, width]);

               yScale = d3.scale.linear()
                   .domain([0, d3.max(salesDataToPlot, function (d) {
                       return d.values;
                   })])
                   .range([height, 0]);

               xAxisGen = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom")
                   .tickFormat(d3.time.format("%b %d"));
                   //.ticks(salesDataToPlot.length - 1);
               svg.append("g")
                   .attr("class", "x axis")  
                   .attr("transform", "translate("+0+","+height+")")
                   .call(xAxisGen);

               yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(10);
               svg.append("g")
                   .attr("class", "y axis")
                   .attr("transform", "translate("+padding.left+","+0+")")
                   .call(yAxisGen);

               lineFun = d3.svg.line()
                   .x(function (d) {
                       return xScale(d.key);
                   })
                   .y(function (d) {
                       return yScale(d.values);
                   })
                   .interpolate("linear");
           
         
               svg.append("svg:path")
                   .attr({
                       d: lineFun(salesDataToPlot),
                       "stroke": "blue",
                       "stroke-width": 2,
                       "fill": "none",
                       "class": pathClass
                   });

           var points = svg.selectAll(".MyCricle")
		                .data(salesDataToPlot)
		                .enter()
		                .append("circle")
		                .attr("class","MyCircle")
		                .attr("transform","translate(0,0)")
		                .attr("r",2)
		                .attr("opacity",0)
		                .transition()
		                .duration(2000)
		                .attr("cx",function(d){return xScale(d.key);})
		                .attr("opacity",1)
		                .attr("cy",function(d){return yScale(d.values);});
		   var yInner = d3.svg.axis()
			                  .scale(yScale)
			                  .tickSize(-width,0,0)
			                  .tickFormat("")
			                  .orient("left")
			                  .ticks(10);
	       var yInnerBar = svg.append("g")
	                          .attr("class","inner_line")
	                          .attr("transform","translate(10,-40)")
	                          .call(yInner);
	   } 
    })
   }
 }
});	