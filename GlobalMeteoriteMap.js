//Width and height
            var w = 1200;
            var h = 800;
            var worldCoord = "https://raw.githubusercontent.com/coderHook/globalMap-D3/master/worldMap.geo.json";
            var meteorites = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";
              console.clear();
            var colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'] //qualitatives colorbrewers.

          // define a toolTip
           var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style('opacity', 0);

            //Define map projection
            var projection = d3.geo.mercator()
                                   .translate([w/2, h/2])
                                   .scale([200]);

            //Define path generator
            var path = d3.geo.path()
                             .projection(projection);


            //Lets add a color scale using Colorbrewer

            var color = d3.scale.linear()
                          .domain([0, 900000])
                          .range(colors);

            //Create SVG element
            var svg = d3.select("#map").append("svg").attr({width:w, height: h});
            svg.append("rect")
                .attr({
                  width: w,
                  height: h,
                  fill: "#2c7fb8"
            });

              //Load in GeoJSON data
            d3.json(worldCoord, function(data) {

                //Bind data and create one path per GeoJSON feature
                svg.selectAll("path")
                   .data(data.features)
                   .enter()
                   .append("path")
                   .attr("class", "land")
                   .attr("d", path);


              //Loading all the data sincronized

              d3.json(meteorites, function(meteorite){

                  svg.selectAll("circle")
                      .attr("class", "bubble")
                      .data(meteorite.features.filter(function(d){
                    return d.geometry && d.properties;
                  }))
                      //.sort(function(a, b){ return b.properties.mass - a.properties.mass })
                      .enter()
                      .append("circle")
                      .attr({
                        cx: function(d){ return projection(d.geometry.coordinates)[0];},
                        cy: function(d){ return projection(d.geometry.coordinates)[1];},
                        r: function(d){return Math.sqrt(d.properties.mass*0.00015)},
                        fill: function(d){ return color(d.properties.mass); },
                    "opacity": 0.6

                  })
                  .on("mouseover", function(d){

                    d3.select(this)
                      .attr({
                         r: Math.sqrt(d.properties.mass*0.00020),
                          stroke: '#666'
                    })

                    tooltip.transition()
                          .duration(200)
                          .style("opacity", .85);

                          tooltip.html('<p>Name: ' + d.properties.name +'<br> Mass: ' + d.properties.mass + '<br> Year: ' + d.properties.year.slice(0,4) + '</p>')
                          .style("left", (d3.event.pageX + 40) + "px")
                          .style("top", (d3.event.pageY / 1.2) + "px");
                  })

                  .on("mouseout", function(d){
                    d3.select(this).attr({
                      r: Math.sqrt(d.properties.mass*0.00015),
                      stroke: "none"

                    })

                    tooltip.transition()
                          .duration(100)
                          .style("opacity", 0);
                  })

              });
          });
