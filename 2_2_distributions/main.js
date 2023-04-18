/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 20, bottom: 50, left: 50, right: 20 },
  radius = 5;

/* LOAD DATA */
d3.csv("incomeData.csv", d3.autoType)
  .then(data => {
    console.log(data)

    /* SCALES */

    //income on y, Year on x
  const yScale = d3.scaleLinear()
  .domain(d3.extent(data, d=>d.income))
  .range([height-margin.bottom,margin.top])

  const xScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.year))
  .range([margin.left,width-margin.right])

  //Democrats as blue. Republicans as Red.
  const colorScale= d3.scaleOrdinal()
  .domain(["2", "1"])
  .range(["red", "blue"])


  //using ideologyScore2020 to dictate size of the dots

  const differenceScale = d3.scaleSqrt()
  .domain([0,d3.max(data.map(d => d.difference))])
  .range([0,100])
  
    /* HTML ELEMENTS */

   //appending to container
    const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  //x and y axes being apended
  
  const xAxis = d3.axisBottom(xScale)
  svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(xAxis);


  const yAxis = d3.axisLeft(yScale)
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  //text being added as label of the axes

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width - margin.right)
    .attr("y", height - margin.bottom/2)
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
    .text("Annual Household Income");


    //scatterplot dots, x corresponds to year, y corresponds to income,
    //radius correspond to income - consumer expenditure difference & filled as Party (D or R)

  const dot = svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.income))
    .attr("r",  d=>differenceScale(d.difference)/2.5)
    .attr("fill", d => colorScale(d.difference_mean))
  });
