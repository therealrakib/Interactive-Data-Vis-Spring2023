function createFourthChart() {
// set the dimensions and margins of the graph


      const width = document.querySelector('.all-content-center').clientWidth * 0.7; // this will help ensure bar chart is centered
            height = window.innerHeight * 0.5, //reduced height since it looked too long after centering
            margin = { top: 50, bottom: 50, left: 70, right: 80 },
            radius = 5;

// append the svg object to the body of the page
const svg = d3.select("#fourth-container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

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

// Read the data
d3.csv("incomeByRaceNew.csv").then(function(data) {

    // List of groups (here I have one group per column)
    const allGroup = ["Asian", "White", "Hispanic", "Black"]

    // Reformat the data: we need an array of arrays of {x, y} tuples
    const dataReady = allGroup.map( function(grpName) {
      return {
        name: grpName,
        values: data.map(function(d) {
          return {year: d.year, value: +d[grpName]};
        })
      };
    });

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => +d.year))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([20000, d3.max(data, d => Math.max(d.White, d.Asian, d.Hispanic, d.Black))])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

          //adding an area chart for down-payment
          svg.append("path")
             .datum(data)
             .attr("fill", "red")
             .attr("opacity", 0.3)
             .attr("stroke", "black")
             .attr("stroke-width", 0.5)
             .attr("d", d3.area()
                .x(d => x(+d.year))
                .y0(height)
                .y1(d => y(+d["down-payment"]))
                );



// Tooltip mouse functions (mouseover, mouse move and mouseleave)
//copied over from other chart to edit
function mouseover() {
    tooltip
    .style("opacity", 1); //calls in tooltip when mouseover is triggered
    d3.select(this) //this will make the bars change opacity and add a stroke
    .style("stroke", "black")// this helps create an animation type effect that helps see which bar you are viewing
    .style("opacity", 1)
    .style("transition", "0.4s ease-in-out");
  }
  
  function mousemove(event, d) { //mousemove does this cool thing where the tooltip follows you as you are moving the mouse on the bars
    tooltip
      .html(`Year: ${d.year} <br> $${d.value}`)
      .style("left", event.pageX + 15 + "px")
      .style("top", event.pageY - 28 + "px");
  }
  
  
  function mouseleave() {
    tooltip
    .style("opacity", 0);  //takes out tooltip when mouseleave is triggered
    d3.select(this)
      .style("stroke", "white")
      .style("opacity", 1)
  }



    // Add the lines
    const line = d3.line()
      .x(d => x(+d.year))
      .y(d => y(+d.value))
    svg.selectAll("myLines")
      .data(dataReady)
      .join("path")
        .attr("class", d => d.name)
        .attr("d", d => line(d.values))
        .attr("stroke", d => myColor(d.name))
        .style("stroke-width", 3)
        .style("fill", "none")

    // Add the points
    svg
      .selectAll("myDots")
      .data(dataReady)
      .join('g')
        .style("fill", d => myColor(d.name))
        .attr("class", d => d.name)
      .selectAll("myPoints")
      .data(d => d.values)
      .join("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.value))
                .attr("r", 4)
        .attr("stroke", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    // Add a label at the end of each line
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .join('g')
        .append("text")
          .attr("class", d => d.name)
          .datum(d => { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
          .attr("transform", d => `translate(${x(d.value.year)},${y(d.value.value)})`) // Put the text at the position of the last point
          .attr("x", 12) // shift the text a bit more right
          .text(d => d.name)
          .style("fill", d => myColor(d.name))
          .style("font-size", 15)


    //text above legend
    svg.append("text")
    .attr("x", (d,i) => 30 + i*60)
    .attr("y", 20)
    .text("Click On Race To Show/Hide Lines:")
    .style("font-weight", "bold")
    .style("font-size", 15)


    //note about the pink area chart
    svg.append("text")
    .attr("x", width - 250)
    .attr("y", 360)
    .text("Pink area chart represents 20% Down Payment")
    .style("font-weight", "bold")
    .style("font-size", 10)
    .append("tspan")
      .attr("x", width - 250)
      .attr("dy", "1.2em")
      .text("Lines above this chart represents higher affordability")
      .append("tspan")
      .attr("x", width - 250)
      .attr("dy", "1.2em")
      .text("Lines inside this chart represents lower affordability")
    

    // Add a legend (interactive)
    svg
      .selectAll("myLegend")
      .data(dataReady)
      .join('g')
        .append("text")
          .attr('x', (d,i) => 30 + i*60)
          .attr('y', 40)
          .text(d => d.name)
          .style("fill", d => myColor(d.name))
          .style("font-size", 15)
        .on("click", function(event, d){
          // is the element currently visible ?
          currentOpacity = d3.selectAll("." + d.name).style("opacity")
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
        })
})
}

createFourthChart();