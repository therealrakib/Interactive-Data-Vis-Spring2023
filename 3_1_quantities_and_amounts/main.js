/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 20, bottom: 50, left: 70, right: 20 },
  radius = 5;

// // since we use our scales in multiple functions, they need global scope
let xScale, yScale;

/* APPLICATION STATE */
let state = {
  data: [],
};

/* LOAD DATA */
d3.csv('housingUnit.csv', d3.autoType)
   .then(raw_data => {
console.log("raw_data", raw_data);
  // save our data to application state
  state.data = raw_data; 
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {

  
  console.log(state.data.map(d => d.state_name))
  /* SCALES */
  xScale = d3.scaleBand()
  .domain(state.data.map(d => d.state_name))
  .range([margin.left, width - margin.right])
  .paddingInner(0.2 )

  yScale = d3.scaleLinear()
  .domain([0, d3.max(state.data, d => d.housing_unit)])
  .range([height - margin.bottom, margin.top]);


  draw(); // calls the draw function
  console.log('svg', svg)
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  /* HTML ELEMENTS */

  const colorScale = d3.scaleOrdinal()
  .domain(["New York", "New Jersey", "Connecticut", "Pennsylvania", "Rhode Island", "Massachusetts"])
  .range(["#FF0000", "#0000FF", "#00FF00", "#FFA500", "#FFFF00", "#000000"]);

  //define svg
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


  svg.append("text")
  .attr("class", "axis-label")
  .attr("x", (width - margin.right - margin.left) / 2 + margin.left)
  .attr("y", height - margin.bottom/2)
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .text("State Name");


svg.append("text")
  .attr("class", "axis-label")
  .attr("x", -height/2)
  .attr("y", margin.left/5)
  .attr("transform", "rotate(-90)")
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .text("Total Housing Units");


  const rect = svg
  .selectAll("rect.bar")
  .data(state.data)
  .join("rect")
  .attr("class", "bar")
  .attr("width",  xScale.bandwidth())
  .attr("x", d => xScale(d.state_name))
  .attr("y", d => yScale(d.housing_unit))
  .attr("height",  d => height - margin.bottom -  yScale(d.housing_unit))
  .attr("fill", d => colorScale(d.state_name))


  console.log('svg from draw()', svg)

}