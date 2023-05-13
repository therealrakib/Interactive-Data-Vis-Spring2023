
function createSecondChart() {
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
  d3.csv("mortgageVSincome.csv").then(data => {
  data.forEach(d => {
  d.year = +d.Year;
  d.monthlyMortgage = +d['Monthly Mortgage Payment']; 
  d.monthlyIncome28 = +d['28% of Monthly Income'];
  });
  
  const svg = d3.select("#second-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Create scales
  const xScale = d3.scaleBand()
  .domain(data.map(d => d.year))
  .range([0, width])
  .padding(0.1);
  
  const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => Math.max(d.monthlyMortgage, d.monthlyIncome28))])
  .range([height, 0]);
  
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
  
      //callout for 1993
  
      svg.append("line")
      .attr("class", "callout-line-2005")
      .attr("x1", xScale(1993))
      .attr("y1", yScale(729))
      .attr("x2", xScale(1993))
      .attr("y2", yScale(1000))
      .attr("stroke", "black")
      .attr("stroke-width", 1);
    
      svg.append("text")
      .attr("class", "callout-text")
      .attr("x", xScale(1995))
      .attr("y", yScale(1000) - 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("1993 marked the first year in history")
      .append("tspan")
      .attr("x", xScale(1995))
      .attr("dy", "1.2em")
      .text("that the median income American")
      .append("tspan")
      .attr("x", xScale(1995))
      .attr("dy", "1.2em")
      .text("could qualify for a mortgage **");
  
          //callout for 2004
  
          svg.append("line")
          .attr("class", "callout-line-2005")
          .attr("x1", xScale(2004))
          .attr("y1", yScale(1042))
          .attr("x2", xScale(2004))
          .attr("y2", yScale(1300))
          .attr("stroke", "black")
          .attr("stroke-width", 1);
        
          svg.append("text")
          .attr("class", "callout-text")
          .attr("x", xScale(2004))
          .attr("y", yScale(1300) - 35)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .text("Things worsened before the 2007-08 Financial Crisis")
          .append("tspan")
          .attr("x", xScale(2004))
          .attr("dy", "1.2em")
          .text("mainly as home prices soared (the housing bubble)")
          .append("tspan")
          .attr("x", xScale(2004))
          .attr("dy", "1.2em")
          .text("as subprime mortgages drove demand and spending. **");
  
  // Tooltip mouse functions (mouseover, mouse move and mouseleave)
  function mouseover() {
  tooltip
  .style("opacity", 1);
  d3.select(this)
  .style("stroke", "black")
  .style("opacity", 1);
  }
  
  function mousemove(event, d) {
  tooltip
  .html(`Year: ${d.year}<br>Monthly Mortgage Payment: $${d.monthlyMortgage}<br>28% of Monthly Income: $${d.monthlyIncome28}`)
  .style("left", event.pageX + 15 + "px")
  .style("top", event.pageY - 28 + "px");
  }
  
  function mouseleave() {
  tooltip
  .style("opacity", 0)
  d3.select(this)
  .style("stroke", "none")
  .style("opacity", 0.7)
  }
  
  // Add bars for downpayment
  
  // Add bars for income
  svg.selectAll(".mortgage-bar")
  .data(data)
  .join("rect")
  .attr("class", "mortgage-bar") 
  .attr("x", d => xScale(d.year))
  .attr("y", d => yScale(d.monthlyMortgage)) 
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.monthlyMortgage))
  .attr("fill", "red")
  .style("opacity", 0.7) // opacity for income
  .on("mouseover", mouseover) //event listener for mouseover
  .on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
  .on("mouseleave", mouseleave); //event listener for mouseleave
  
  svg.selectAll(".income28-bar")
  .data(data)
  .join("rect")
  .attr("class", "income28-bar")
  .attr("x", d => xScale(d.year))
  .attr("y", d => yScale(d.monthlyIncome28)) 
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.monthlyIncome28)) 
  .attr("fill", "blue")
  .style("opacity", 0.7) // 70% opacity can help improve understanding a bit
  .on("mouseover", mouseover) //event listener for mouseover
  .on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
  .on("mouseleave", mouseleave); //event listener for mouseleave
  
  
  });
  
  }
  

  createSecondChart();