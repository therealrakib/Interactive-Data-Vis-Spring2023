/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7;
const height = 500;
margin = 50;

/* LOAD DATA */
d3.csv('squirrelActivities.csv', d3.autoType)
  .then(data => {
console.log("data", data)

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    const xScale = d3.scaleLinear()
    .domain([0, Math.max(...data.map(d => d.count))]) 
    .range([margin,width - margin]) 
    
    const activity = ['running', 'chasing', 'climbing', 'eating', 'foraging'];

    const yScale = d3.scaleBand()
    .domain(activity)
    .range([margin, height - margin])
    .paddingInner(0.2)
    .paddingOuter(0.2);


    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */

    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("height", yScale.bandwidth())
    .attr("width", d=> width - xScale(d.count)) 
    .attr("x", margin)
    .attr("y", d=> yScale(d.activity))

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)


    svg
    .append("g")
    .style("transform", `translate(0px, ${height - margin}px)`) 
    .call(xAxis)
  svg
    .append("g")
    .style("transform", `translate(${margin}px, 0px)`)
    .call(yAxis)

  })

