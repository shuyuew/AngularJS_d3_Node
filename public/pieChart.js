var app = angular.module('myApp');

app.directive('pieChart', function($window){
   return{
      restrict:'EA',
       link: function(scope, elem, attrs){
	    var width = 400;                       
	    var height = 400; 

	    var svg = d3.select("#pieByProb")
			        .append("svg")                   
			        .attr("width", width)           
			        .attr("height", height);

		var data = [];
	    var dataset = [];

		d3.json('http://localhost:4005/projectsdata',function(error, pop){
			
			for(var prop in pop){  //get original json data, contert string to number
				if(pop.hasOwnProperty(prop)){
					data.push(pop[prop])
				}
			}

			var a = d3.nest() //retrive problemtype and sum values put into new a new json data
		          .key(function(d){return d.problemtype;})
		          .rollup(function(d){return d.length;})
                  .entries(data); 

			a.forEach(function(d){ //filter data
			    d.key = +d.key;
			    d.values = +d.values;
			    dataset.push(d.values);
			    dataset.sort(d3.descending);
			    //dataset.slice(0,10);
			})
			var newdataset = [];
			newdataset = dataset.slice(0,10)
			console.log(dataset.slice(0,10));
			console.log(newdataset);

			drawPie();

			function drawPie(){

				svg.data(newdataset);

			    var pie = d3.layout.pie();
			    var piedata = pie(newdataset);

			    var outerRadius = 150;
			    var innerRadius = 0;

			    var arc = d3.svg.arc()  //arc generater
			                .innerRadius(innerRadius)
			                .outerRadius(outerRadius);

			    var color = d3.scale.category10();  
			    var arcs = svg.selectAll("g")
			               .data(piedata)
			               .enter()
			               .append("g")
			               .attr("transform","translate("+(width/2)+","+(width/2)+")");

			    arcs.append("path")
			        .attr("fill",function(d,i){
			        	return color(i);
			        })           
			        .attr("d",function(d){
			        	return arc(d);
			        });

			    arcs.append("text")
			        .attr("transform",function(d){
			        	return "translate(" + arc.centroid(d) + ")"; 
			        })    
			        .attr("text-anchor","middle")
			        .text(function(d){
			        	return d.data;
			        });
			}

		})
	  }
	}	
   
});	