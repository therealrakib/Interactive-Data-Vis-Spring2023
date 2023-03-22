 /* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 20, bottom: 100, left: 100, right: 20 };

/* LOAD DATA */
d3.csv('incomeByYear.csv', d => {
  return {
    year: new Date(+d.Year, 0, 1),
    // country: d.Entity,
    income: +d.Income
  }
}).then(data => {
  console.log('data :>> ', data);

  // SCALES Y as Linear Scale and X as Time Scale as year
    const yScale = d3.scaleLinear()
  .domain([22000, 71000])
  .range([height-margin.bottom,margin.top]);

  const xScale = d3.scaleTime()
  .domain(d3.extent(data, d => d.year))
  .range([margin.left,width-margin.right]);

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  //axis labels for X and Y

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width - margin.right)
    .attr("y", height - margin.bottom/2
    )
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Year");


  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", -height/2)
    .attr("y", margin.left/2)
    .attr("transform", "rotate(-90)")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Median Annual Household Income");

  // BUILD AND CALL AXES

  const xAxis = d3.axisBottom(xScale)
  svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(xAxis);


  const yAxis = d3.axisLeft(yScale)
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);


  // LINE GENERATOR FUNCTION

  const lineGen = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.income))

  // DRAW LINE
  svg.selectAll(".line")
  .data([data]) // data needs to take an []
  .join("path")
  .attr("d", d => lineGen(d))
  .attr("class", 'line')
  .attr("fill", "none")
  .attr("stroke", "black")
  
  // AREA CHART

  svg.append("path")
  .datum(data)
  .attr("fill", "blue")
  .attr("stroke", "black")
  .attr("stroke-width", 1.5)
  .attr("d", d3.area()
    .x(d => xScale(d.year))
    .y0(yScale(22000))
    .y1(d => yScale(d.income))
    )
});