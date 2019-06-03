function init() {
    // declare width, height and padding variables
    var w = 620;
    var h = 500;
    var legendW = 500;
    var legendH = 50;
    var titleW = 500;
    var titleH = 50;
    var padding = 60;

    // two dataset variables for drug consumption and death
    var dataset;
    var dataset2;

    // read csv file on drug consumption
    d3.csv("drug_intake.csv", function(d) {
        return {
            // data processing from csv, assigned new variables parsing to date and integer
            year: new Date(d.Years, 0),
            Cann1820: parseInt(d.Cann1820),
            Cann2125: parseInt(d.Cann2125),
            Cann2630: parseInt(d.Cann2630),
            Cann3135: parseInt(d.Cann3135),
            Cann36: parseInt(d.Cann36),
            Amp1820: parseInt(d.Amp1820),
            Amp2125: parseInt(d.Amp2125),
            Amp2630: parseInt(d.Amp2630),
            Amp3135: parseInt(d.Amp3135),
            Amp36: parseInt(d.Amp36),
            Hero1820: parseInt(d.Hero1820),
            Hero2125: parseInt(d.Hero2125),
            Hero2630: parseInt(d.Hero2630),
            Hero3135: parseInt(d.Hero3135),
            Hero36: parseInt(d.Hero36),
            Coc1820: parseInt(d.Coc1820),
            Coc2125: parseInt(d.Coc2125),
            Coc2630: parseInt(d.Coc2630),
            Coc3135: parseInt(d.Coc3135),
            Coc36: parseInt(d.Coc36),
            Ben1820: parseInt(d.Ben1820),
            Ben2125: parseInt(d.Ben2125),
            Ben2630: parseInt(d.Ben2630),
            Ben3135: parseInt(d.Ben3135),
            Ben36: parseInt(d.Ben36)
        };
    }).then(function(data) {
        // set dataset with the data from CSV file
        dataset =  data;
        // log dataset in console
        console.log(dataset);
        // read another csv file on drug-induced death
        d3.csv("drug_death.csv", function(d) {
            return {
                // data processing from csv, assigned new variables parsing to date and integer
                date: new Date(+d.Year, 0),
                CannDeathAll: parseInt(d.CannDeathAll),
                AmpDeath1524: parseInt(d.AmpDeath1524),
                AmpDeath2534: parseInt(d.AmpDeath2534),
                AmpDeath3544: parseInt(d.AmpDeath3544),
                AmpDeath4554: parseInt(d.AmpDeath4554),
                AmpDeath55: parseInt(d.AmpDeath55),
                HeroDeath1524: parseInt(d.HeroDeath1524),
                HeroDeath2534: parseInt(d.HeroDeath2534),
                HeroDeath3544: parseInt(d.HeroDeath3544),
                HeroDeath4554: parseInt(d.HeroDeath4554),
                HeroDeath55: parseInt(d.HeroDeath55),
                CocDeathAll: parseInt(d.CocDeathAll),
                BenDeathAll: parseInt(d.BenDeathAll)
            };
        }).then(function(data) {
            // set dataset with the data from CSV file
            dataset2 =  data;
            // log dataset in console
            console.log(dataset2);
            // call function to create multiple line chart
            intakeLineChart(dataset, dataset2);

            // call functions to create legends for multiple line chart
            intakeLegend();
            deathLineLegend();
        })
        // catch error if file cannot be read
        .catch(function(error) {
            // log error message in console
            console.log(error);
        });
    })
    // catch error if file cannot be read
    .catch(function(error) {
        // log error message in console
        console.log(error);
    });

    // function to generate multiple line chart
    function intakeLineChart(dataset, dataset2) {
        // append svg for title of visualisation
        var svgTitle = d3.select("#svgTitle")
                        .append("svg")
                        .attr("width", titleW)
                        .attr("height", titleH);

        // append svg for drug consumption visualisation
        var svg = d3.select("#intakeLine")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

        // append svg for drug death visualisation
        var svg2 = d3.select("#deathLine")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

        // append text to title svg
        svgTitle.append("text")
            .attr("x", titleW / 2)
            .attr("y", 0 + padding/2)
            .attr("text-anchor", "middle")
            .style("font-size", "30px")
            .style("font-weight", "bold")
            .text("Cannabis");

        // year label
        var yearName = ["2008","2009-10","2011-12","2013-14","2015-16"];\

        // scalePoint to have custom labels on x-axis
        var xYearScale = d3.scalePoint()
                            .domain(yearName)
                            .range([padding, w - padding]);

        // scaleTime for year
        var xScale = d3.scaleTime()
                    .domain([
                        d3.min(dataset, function(d) { return d.year; }),
                        d3.max(dataset, function(d) { return d.year; })
                    ])
                    .range([padding, w - padding]);

        // scaleLinear  for yScale
        var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, function(d) { return d.Cann36; })])
                    .range([h - padding, padding]);

        // using scaleTime for date variables
        var xDeathScale = d3.scaleTime()
                        .domain([
                            d3.min(dataset2, function(d) { return d.date; }),
                            d3.max(dataset2, function(d) { return d.date; })
                        ])
                        .range([padding, w - padding]);

        // scaleLinear for yScale
        var yDeathScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset2, function(d) { return d.CannDeathAll; })])
                        .range([h - padding, padding]);

        // line variables with x and y values of date and number
        var line = d3.line()
                    .x(function(d) { return xScale(d.year); })
                    .y(function(d) { return yScale(d.Cann1820) ; });

        // append path with datum to bind single path element
        svg.append("path")
            .datum(dataset)
            .attr("class", "line1820")
            .attr("d", line)
            .transition()
            .duration(1000)
            .attrTween("stroke-dasharray", tweenDash);

        // line variables with x and y values of date and number
        var line = d3.line()
                    .x(function(d) { return xScale(d.year); })
                    .y(function(d) { return yScale(d.Cann2125) ; });

        // append path with datum to bind single path element
        svg.append("path")
            .datum(dataset)
            .attr("class", "line2125")
            .attr("d", line)
            .transition()
            .duration(1000)
            .attrTween("stroke-dasharray", tweenDash);

        // line variables with x and y values of date and number
        var line = d3.line()
                    .x(function(d) { return xScale(d.year); })
                    .y(function(d) { return yScale(d.Cann2630) ; });

        // append path with datum to bind single path element
        svg.append("path")
            .datum(dataset)
            .attr("class", "line2630")
            .attr("d", line)
            .transition()
            .duration(1000)
            .attrTween("stroke-dasharray", tweenDash);

        // line variables with x and y values of date and number
        var line = d3.line()
                    .x(function(d) { return xScale(d.year); })
                    .y(function(d) { return yScale(d.Cann3135) ; });

        // append path with datum to bind single path element
        svg.append("path")
            .datum(dataset)
            .attr("class", "line3135")
            .attr("d", line)
            .transition()
            .duration(1000)
            .attrTween("stroke-dasharray", tweenDash);

        // line variables with x and y values of date and number
        var line = d3.line()
                    .x(function(d) { return xScale(d.year); })
                    .y(function(d) { return yScale(d.Cann36) ; });

        // append path with datum to bind single path element
        svg.append("path")
            .datum(dataset)
            .attr("class", "line36")
            .attr("d", line)
            .transition()
            .duration(1000)
            .attrTween("stroke-dasharray", tweenDash);

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
            .call(xAxis);

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

        // line variables with x and y values of date and number
        var lineDeath = d3.line()
                        .x(function(d) { return xDeathScale(d.date); })
                        .y(function(d) { return yDeathScale(d.CannDeathAll) ; });

        // append path with datum to bind single path element
        svg2.append("path")
            .datum(dataset2)
            .attr("class", "lineDeathAll")
            .attr("d", lineDeath)
            .transition()
            .duration(1000)
            .attrTween("stroke-dasharray", tweenDash);

        // create x-axis variable, with 10 ticks minimum according to the xScale
        var xDeathAxis = d3.axisBottom()
                        .ticks(10)
                        .scale(xDeathScale);

        // create y-axis variable, with 10 ticks minumum according to the yScale
        var yDeathAxis = d3.axisLeft()
                        .ticks(10)
                        .scale(yDeathScale);

        // append and create the x-axis at the bottom
        svg2.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xDeathAxis);

        // append x-axis text label
        svg2.append("text")
            .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
            .style("text-anchor", "middle")
            .text("Year");

        // append and create the y-axis on the left
        svg2.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ", 0)")
            .call(yDeathAxis);

        // append y-axis text label
        svg2.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Drug Death (Total Number of Person)");

        // when cannabis button is clicked
        d3.select("#cann")
            .on("click", function() {
                // delete title
                var delTitle = svgTitle.selectAll("*").remove();

                // append new text for title svg
                svgTitle.append("text")
                        .attr("x", titleW / 2)
                        .attr("y", 0 + padding/2)
                        .attr("text-anchor", "middle")
                        .style("font-size", "30px")
                        .style("font-weight", "bold")
                        .text("Cannabis");

                // delete all drug consumption svg element
                var delLine = svg.selectAll("*").remove();

                // scaleTime for year
                var xScale = d3.scaleTime()
                            .domain([
                                d3.min(dataset, function(d) { return d.year; }),
                                d3.max(dataset, function(d) { return d.year; })
                            ])
                            .range([padding, w - padding]);

                // scaleLinear for yScale
                var yScale = d3.scaleLinear()
                            .domain([0, d3.max(dataset, function(d) { return d.Cann36; })])
                            .range([h - padding, padding]);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Cann1820) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line1820")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Cann2125) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line2125")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Cann2630) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line2630")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Cann3135) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line3135")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Cann36) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line36")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

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
                    .call(xAxis);

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

                // delete all drug death svg elements
                var delDeathLine = svg2.selectAll("*").remove();

                // using scaleTime for date variables
                var xDeathScale = d3.scaleTime()
                                .domain([
                                    d3.min(dataset2, function(d) { return d.date; }),
                                    d3.max(dataset2, function(d) { return d.date; })
                                ])
                                .range([padding, w - padding]);

                // scaleLinear for yScale
                var yDeathScale = d3.scaleLinear()
                                .domain([0, d3.max(dataset2, function(d) { return d.CannDeathAll; })])
                                .range([h - padding, padding]);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.CannDeathAll) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeathAll")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // create x-axis variable, with 10 ticks minimum according to the xScale
                var xDeathAxis = d3.axisBottom()
                                .ticks(10)
                                .scale(xDeathScale);

                // create y-axis variable, with 10 ticks minumum according to the yScale
                var yDeathAxis = d3.axisLeft()
                                .ticks(10)
                                .scale(yDeathScale);

                // append and create the x-axis at the bottom
                svg2.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xDeathAxis);

                // append x-axis text label
                svg2.append("text")
                    .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
                    .style("text-anchor", "middle")
                    .text("Year");

                // append and create the y-axis on the left
                svg2.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ", 0)")
                    .call(yDeathAxis);

                // append y-axis text label
                svg2.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Drug Death (Total Number of Person)");
            });

        // when amphetamine button is clicked
        d3.select("#amp")
            .on("click", function() {
                // delete title svg elements
                var delTitle = svgTitle.selectAll("*").remove();

                // append new text for title svg
                svgTitle.append("text")
                        .attr("x", titleW / 2)
                        .attr("y", 0 + padding/2)
                        .attr("text-anchor", "middle")
                        .style("font-size", "30px")
                        .style("font-weight", "bold")
                        .text("Amphetamine");

                // delete all drug consumption svg elements
                var delLine = svg.selectAll("*").remove();

                // scaleTime for year
                var xScale = d3.scaleTime()
                            .domain([
                                d3.min(dataset, function(d) { return d.year; }),
                                d3.max(dataset, function(d) { return d.year; })
                            ])
                            .range([padding, w - padding]);

                // scaleLinear for yScale
                var yScale = d3.scaleLinear()
                            .domain([0, d3.max(dataset, function(d) { return d.Amp36; })])
                            .range([h - padding, padding]);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Amp1820) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line1820")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Amp2125) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line2125")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Amp2630) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line2630")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Amp3135) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line3135")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Amp36) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line36")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

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
                    .call(xAxis);

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

                // delete all drug death svg elements
                var delDeathLine = svg2.selectAll("*").remove();

                // using scaleTime for date variables
                var xDeathScale = d3.scaleTime()
                                .domain([
                                    d3.min(dataset2, function(d) { return d.date; }),
                                    d3.max(dataset2, function(d) { return d.date; })
                                ])
                                .range([padding, w - padding]);

                // scaleLinear for yScale
                var yDeathScale = d3.scaleLinear()
                                .domain([0, d3.max(dataset2, function(d) { return d.AmpDeath3544; })])
                                .range([h - padding, padding]);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.AmpDeath1524) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeath1524")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.AmpDeath2534) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeath2534")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.AmpDeath3544) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeath3544")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.AmpDeath4554) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeath4554")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.AmpDeath55) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeath55")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // create x-axis variable, with 10 ticks minimum according to the xScale
                var xDeathAxis = d3.axisBottom()
                                .ticks(10)
                                .scale(xDeathScale);

                // create y-axis variable, with 10 ticks minumum according to the yScale
                var yDeathAxis = d3.axisLeft()
                                .ticks(10)
                                .scale(yDeathScale);

                // append and create the x-axis at the bottom
                svg2.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xDeathAxis);

                // append x-axis text label
                svg2.append("text")
                    .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
                    .style("text-anchor", "middle")
                    .text("Year");

                // append and create the y-axis on the left
                svg2.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ", 0)")
                    .call(yDeathAxis);

                // append y-axis text label
                svg2.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Drug Death (Total Number of Person)");
            });

        // when heroin button is clicked
        d3.select("#hero")
            .on("click", function() {
                // delete title svg elements
                var delTitle = svgTitle.selectAll("*").remove();

                // append new text for title svg
                svgTitle.append("text")
                        .attr("x", titleW / 2)
                        .attr("y", 0 + padding/2)
                        .attr("text-anchor", "middle")
                        .style("font-size", "30px")
                        .style("font-weight", "bold")
                        .text("Heroin");

                // delete all drug consumption svg elements
                var delLine = svg.selectAll("*").remove();

                // scaleTime for year
                var xScale = d3.scaleTime()
                            .domain([
                                d3.min(dataset, function(d) { return d.year; }),
                                d3.max(dataset, function(d) { return d.year; })
                            ])
                            .range([padding, w - padding]);

                // scaleLinear for yScale
                var yScale = d3.scaleLinear()
                            .domain([0, d3.max(dataset, function(d) { return d.Hero36; })])
                            .range([h - padding, padding]);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Hero1820) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line1820")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Hero2125) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line2125")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Hero2630) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line2630")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Hero3135) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line3135")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Hero36) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line36")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

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
                    .call(xAxis);

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

                // delete all drug death svg elements
                var delDeathLine = svg2.selectAll("*").remove();

                // using scaleTime for date variables
                var xDeathScale = d3.scaleTime()
                                .domain([
                                    d3.min(dataset2, function(d) { return d.date; }),
                                    d3.max(dataset2, function(d) { return d.date; })
                                ])
                                .range([padding, w - padding]);

                // scaleLinear for yScale
                var yDeathScale = d3.scaleLinear()
                                .domain([0, d3.max(dataset2, function(d) { return d.HeroDeath3544; })])
                                .range([h - padding, padding]);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.HeroDeath1524) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeath1524")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.HeroDeath2534) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeath2534")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.HeroDeath3544) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeath3544")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.HeroDeath4554) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeath4554")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.HeroDeath55) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeath55")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // create x-axis variable, with 10 ticks minimum according to the xScale
                var xDeathAxis = d3.axisBottom()
                                .ticks(10)
                                .scale(xDeathScale);

                // create y-axis variable, with 10 ticks minumum according to the yScale
                var yDeathAxis = d3.axisLeft()
                                .ticks(10)
                                .scale(yDeathScale);

                // append and create the x-axis at the bottom
                svg2.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xDeathAxis);

                // append x-axis text label
                svg2.append("text")
                    .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
                    .style("text-anchor", "middle")
                    .text("Year");

                // append and create the y-axis on the left
                svg2.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ", 0)")
                    .call(yDeathAxis);

                // append y-axis text label
                svg2.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Drug Death (Total Number of Person)");
            });

        // when cocaine button is clicked
        d3.select("#coc")
            .on("click", function() {
                // delete title svg elements
                var delTitle = svgTitle.selectAll("*").remove();

                // append new text for title svg
                svgTitle.append("text")
                        .attr("x", titleW / 2)
                        .attr("y", 0 + padding/2)
                        .attr("text-anchor", "middle")
                        .style("font-size", "30px")
                        .style("font-weight", "bold")
                        .text("Cocaine");

                // delete all drug consumption svg elements
                var delLine = svg.selectAll("*").remove();

                // scaleTime for year
                var xScale = d3.scaleTime()
                            .domain([
                                d3.min(dataset, function(d) { return d.year; }),
                                d3.max(dataset, function(d) { return d.year; })
                            ])
                            .range([padding, w - padding]);

                // scaleLinear for yScale
                var yScale = d3.scaleLinear()
                            .domain([0, d3.max(dataset, function(d) { return d.Coc36; })])
                            .range([h - padding, padding]);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Coc1820) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line1820")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Coc2125) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line2125")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Coc2630) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line2630")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Coc3135) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line3135")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Coc36) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line36")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

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
                    .call(xAxis);

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

                // delete all drug death svg elements
                var delDeathLine = svg2.selectAll("*").remove();

                // using scaleTime for date variables
                var xDeathScale = d3.scaleTime()
                                .domain([
                                    d3.min(dataset2, function(d) { return d.date; }),
                                    d3.max(dataset2, function(d) { return d.date; })
                                ])
                                .range([padding, w - padding]);

                // scaleLinear for yScale
                var yDeathScale = d3.scaleLinear()
                                .domain([0, d3.max(dataset2, function(d) { return d.CocDeathAll; })])
                                .range([h - padding, padding]);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.CocDeathAll) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeathAll")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // create x-axis variable, with 10 ticks minimum according to the xScale
                var xDeathAxis = d3.axisBottom()
                                .ticks(10)
                                .scale(xDeathScale);

                // create y-axis variable, with 10 ticks minumum according to the yScale
                var yDeathAxis = d3.axisLeft()
                                .ticks(10)
                                .scale(yDeathScale);

                // append and create the x-axis at the bottom
                svg2.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xDeathAxis);

                // append x-axis text label
                svg2.append("text")
                    .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
                    .style("text-anchor", "middle")
                    .text("Year");

                // append and create the y-axis on the left
                svg2.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ", 0)")
                    .call(yDeathAxis);

                // append y-axis text label
                svg2.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Drug Death (Total Number of Person)");
            });

        // when benzodiazepines button is clicked
        d3.select("#ben")
            .on("click", function() {
                // delete title svg elements
                var delTitle = svgTitle.selectAll("*").remove();

                // append new text for title svg
                svgTitle.append("text")
                        .attr("x", titleW / 2)
                        .attr("y", 0 + padding/2)
                        .attr("text-anchor", "middle")
                        .style("font-size", "30px")
                        .style("font-weight", "bold")
                        .text("Benzodiazepines");

                // delete all drug consumption svg elements
                var delLine = svg.selectAll("*").remove();

                // scaleTime for year
                var xScale = d3.scaleTime()
                            .domain([
                                d3.min(dataset, function(d) { return d.year; }),
                                d3.max(dataset, function(d) { return d.year; })
                            ])
                            .range([padding, w - padding]);

                // scaleLinear for ySclae
                var yScale = d3.scaleLinear()
                            .domain([0, d3.max(dataset, function(d) { return d.Ben36; })])
                            .range([h - padding, padding]);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Ben1820) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line1820")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Ben2125) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line2125")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Ben2630) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line2630")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Ben3135) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line3135")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // line variables with x and y values of date and number
                var line = d3.line()
                            .x(function(d) { return xScale(d.year); })
                            .y(function(d) { return yScale(d.Ben36) ; });

                // append path with datum to bind single path element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line36")
                    .attr("d", line)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

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
                    .call(xAxis);

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

                // delete all drug death svg elements
                var delDeathLine = svg2.selectAll("*").remove();

                // using scaleTime for date variables
                var xDeathScale = d3.scaleTime()
                                .domain([
                                    d3.min(dataset2, function(d) { return d.date; }),
                                    d3.max(dataset2, function(d) { return d.date; })
                                ])
                                .range([padding, w - padding]);

                // scaleLinear for yScale
                var yDeathScale = d3.scaleLinear()
                                .domain([0, d3.max(dataset2, function(d) { return d.BenDeathAll; })])
                                .range([h - padding, padding]);

                // line variables with x and y values of date and number
                var lineDeath = d3.line()
                                .x(function(d) { return xDeathScale(d.date); })
                                .y(function(d) { return yDeathScale(d.BenDeathAll) ; });

                // append path with datum to bind single path element
                svg2.append("path")
                    .datum(dataset2)
                    .attr("class", "lineDeathAll")
                    .attr("d", lineDeath)
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenDash);

                // create x-axis variable, with 10 ticks minimum according to the xScale
                var xDeathAxis = d3.axisBottom()
                                .ticks(10)
                                .scale(xDeathScale);

                // create y-axis variable, with 10 ticks minumum according to the yScale
                var yDeathAxis = d3.axisLeft()
                                .ticks(10)
                                .scale(yDeathScale);

                // append and create the x-axis at the bottom
                svg2.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xDeathAxis);

                // append x-axis text label
                svg2.append("text")
                    .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 3) + ")")
                    .style("text-anchor", "middle")
                    .text("Year");

                // append and create the y-axis on the left
                svg2.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ", 0)")
                    .call(yDeathAxis);

                // append y-axis text label
                svg2.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Drug Death (Total Number of Person)");
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

    // drug consumption legend
    function intakeLegend() {
        // append svg for drug consumption legend
        var svg = d3.select("#intakeLegend")
                        .append("svg")
                        .attr("width", legendW)
                        .attr("height", legendH);

        // append title of legend
        svg.append("text")
            .attr("x", 0)
            .attr("y", 25)
            .text("Age Groups: ")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append text and color for each line category
        // append 18-20
        svg.append("circle")
            .attr("cx", 90)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "red");
        svg.append("text")
            .attr("x", 100)
            .attr("y", 25)
            .text("18-20")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append 21-25
        svg.append("circle")
            .attr("cx", 170)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "green");
        svg.append("text")
            .attr("x", 180)
            .attr("y", 25)
            .text("21-25")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append 26-30
        svg.append("circle")
            .attr("cx", 240)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "purple");
        svg.append("text")
            .attr("x", 250)
            .attr("y", 25)
            .text("26-30")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append 31-35
        svg.append("circle")
            .attr("cx", 310)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "blue");
        svg.append("text")
            .attr("x", 320)
            .attr("y", 25)
            .text("31-35")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append 36+
        svg.append("circle")
            .attr("cx", 380)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "orange");
        svg.append("text")
            .attr("x", 390)
            .attr("y", 25)
            .text("36+")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");
    }

    // append drug death legend
    function deathLineLegend() {
        // append svg for drug death legend
        var svg = d3.select("#deathLineLegend")
                        .append("svg")
                        .attr("width", legendW)
                        .attr("height", legendH);

        // append title for legend
        svg.append("text")
            .attr("x", 0)
            .attr("y", 25)
            .text("Age Groups: ")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append text and color for each line category
        // append all age
        svg.append("circle")
            .attr("cx", 90)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "slategrey");
        svg.append("text")
            .attr("x", 100)
            .attr("y", 25)
            .text("All Age")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // 15-24
        svg.append("circle")
            .attr("cx", 170)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "red");
        svg.append("text")
            .attr("x", 180)
            .attr("y", 25)
            .text("15-24")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append 25-34
        svg.append("circle")
            .attr("cx", 240)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "green");
        svg.append("text")
            .attr("x", 250)
            .attr("y", 25)
            .text("25-34")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append 35-44
        svg.append("circle")
            .attr("cx", 310)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill", "purple");
        svg.append("text")
            .attr("x", 320)
            .attr("y", 25)
            .text("35-44")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append 45-54
        svg.append("circle")
            .attr("cx", 380)
            .attr("cy",20)
            .attr("r", 6)
            .style("fill", "blue");
        svg.append("text")
            .attr("x", 390)
            .attr("y", 25)
            .text("45-54")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        // append 55+
        svg.append("circle")
            .attr("cx", 450)
            .attr("cy",20)
            .attr("r", 6)
            .style("fill", "orange");
        svg.append("text")
            .attr("x", 460)
            .attr("y", 25)
            .text("55+")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");
    }
}

window.onload = init;
