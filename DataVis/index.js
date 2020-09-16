// Set the dimensions of the canvas / graph

const margin = { top: 10, right: 20, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 470 - margin.top - margin.bottom;

// parse the date / time
const parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
//const xScale = d3.scaleTime().range([0, width]);
const xScale = d3.scaleLog().range([0, width]);

const yScale = d3.scaleLinear().range([height, 0]);

// define the line
const valueline = d3
  .line()
  .x(function (d) {
    //return xScale(d.date);
    return xScale(d.gdpPercap);
  })
  .y(function (d) {
    //return yScale(d.close);
    return yScale(d.lifeExp);
  });

// append the svg object to the body of the page
// append a g (group) element to 'svg' and
// move the g element to the top+left margin
var colorScale = d3.schemeCategory10;

var svg = d3
  //.select("body")
  .select(".center")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Get the data
//d3.csv("data/dates.csv").then((data) => {
d3.tsv("data/gapminderDataFiveYear.tsv").then((data) => {
  // format the data such that strings are converted to their appropriate types
  data.forEach(function (d) {
    //d.date = parseTime(d.date);
    //d.close = +d.close;
    d.gdpPercap = +d.gdpPercap;
    d.lifeExp = +d.lifeExp;
    d.pop = +d.pop;
    //d.year = +d.year;
  });
  // get the point size;
  let sizeOfDot = d3
    .scaleLinear()
    .domain([
      d3.min(data, function (d) {
        return d.pop;
      }),
      d3.max(data, function (d) {
        return d.pop;
      }),
    ])
    .range([4, 10]);

  // Set scale domains based on the loaded data
  xScale.domain(
    d3.extent(data, function (d) {
      //return d.date;
      return d.gdpPercap;
    })
  );
  yScale.domain([
    29,
    d3.max(data, function (d) {
      //return d.close;
      return d.lifeExp;
    }),
  ]);

  // Add the scatter-plot
  svg
    .selectAll("dot")
    //.data(data)
    .data(
      data.filter(function (d) {
        return d.year == 1952 || d.year == 2007; // || d.year == 2007;
      })
    )
    .enter()
    .append("circle")
    .attr("r", (d) => {
      return sizeOfDot(d.pop);
    })
    .attr("cx", function (d) {
      //return xScale(d.date);
      return xScale(d.gdpPercap);
    })
    .attr("cy", function (d) {
      //return yScale(d.close);
      return yScale(d.lifeExp);
    })
    .style("fill", function (d) {
      if (d.year == 1952) return colorScale[0];
      else return colorScale[1];
    })
    .style("opacity", 0.8);

  // Add the axes
  const yAxis = d3.axisLeft(yScale);
  svg.append("g").call(yAxis);
  const xAxis = d3.axisBottom(xScale).ticks(11, "0.0s");
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .style("font-family", "Lato");

  svg
    .append("text")
    .text("GDP per Capita")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14")
    .attr("font-weight", "700")
    .attr("transform", "translate(330, " + (height + 40) + ")");

  svg
    .append("text")
    .text("GDP vs Life Expectancy (1952, 2007)")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16")
    .attr("font-weight", "700")
    .attr("text-decoration", "underline")
    .attr("transform", "translate(" + (width / 2 - 120) + ", " + 10 + ")");

  svg
    .append("text")
    .text("Life Expectancy")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14")
    .attr("font-weight", "700")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2) // "-200px")
    .attr("y", "-30px")
    .style("text-anchor", "middle");

  // Handmade legend
  svg
    .append("rect")
    .attr("x", 690)
    .attr("y", 10)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", colorScale[0]);
  svg
    .append("rect")
    .attr("x", 690)
    .attr("y", 32)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", colorScale[1]);

  svg
    .append("text")
    .attr("x", 716)
    .attr("y", 25)
    .text("1952")
    .style("font-size", "11px")
    .attr("font-family", "sans-serif")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", 716)
    .attr("y", 47)
    .text("2007")
    .style("font-size", "11px")
    .attr("font-family", "sans-serif")
    .attr("alignment-baseline", "middle");
});
//
