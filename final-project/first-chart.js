//When the code works: ৻(  •̀ ᗜ •́  ৻)
//When the code doesn't work: (ಡ艸ಡ)

//I overall really like the site d3-graph-gallery.com.
//Simply easy to understand code that can be replicated and played with

function createFirstChart() {

/* CONSTANTS AND GLOBALS */
const width = document.querySelector('.all-content-center').clientWidth * 0.8; // this will help ensure bar chart is centered
      height = window.innerHeight * 0.5, //reduced height since it looked too long after centering
      margin = { top: 50, bottom: 50, left: 70, right: 70 },
      radius = 5;

// Tooltip being added
// I searched on Google and went through following tutorial sites (I went through some others but mainly these) to come to the code I used:
// https://d3-graph-gallery.com/graph/interactivity_tooltip.html (this is primarily where I learnt to use the tooltip)
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
        .style("pointer-events", "none") //without this tooltip sometimes doesnt show. I asked a friend for suggestion and he suggested using this which worked
        .style("opacity", 0) //setting initial opacty to 0
        .style("transition", "opacity 0.2s ease-in-out"); //a little transition looks nice
      

/* LOAD DATA */
d3.csv("incomeHousing.csv").then(data => {
  data.forEach(d => {
    d.year = +d.Year;
    d.income = +d['Annual Median Household Income'];
    d.downPayment = +d['Down Payment (20%)'];
  });

  const svg = d3.select("#container")
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
    .domain([0, 80000])
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

  // Tooltip mouse functions (mouseover, mouse move and mouseleave)
  function mouseover() {
    tooltip
    .style("opacity", 1); //calls in tooltip when mouseover is triggered
    d3.select(this) //this will make the bars change opacity and add a stroke
    .style("stroke", "black")// this helps create an animation type effect that helps see which bar you are viewing
    .style("opacity", 1);
  }
  
  function mousemove(event, d) { //mousemove does this cool thing where the tooltip follows you as you are moving the mouse on the bars
    tooltip
      .html(`Year: ${d.year}<br>Income: $${d.income}<br>Down Payment: $${d.downPayment}`) //information that will show when hovering over a bar
      .style("left", event.pageX + 15 + "px")
      .style("top", event.pageY - 28 + "px");
  }
  
  
  function mouseleave() {
    tooltip
    .style("opacity", 0)  //takes out tooltip when mouseleave is triggered
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.7)
  }

  //callout for 2007-2008 financial crisis
  //adding line for a callout I want to add
  svg.append("line")
  .attr("class", "callout-line")
  .attr("x1", xScale(2007))
  .attr("y1", yScale(50233))
  .attr("x2", xScale(2007))
  .attr("y2", yScale(60000))
  .attr("stroke", "black")
  .attr("stroke-width", 1);

  //adding the actual text for the callout
  svg.append("text")
  .attr("class", "callout-text")
  .attr("x", xScale(2007))
  .attr("y", yScale(60000) - 20)
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .text("The 2007-2008 Financial Crisis")
  .append("tspan") // source: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/tspan
  .attr("x", xScale(2007))
  .attr("dy", "1.2em")
  .text("momentarily made things better");

  //callout for 2005

  svg.append("line")
  .attr("class", "callout-line-2005")
  .attr("x1", xScale(2005))
  .attr("y1", yScale(48180))
  .attr("x2", xScale(1998))
  .attr("y2", yScale(50000))
  .attr("stroke", "black")
  .attr("stroke-width", 1);

  svg.append("text")
  .attr("class", "callout-text")
  .attr("x", xScale(1998))
  .attr("y", yScale(50000) - 35)
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .text("2005 marked the first year")
  .append("tspan")
  .attr("x", xScale(1998))
  .attr("dy", "1.2em")
  .text("that down payment overtook income")
  .append("tspan")
  .attr("x", xScale(1998))
  .attr("dy", "1.2em")
  .text("in US history");

    //callout for 2019

    svg.append("line")
    .attr("class", "callout-line-2005")
    .attr("x1", xScale(2019))
    .attr("y1", yScale(66000))
    .attr("x2", xScale(2016))
    .attr("y2", yScale(70000))
    .attr("stroke", "black")
    .attr("stroke-width", 1);
  
    svg.append("text")
    .attr("class", "callout-text")
    .attr("x", xScale(2015))
    .attr("y", yScale(70000) - 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text("Things started improving again in 2019.")
    .append("tspan")
    .attr("x", xScale(2015))
    .attr("dy", "1.2em")
    .text("However, since the pandemic, home prices")
    .append("tspan")
    .attr("x", xScale(2015))
    .attr("dy", "1.2em")
    .text("had the highest jump in history");
  

  // Add bars for income
  svg.selectAll(".income-bar")
    .data(data)
    .join("rect")
    .attr("class", "income-bar")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.income))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.income))
    .attr("fill", "blue")
    .style("opacity", 0.7) // opacity for income
    .on("mouseover", mouseover) //event listener for mouseover
    .on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
    .on("mouseleave", mouseleave); //event listener for mouseleave

  // Add bars for downpayment
  

      svg.selectAll(".downpayment-bar")
         .data(data)
         .join("rect")
         .attr("class", "downpayment-bar")
         .attr("x", d => xScale(d.year))
         .attr("y", d => yScale(d.downPayment)) 
         .attr("height", d => height - yScale(d.downPayment)) 
         .attr("width", xScale.bandwidth())
         .attr("fill", "red")
         .style("opacity", 0.7)

         //could not figure out how to start effect on mouse scroll visibility so skipped
         //.transition() // transition effect
         //.duration(800) // how long transition lasts for
         //.attr("y", d => yScale(d.downPayment)) // previous set to 0 and now to actual data
         //.attr("height", d => height - yScale(d.downPayment)) // previous set to 0 and now to actual data
         //.delay((d, i) => i * 100); // adds a slight delay to transition. enables bars to come up one by one
         
         svg.selectAll(".downpayment-bar")
         .on("mouseover", mouseover) //event listener for mouseover
         .on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
         .on("mouseleave", mouseleave); //event listener for mouseleave
  });
}





createFirstChart();