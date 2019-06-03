function init() {
    // declare width, height and padding variables
    var w = 800;
    var h = 600;
    var legendW = 500;
    var legendH = 50;
    var padding = 60;

    // declare dataset variable to hold data on gender by drug types
    var dataset;

    // read csv file on gender drug consumption
    d3.csv("drug_gender.csv", function(d) {
        return {
            // data processing from csv, assigned new variables parsing to date and integer
            year: d.Years,
            CannMale: parseInt(d.CannMale),
            CannFemale: parseInt(d.CannFemale),
            AmpMale: parseInt(d.AmpMale),
            AmpFemale: parseInt(d.AmpFemale),
            HeroMale: parseInt(d.HeroMale),
            HeroFemale: parseInt(d.HeroFemale),
            CocMale: parseInt(d.CocMale),
            CocFemale: parseInt(d.CocFemale),
            BenMale: parseInt(d.BenMale),
            BenFemale: parseInt(d.BenFemale)
        };
    }).then(function(data) {
        // set dataset with the data from CSV file
        dataset =  data;
        // log dataset in console
        console.log(dataset);

        // function to generate stacked bar chart
        genderBar(dataset);

        // function to generate stacked bar chart legend
        genderBarLegend();
    })
    // catch error if file cannot be read
    .catch(function(error) {
        // log error message in console
        console.log(error);
    });

    function genderBar(dataset) {
        // append svg for stacked bar chart
        var svg = d3.select("#genderBar")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

        // append text for visualisation title
        svg.append("text")
            .attr("x", w / 2)
            .attr("y", 0 + padding/2)
            .attr("text-anchor", "middle")
            .style("font-size", "30px")
            .style("font-weight", "bold")
            .text("Cannabis");

        // year label
        var yearName = ["2008","2009-10","2011-12","2013-14","2015-16"];

        // scalePoint to have custom labels on x-axis
        var xYearScale = d3.scalePoint()
                            .domain(yearName)
                            .range([padding + padding, w - padding - padding]);

        // scaleBand for xScale
        var xScale = d3.scaleBand()
                        .domain(d3.range(dataset.length))
                        .rangeRound([0, w - padding - padding])
                        .paddingInner(0.05);

        // scaleLinear for yScale
        var yScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset, function(d) {
                            return d.CannMale + d.CannFemale;
                        })])
                        .range([h - padding, padding]);

        // declare stack variable with stack functions and keys
        var stack = d3.stack()
                        .keys(["CannMale", "CannFemale"]);

        // put data into stack in series variable
        var series = stack(dataset);

        // color scheme, basic d3 native scheme
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // group all data with different color
        var groups = svg.selectAll("g")
                        .data(series)
                        .enter()
                        .append("g")
                        .style("fill", function(d, i) {
                               return color(i);
                        });

        // append stacked bar, rectangle
        var rects = groups.selectAll("rect")
                            .data(function(d) {
                                return d;
                            })
                            .enter()
                            .append("rect")
                            .attr("x", function(d, i) {
                                return xScale(i) + padding;
                            })
                            .attr("y", function(d, i) {
                                return yScale(d[1]);
                            })
                            .attr("height", function(d) {
                                return yScale(d[0]) - yScale(d[1]);
                            })
                            .attr("width", xScale.bandwidth())
                            .on("mouseover", function(d) {
                                // mouse hovering in effects
                                d3.select(this)
                                    .transition()
                                    .duration(250)
                                    .attr("fill", "pink");

                                // x and y variables to set scales for text tooltip positions
                                var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                                var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

                                // append text tooltip when mouse is hovering over, show values of each bar
                                svg.append("text")
                                    .attr("id", "tooltip")
                                    .attr("x", xPosition)
                                    .attr("y", yPosition)
                                    .attr("text-anchor", "middle")
                                    .text(d[1]-d[0]);
                            })
                            .on("mouseout", function() {
                                // mouse hovering out effects
                                d3.select(this)
                                    .transition()
                                    .duration(250)
                                    .attr("fill", function(d) {
                                          return d;
                                    });

                                // select tooltip for removal
                                d3.select("#tooltip")
                                    .remove();
                            })
                            .append("title")    // append title
                            .text(function(d) {
                                // return text of tooltip with values of each bar
                                return "This value is " + (d[1]-d[0]);
                            });

        // create x-axis variable, with 10 ticks minimum according to the xScale
        var xAxis = d3.axisBottom()
                    .ticks(5)
                    .scale(xYearScale);

        // create y-axis variable, with 10 ticks minumum according to the yScale
        var yAxis = d3.axisLeft()
                    .ticks(10)
                    .scale(yScale);

        // append and create the x-axis at the bottom
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis)
            .select(".domain").remove();

        // append x-axis text label
        svg.append("text")
            .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
            .style("text-anchor", "middle")
            .text("Year");

        // append and create the y-axis on the left
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ", 0)")
            .call(yAxis);

        // append y-axis text label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Drug Consumption (Total Number of Person)");

        // when cannabis button is clicked
        d3.select("#cann")
            .on("click", function() {
                // delete all svg elements
                var delBar = svg.selectAll("*").remove();

                // append new text for title svg
                svg.append("text")
                    .attr("x", w / 2)
                    .attr("y", 0 + padding/2)
                    .attr("text-anchor", "middle")
                    .style("font-size", "30px")
                    .style("font-weight", "bold")
                    .text("Cannabis");

                // scaleBand for xScale
                var xScale = d3.scaleBand()
                                .domain(d3.range(dataset.length))
                                .rangeRound([0, w - padding - padding])
                                .paddingInner(0.05);

                // scaleLinear for yScale
                var yScale = d3.scaleLinear()
                                .domain([0, d3.max(dataset, function(d) {
                                    return d.CannMale + d.CannFemale;
                                })])
                                .range([h - padding, padding]);

                // declare stack variable with stack functions and keys
                var stack = d3.stack()
                                .keys(["CannMale", "CannFemale"]);

                // put data into stack in series variable
                var series = stack(dataset);

                // color scheme, basic d3 native scheme
                var color = d3.scaleOrdinal(d3.schemeCategory10);

                // group all data with different color
                var groups = svg.selectAll("g")
                                .data(series)
                                .enter()
                                .append("g")
                                .style("fill", function(d, i) {
                                       return color(i);
                                });

                // append stacked bar, rectangle
                var rects = groups.selectAll("rect")
                                    .data(function(d) {
                                        return d;
                                    })
                                    .enter()
                                    .append("rect")
                                    .attr("x", function(d, i) {
                                        return xScale(i) + padding;
                                    })
                                    .attr("y", function(d, i) {
                                        return yScale(d[1]);
                                    })
                                    .attr("height", function(d) {
                                        return yScale(d[0]) - yScale(d[1]);
                                    })
                                    .attr("width", xScale.bandwidth())
                                    .on("mouseover", function(d) {
                                        // mouse hovering in effects
                                        d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("fill", "pink");

                                        // x and y variables to set scales for text tooltip positions
                                        var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                                        var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

                                        // append text tooltip when mouse is hovering over, show values of each bar
                                        svg.append("text")
                                            .attr("id", "tooltip")
                                            .attr("x", xPosition)
                                            .attr("y", yPosition)
                                            .attr("text-anchor", "middle")
                                            .text(d[1]-d[0]);
                                    })
                                    .on("mouseout", function() {
                                        // mouse hovering out effects
                                        d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("fill", function(d) {
                                                  return d;
                                            });

                                        // select tooltip for removal
                                        d3.select("#tooltip")
                                            .remove();
                                    })
                                    .append("title")    // append title
                                    .text(function(d) {
                                        // return text of tooltip with values of each bar
                                        return "This value is " + (d[1]-d[0]);
                                    });

                // create x-axis variable, with 10 ticks minimum according to the xScale
                var xAxis = d3.axisBottom()
                            .ticks(5)
                            .scale(xYearScale);

                // create y-axis variable, with 10 ticks minumum according to the yScale
                var yAxis = d3.axisLeft()
                            .ticks(10)
                            .scale(yScale);

                // append and create the x-axis at the bottom
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xAxis)
                    .select(".domain").remove();

                // append x-axis text label
                svg.append("text")
                    .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
                    .style("text-anchor", "middle")
                    .text("Year");

                // append and create the y-axis on the left
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ", 0)")
                    .call(yAxis);

                // append y-axis text label
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Drug Consumption (Total Number of Person)");
        });

        // when amphetamine button is clicked
        d3.select("#amp")
            .on("click", function() {
                // delete all svg elements
                var delBar = svg.selectAll("*").remove();

                // append new text for title svg
                svg.append("text")
                    .attr("x", w / 2)
                    .attr("y", 0 + padding/2)
                    .attr("text-anchor", "middle")
                    .style("font-size", "30px")
                    .style("font-weight", "bold")
                    .text("Amphetamine");

                // scaleBand for xScale
                var xScale = d3.scaleBand()
                                .domain(d3.range(dataset.length))
                                .rangeRound([0, w - padding - padding])
                                .paddingInner(0.05);

                // scaleLinaer for yScale
                var yScale = d3.scaleLinear()
                                .domain([0, d3.max(dataset, function(d) {
                                    return d.AmpMale + d.AmpFemale;
                                })])
                                .range([h - padding, padding]);

                // declare stack variable with stack functions and keys
                var stack = d3.stack()
                                .keys(["AmpMale", "AmpFemale"]);

                // put data into stack in series variable
                var series = stack(dataset);

                // color scheme, basic d3 native scheme
                var color = d3.scaleOrdinal(d3.schemeCategory10);

                // group all data with different color
                var groups = svg.selectAll("g")
                                .data(series)
                                .enter()
                                .append("g")
                                .style("fill", function(d, i) {
                                       return color(i);
                                });

                // append stacked bar, rectangle
                var rects = groups.selectAll("rect")
                                    .data(function(d) {
                                        return d;
                                    })
                                    .enter()
                                    .append("rect")
                                    .attr("x", function(d, i) {
                                        return xScale(i) + padding;
                                    })
                                    .attr("y", function(d, i) {
                                        return yScale(d[1]);
                                    })
                                    .attr("height", function(d) {
                                        return yScale(d[0]) - yScale(d[1]);
                                    })
                                    .attr("width", xScale.bandwidth())
                                    .on("mouseover", function(d) {
                                        // mouse hovering in effects
                                        d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("fill", "pink");

                                        // x and y variables to set scales for text tooltip positions
                                        var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                                        var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

                                        // append text tooltip when mouse is hovering over, show values of each bar
                                        svg.append("text")
                                            .attr("id", "tooltip")
                                            .attr("x", xPosition)
                                            .attr("y", yPosition)
                                            .attr("text-anchor", "middle")
                                            .text(d[1]-d[0]);
                                    })
                                    .on("mouseout", function() {
                                        // mouse hovering out effects
                                        d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("fill", function(d) {
                                                  return d;
                                            });

                                        // select tooltip for removal
                                        d3.select("#tooltip")
                                            .remove();
                                    })
                                    .append("title")    // append title
                                    .text(function(d) {
                                        // return text of tooltip with values of each bar
                                        return "This value is " + (d[1]-d[0]);
                                    });

                // create x-axis variable, with 10 ticks minimum according to the xScale
                var xAxis = d3.axisBottom()
                            .ticks(5)
                            .scale(xYearScale);

                // create y-axis variable, with 10 ticks minumum according to the yScale
                var yAxis = d3.axisLeft()
                            .ticks(10)
                            .scale(yScale);

                // append and create the x-axis at the bottom
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xAxis)
                    .select(".domain").remove();

                // append x-axis text label
                svg.append("text")
                    .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
                    .style("text-anchor", "middle")
                    .text("Year");

                // append and create the y-axis on the left
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ", 0)")
                    .call(yAxis);

                // append y-axis text label
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Drug Consumption (Total Number of Person)");
        });

        // when heroin button is clicked
        d3.select("#hero")
            .on("click", function() {
                // delete all svg elements
                var delBar = svg.selectAll("*").remove();

                // append new text for title svg
                svg.append("text")
                    .attr("x", w / 2)
                    .attr("y", 0 + padding/2)
                    .attr("text-anchor", "middle")
                    .style("font-size", "30px")
                    .style("font-weight", "bold")
                    .text("Heroin");

                // scaleBand for xScale
                var xScale = d3.scaleBand()
                                .domain(d3.range(dataset.length))
                                .rangeRound([0, w - padding - padding])
                                .paddingInner(0.05);

                // scaleLinear for yScale
                var yScale = d3.scaleLinear()
                                .domain([0, d3.max(dataset, function(d) {
                                    return d.HeroMale + d.HeroFemale;
                                })])
                                .range([h - padding, padding]);

                // declare stack variable with stack functions and keys
                var stack = d3.stack()
                                .keys(["HeroMale", "HeroFemale"]);

                // put data into stack in series variable
                var series = stack(dataset);

                // color scheme, basic d3 native scheme
                var color = d3.scaleOrdinal(d3.schemeCategory10);

                // group all data with different color
                var groups = svg.selectAll("g")
                                .data(series)
                                .enter()
                                .append("g")
                                .style("fill", function(d, i) {
                                       return color(i);
                                });

                // append stacked bar, rectangle
                var rects = groups.selectAll("rect")
                                    .data(function(d) {
                                        return d;
                                    })
                                    .enter()
                                    .append("rect")
                                    .attr("x", function(d, i) {
                                        return xScale(i) + padding;
                                    })
                                    .attr("y", function(d, i) {
                                        return yScale(d[1]);
                                    })
                                    .attr("height", function(d) {
                                        return yScale(d[0]) - yScale(d[1]);
                                    })
                                    .attr("width", xScale.bandwidth())
                                    .on("mouseover", function(d) {
                                        // mouse hovering in effects
                                        d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("fill", "pink");

                                        // x and y variables to set scales for text tooltip positions
                                        var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                                        var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

                                        // append text tooltip when mouse is hovering over, show values of each bar
                                        svg.append("text")
                                            .attr("id", "tooltip")
                                            .attr("x", xPosition)
                                            .attr("y", yPosition)
                                            .attr("text-anchor", "middle")
                                            .text(d[1]-d[0]);
                                    })
                                    .on("mouseout", function() {
                                        // mouse hovering out effects
                                        d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("fill", function(d) {
                                                  return d;
                                            });

                                        // select tooltip for removal
                                        d3.select("#tooltip")
                                            .remove();
                                    })
                                    .append("title")    // append title
                                    .text(function(d) {
                                        // return text of tooltip with values of each bar
                                        return "This value is " + (d[1]-d[0]);
                                    });

                // create x-axis variable, with 10 ticks minimum according to the xScale
                var xAxis = d3.axisBottom()
                            .ticks(5)
                            .scale(xYearScale);

                // create y-axis variable, with 10 ticks minumum according to the yScale
                var yAxis = d3.axisLeft()
                            .ticks(10)
                            .scale(yScale);

                // append and create the x-axis at the bottom
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xAxis)
                    .select(".domain").remove();

                // append x-axis text label
                svg.append("text")
                    .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
                    .style("text-anchor", "middle")
                    .text("Year");

                // append and create the y-axis on the left
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ", 0)")
                    .call(yAxis);

                // append y-axis text label
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Drug Consumption (Total Number of Person)");
        });

        // when cocaine button is clicked
        d3.select("#coc")
            .on("click", function() {
                // delete all svg elements
                var delBar = svg.selectAll("*").remove();

                // append new text for title svg
                svg.append("text")
                    .attr("x", w / 2)
                    .attr("y", 0 + padding/2)
                    .attr("text-anchor", "middle")
                    .style("font-size", "30px")
                    .style("font-weight", "bold")
                    .text("Cocaine");

                // scaleBand for xScale
                var xScale = d3.scaleBand()
                                .domain(d3.range(dataset.length))
                                .rangeRound([0, w - padding - padding])
                                .paddingInner(0.05);

                // scaleLinear for yScale
                var yScale = d3.scaleLinear()
                                .domain([0, d3.max(dataset, function(d) {
                                    return d.CocMale + d.CocFemale;
                                })])
                                .range([h - padding, padding]);

                // declare stack variable with stack functions and keys
                var stack = d3.stack()
                                .keys(["CocMale", "CocFemale"]);

                // put data into stack in series variable
                var series = stack(dataset);

                // color scheme, basic d3 native scheme
                var color = d3.scaleOrdinal(d3.schemeCategory10);

                // group all data with different color
                var groups = svg.selectAll("g")
                                .data(series)
                                .enter()
                                .append("g")
                                .style("fill", function(d, i) {
                                       return color(i);
                                });

                // append stacked bar, rectangle
                var rects = groups.selectAll("rect")
                                    .data(function(d) {
                                        return d;
                                    })
                                    .enter()
                                    .append("rect")
                                    .attr("x", function(d, i) {
                                        return xScale(i) + padding;
                                    })
                                    .attr("y", function(d, i) {
                                        return yScale(d[1]);
                                    })
                                    .attr("height", function(d) {
                                        return yScale(d[0]) - yScale(d[1]);
                                    })
                                    .attr("width", xScale.bandwidth())
                                    .on("mouseover", function(d) {
                                        // mouse hovering in effects
                                        d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("fill", "pink");

                                        // x and y variables to set scales for text tooltip positions
                                        var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                                        var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

                                        // append text tooltip when mouse is hovering over, show values of each bar
                                        svg.append("text")
                                            .attr("id", "tooltip")
                                            .attr("x", xPosition)
                                            .attr("y", yPosition)
                                            .attr("text-anchor", "middle")
                                            .text(d[1]-d[0]);
                                    })
                                    .on("mouseout", function() {
                                        // mouse hovering out effects
                                        d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("fill", function(d) {
                                                  return d;
                                            });

                                        // select tooltip for removal
                                        d3.select("#tooltip")
                                            .remove();
                                    })
                                    .append("title")    // append title
                                    .text(function(d) {
                                        // return text of tooltip with values of each bar
                                        return "This value is " + (d[1]-d[0]);
                                    });

                // create x-axis variable, with 10 ticks minimum according to the xScale
                var xAxis = d3.axisBottom()
                            .ticks(5)
                            .scale(xYearScale);

                // create y-axis variable, with 10 ticks minumum according to the yScale
                var yAxis = d3.axisLeft()
                            .ticks(10)
                            .scale(yScale);

                // append and create the x-axis at the bottom
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xAxis)
                    .select(".domain").remove();

                // append x-axis text label
                svg.append("text")
                    .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
                    .style("text-anchor", "middle")
                    .text("Year");

                // append and create the y-axis on the left
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ", 0)")
                    .call(yAxis);

                // append y-axis text label
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Drug Consumption (Total Number of Person)");
        });

        // when benzodiazepines button is clicked
        d3.select("#ben")
            .on("click", function() {
                // delete all svg elements
                var delBar = svg.selectAll("*").remove();

                // append new text for title svg
                svg.append("text")
                    .attr("x", w / 2)
                    .attr("y", 0 + padding/2)
                    .attr("text-anchor", "middle")
                    .style("font-size", "30px")
                    .style("font-weight", "bold")
                    .text("Benzodiazepines");

                // scaleband for xScale
                var xScale = d3.scaleBand()
                                .domain(d3.range(dataset.length))
                                .rangeRound([0, w - padding - padding])
                                .paddingInner(0.05);

                // scaleLinear for yScale
                var yScale = d3.scaleLinear()
                                .domain([0, d3.max(dataset, function(d) {
                                    return d.BenMale + d.BenFemale;
                                })])
                                .range([h - padding, padding]);

                // declare stack variable with stack functions and keys
                var stack = d3.stack()
                                .keys(["BenMale", "BenFemale"]);

                // put data into stack in series variable
                var series = stack(dataset);

                // color scheme, basic d3 native scheme
                var color = d3.scaleOrdinal(d3.schemeCategory10);

                // group all data with different color
                var groups = svg.selectAll("g")
                                .data(series)
                                .enter()
                                .append("g")
                                .style("fill", function(d, i) {
                                       return color(i);
                                });

                // append stacked bar, rectangle
                var rects = groups.selectAll("rect")
                                    .data(function(d) {
                                        return d;
                                    })
                                    .enter()
                                    .append("rect")
                                    .attr("x", function(d, i) {
                                        return xScale(i) + padding;
                                    })
                                    .attr("y", function(d, i) {
                                        return yScale(d[1]);
                                    })
                                    .attr("height", function(d) {
                                        return yScale(d[0]) - yScale(d[1]);
                                    })
                                    .attr("width", xScale.bandwidth())
                                    .on("mouseover", function(d) {
                                        // mouse hovering in effects
                                        d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("fill", "pink");

                                        // x and y variables to set scales for text tooltip positions
                                        var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                                        var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

                                        // append text tooltip when mouse is hovering over, show values of each bar
                                        svg.append("text")
                                            .attr("id", "tooltip")
                                            .attr("x", xPosition)
                                            .attr("y", yPosition)
                                            .attr("text-anchor", "middle")
                                            .text(d[1]-d[0]);
                                    })
                                    .on("mouseout", function() {
                                        // mouse hovering out effects
                                        d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("fill", function(d) {
                                                  return d;
                                            });

                                        // select tooltip for removal
                                        d3.select("#tooltip")
                                            .remove();
                                    })
                                    .append("title")    // append title
                                    .text(function(d) {
                                        // return text of tooltip with values of each bar
                                        return "This value is " + (d[1]-d[0]);
                                    });

                // create x-axis variable, with 10 ticks minimum according to the xScale
                var xAxis = d3.axisBottom()
                            .ticks(5)
                            .scale(xYearScale);

                // create y-axis variable, with 10 ticks minumum according to the yScale
                var yAxis = d3.axisLeft()
                            .ticks(10)
                            .scale(yScale);

                // append and create the x-axis at the bottom
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xAxis)
                    .select(".domain").remove();

                // append x-axis text label
                svg.append("text")
                    .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
                    .style("text-anchor", "middle")
                    .text("Year");

                // append and create the y-axis on the left
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ", 0)")
                    .call(yAxis);

                // append y-axis text label
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Drug Consumption (Total Number of Person)");
        });

        // function for tween dash for multiple line graph transition, moving left to right
        function tweenDash() {
            // get total length per line
            var length = this.getTotalLength();

            // get the starting and ending values within the total length
            var i = d3.interpolateString("0," + length, length + "," + length);

            // return values for Tween transition
            return function (t) {
                return i(t);
            };
        }
    }

    // append gender stacked bar legend
    function genderBarLegend() {
        // append svg for gender legend
        var svg = d3.select("#genderBarLegend")
                        .append("svg")
                        .attr("width", legendW)
                        .attr("height", legendH);

        // append title for legend
        svg.append("text")
            .attr("x", 80)
            .attr("y", 25)
            .text("Age Groups: ")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append text and color for each stacked bar element
        // append male
        svg.append("circle")
            .attr("cx", 200)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "rgb(31, 119, 180)");
        svg.append("text")
            .attr("x", 210)
            .attr("y", 25)
            .text("Male")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append female
        svg.append("circle")
            .attr("cx", 320)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "rgb(255, 127, 14)");
        svg.append("text")
            .attr("x", 330)
            .attr("y", 25)
            .text("Female")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");
    }
}

window.onload = init;
