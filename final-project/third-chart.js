function createThirdChart() {
    /* CONSTANTS AND GLOBALS */
  const width = document.querySelector('.all-content-center').clientWidth * 0.8; // this will help ensure bar chart is centered
  height = window.innerHeight * 0.5, //reduced height since it looked too long after centering
  margin = { top: 50, bottom: 50, left: 70, right: 70 },
  radius = 5;
  
  // Tooltip being added
  // I searched on Google and went through following tutorial sites (I went through some others but mainly these) to come to the code I used:
  // https://d3-graph-gallery.com/graph/interactivity_tooltip.html
  // https://chartio.com/resources/tutorials/how-to-show-data-on-mouseover-in-d3js/
  // https://gist.github.com/d3noob/a22c42db65eb00d4e369
  
  const tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .attr("class", "tooltip")
  .style("position", "absolute") //tooltip would not show then I searched on Google for similar issues and got the idea here: https://stackoverflow.com/questions/67887686/tooltip-not-showing-only-on-hover
  .style("background-color", "white")
  .style("border", "solid 1px black")
  .style("border-radius", "5px") //border radius make it round which I like
  .style("padding", "5px") //padding added to make text more readable within tooltip
  .style("opacity", 0) //setting initial opacty to 0
  .style("pointer-events", "none") //without this tooltip sometimes doesnt show. I asked a friend for suggestion and he suggested using this which worked
  .style("transition", "opacity 0.2s ease-in-out"); //a little transition looks nice
  
  
  /* LOAD DATA */
  d3.csv("mortgageVSincome-controlled-copy.csv").then(data => {
  data.forEach(d => {
  d.yearstring = +d.Year;
  d.year = new Date(+d.Year, 0, 1);
  d.monthlyMortgage = +d['Monthly Mortgage Payment']; 
  d.monthlyIncome28median = +d['28% of Monthly Income - Median'];
  d.monthlyIncome28minimum = +d['28% of Monthly Income - Minimum Wage'];
  d.monthlyIncome28top1 = +d['28% of Monthly Income - Top 10%'];
  
  
  });
  
  const svg = d3.select("#third-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Create scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.year))
    .range([0, width]);
  
  
  const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => Math.max(d.monthlyMortgage, d.monthlyIncome28median, d.monthlyIncome28minimum, d.monthlyIncome28top1 ))])
  .range([height, 0]);
  
  //a separate scale for ease of annotating
  const xEZScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.yearstring))
    .range([0, width]);
  
  // Create and append axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis)
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .style("text-anchor", "end");
  
  svg.append("g")
  .call(yAxis);
  
  //adding labels to the axes
  
  svg.append("text")
  .attr("class", "axis-label")
  .attr("x", (width - margin.right - margin.left) / 2 + margin.left)
  .attr("y", height - margin.bottom/2 + 70) // need to move year label down for visibility
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .text("Year");
  
  svg.append("text")
  .attr("class", "axis-label")
  .attr("x", -height/2)
  .attr("y", margin.left/200 - 45) // need to move dollars label left for visibility
  .attr("transform", "rotate(-90)")
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .text("Dollars ($)");
  
  
  function mouseover(event, d) {
    tooltip
      .style("opacity", 1)
    
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 0.2);
  }
  
  function mousemove(event, d) {
  tooltip
  .html(`Year: ${d.yearstring}<br><u>Mortgage Elibility Index:</u> <br>Top 10%: ${d.monthlyIncome28top1} <br> Median Income: ${d.monthlyIncome28median}<br>Minimum Wage: ${d.monthlyIncome28minimum}`)
  .style("left", event.pageX + 15 + "px")
  .style("top", event.pageY - 28 + "px");
  }
  
  function mouseleave(d) {
    tooltip
        .style("opacity", 0);
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1)
  }
  
  
  
  // LINE GENERATOR FUNCTION
  
  const lineGenMedian = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.monthlyIncome28median));
  
  const lineGenTopMinimum = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.monthlyIncome28minimum));
  
  const lineGenTop1 = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.monthlyIncome28top1));
  
  
    // DRAW LINE
    svg.append("path")
    .datum(data)
    .attr("d", lineGenMedian)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "black");
  
  svg.append("path")
    .datum(data)
    .attr("d", lineGenTopMinimum)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "blue");
  
  svg.append("path")
    .datum(data)
    .attr("d", lineGenTop1)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "green");
  
    svg.append("line")
     .attr("x1", 0)
     .attr("y1", yScale(100))
     .attr("x2", width)
     .attr("y2", yScale(100))
     .style("stroke", "red")
     .style("stroke-dasharray", "4")
     .style("stroke-width", 2);
      
    //create circles
  
    svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.monthlyIncome28median))
    .attr("r", 4)
    .attr("stroke", "black")
    .attr("fill", "black")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  
  svg.selectAll(".circle-top10")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circle-top10")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.monthlyIncome28minimum))
    .attr("r", 4)
    .attr("stroke", "blue")
    .attr("fill", "blue")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  
  svg.selectAll(".circle-top5")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circle-top5")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.monthlyIncome28top1))
    .attr("r", 4)
    .attr("stroke", "green")
    .attr("fill", "green")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  
      //callout for median income
    
      svg.append("line")
      .attr("class", "callout-line")
      .attr("x1", xEZScale(2008))
      .attr("y1", yScale(105))
      .attr("x2", xEZScale(2008))
      .attr("y2", yScale(150))
      .attr("stroke", "black")
      .attr("stroke-width", 1);
    
      svg.append("text")
      .attr("class", "callout-text")
      .attr("x", xEZScale(2008))
      .attr("y", yScale(150) - 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Since 2008, median income earners")
      .append("tspan")
      .attr("x", xEZScale(2008))
      .attr("dy", "1.2em")
      .text("consistently qualify for mortgage **");
  
  
          //callout for top 10% earners
    
          svg.append("line")
          .attr("class", "callout-line")
          .attr("x1", xEZScale(2003))
          .attr("y1", yScale(291))
          .attr("x2", xEZScale(2003))
          .attr("y2", yScale(325))
          .attr("stroke", "green")
          .attr("stroke-width", 1);
        
          svg.append("text")
          .attr("class", "callout-text")
          .attr("x", xEZScale(2003))
          .attr("y", yScale(325) - 35)
          .attr("text-anchor", "middle")
          .attr("fill", "green")
          .attr("font-size", "12px")
          .text("Top 10% earners have always qualified for mortgage.")
          .append("tspan")
          .attr("x", xEZScale(2003))
          .attr("dy", "1.2em")
          .text("Also the chances of them qualifying continues")
          .append("tspan")
          .attr("x", xEZScale(2003))
          .attr("dy", "1.2em")
          .text("improving faster than median income earners. **");
  
                  //callout for minimum wage earners
    
                  svg.append("line")
                  .attr("class", "callout-line")
                  .attr("x1", xEZScale(2014))
                  .attr("y1", yScale(31))
                  .attr("x2", xEZScale(2014))
                  .attr("y2", yScale(50))
                  .attr("stroke", "blue")
                  .attr("stroke-width", 1);
                
                  svg.append("text")
                  .attr("class", "callout-text")
                  .attr("x", xEZScale(2014))
                  .attr("y", yScale(50) - 20)
                  .attr("text-anchor", "middle")
                  .attr("fill", "blue")
                  .attr("font-size", "12px")
                  .text("Mortgage qualification chances for minimum wage earners")
                  .append("tspan")
                  .attr("x", xEZScale(2014))
                  .attr("dy", "1.2em")
                  .text("have remained pretty much the same in 25 years **");
  
  });
  
  }
  

  createThirdChart();