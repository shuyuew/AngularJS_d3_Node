var app = angular.module('myApp');

app.directive('lineChart', function($window){
   return{
      restrict:'EA',
       link: function(scope, elem, attrs){
       	//console.log(scope.arrdata);
   	    var width=960;
		var height=300;

		var svg = d3.select("#treeByProb")
					.append("svg")
					.attr("width",width)
					.attr("height",height);
		var padding = {left:30, right:30, top:20, bottom:20};

		var data = [];
	    var dataset = [];

		d3.json('http://localhost:4005/projectsdata',function(error, pop){
			

			for(var prop in pop){  //get original json data, contert string to number
				if(pop.hasOwnProperty(prop)){
					data.push(pop[prop])
				}
			}

			//console.log(data);

			var a = d3.nest() //retrive problemtype and sum values put into new a new json data
		          .key(function(d){return d.problemtype;})
		          .rollup(function(d){return d.length;})
                  .entries(data); 

			a.forEach(function(d){ //filter data
			    d.key = +d.key;
			    d.values = +d.values;
			    dataset.push(d.values);
			    dataset.sort(d3.descending);
			})
			var newdataset = dataset.slice(0,10);
			//console.log(dataset);
			console.log(newdataset);

			drawTree();

			function drawTree(){
				/*axis*/
				var xScale = d3.scale.linear()
			        //.domain([0,d3.max(data,function(d){return d.close;})])
			        .domain([0,26000])
			        .range([0,width]);

			    var yScale = d3.scale.linear()
			        .domain([0,100])
			        .range([height-20,0]);

			    var rectHeight = 27; 

				svg.selectAll("rect")
					  .data(newdataset)
					  .enter()
					  .append("rect")
					  .attr("x",60)
					  .attr("y",function(d,i){
							return i * rectHeight;
					  })
					  .attr("width",function(d){
					   		return xScale(d);
					  })
					  .attr("height",rectHeight-4)
					  .attr("fill",function(d){
					  	return "rgb(0,0,"+(Math.ceil(d/50))+")";
					  });
/*
			    svg.selectAll("rect")
			          .append("text")
					  .attr("text-anchor","middle")
					  .text(function(d){
			        	return d.data;
			           })
					  //.attr("font-size",14)
					  .attr("fill","white");*/

			    var axisx = d3.svg.axis()
			                     .scale(xScale)
			                     .orient("bottom")
			                     .ticks(10);
			    svg.append("g")
			       .attr("class","axisx")
			       .attr("transform","translate(60,280)")
			       .call(axisx);

			    var axisy = d3.svg.axis()
			                     .scale(yScale)
			                     .orient("left")
			                     .ticks(10);
			    svg.append("g")
			       .attr("class","axisy")
			       .attr("transform","translate(60,0)")
			       .call(axisy);

			}


		    //create an export button
	        /*d3.select("#Subscribe")
		      .on("click",svgToCanvas);
		    function svgToCanvas(){

		    	var canvas = document.createElement("canvas");
		    	document.body.appendChild(canvas);
		    	canvas.width = 900;
		    	canvas.height = 600;

		    	var svg = d3.select("html")[0][0],
		    	    img = new Image(),
		    	    serializer = new XMLSerializer(),
		    	    SvgStr = serializer.serializeToString(svg);
		    	    console.log(svg);
		    	img.src = 'data:image/svg+xml;base64,'+window.btoa(SvgStr);
		    	
		    	canvas.getContext("2d").drawImage(img,0,0,width,height);

		        };
		        svgToCanvas();*/

		})
	  }
   }
   
});	