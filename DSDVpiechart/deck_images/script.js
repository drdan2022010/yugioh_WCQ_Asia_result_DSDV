// Background color variable (change this to modify the background color)
const backgroundColor = "#d3d3d3"; // Light gray

// Set background color of the body
d3.select("body").style("background-color", backgroundColor);

// Dataset
const data = [
    { deck: "Snake-eyes", topCount: 38, top1Count: 6, image: "images/image1.jpg" },
    { deck: "Tenpai Dragon", topCount: 21, top1Count: 1, image: "images/image2.jpg" },
    { deck: "Yubel", topCount: 7, top1Count: 2, image: "images/image3.jpg" },
    { deck: "Voiceless Voice", topCount: 7, top1Count: 1, image: "images/image4.jpg" },
    { deck: "Fire King", topCount: 5, top1Count: 0, image: "images/image5.jpg" }
];

// Define dimensions and radius for the pie charts
const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;

// Define color scales
const colorScale1 = d3.scaleOrdinal(d3.schemeCategory10);
const colorScale2 = d3.scaleOrdinal(d3.schemeCategory10);

// Define pie and arc generators
const pie = d3.pie().value(d => d.value);
const arc = d3.arc().innerRadius(0).outerRadius(radius);

// Create SVG containers
const svg1 = d3.select("#chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

const svg2 = d3.select("#chart2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Define tooltip
const tooltip = d3.select(".tooltip");

// Prepare data for the pie charts
const topCountData = data.map(d => ({ deck: d.deck, value: d.topCount, image: d.image }));
const top1CountData = data.map(d => ({ deck: d.deck, value: d.top1Count, image: d.image }));

// Function to handle mouseover
const handleMouseOver = (event, d) => {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(`${d.data.deck}: ${d.data.value}`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    
    // Update image
    d3.select("#deckImage")
        .attr("src", d.data.image)
        .attr("alt", d.data.deck);
};

// Function to handle mouseout
const handleMouseOut = d => {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    
    // Clear image
    d3.select("#deckImage")
        .attr("src", "")
        .attr("alt", "");
};

// Draw the first pie chart
svg1.selectAll("path")
    .data(pie(topCountData))
    .enter().append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => colorScale1(i))
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

// Draw the second pie chart
svg2.selectAll("path")
    .data(pie(top1CountData))
    .enter().append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => colorScale2(i))
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
