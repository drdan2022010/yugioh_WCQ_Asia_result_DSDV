const width = 480;
const height = 500;
const radius = Math.min(width, height) / 2;

const svg1 = d3.select("#chart1")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const svg2 = d3.select("#chart2")
    .attr("width", width) 
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const tooltip = d3.select(".tooltip");
const tooltipImage = tooltip.select(".tooltip-image");
const tooltipText = tooltip.select(".tooltip-text");

const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

const labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

const pie = d3.pie()
    .sort(null)
    .value(d => d.topCount);

const pieTop1 = d3.pie()
    .sort(null)
    .value(d => d.top1Count);

d3.csv("piechart.csv").then(data => {
    // Convert numeric values to numbers
    data.forEach(d => {
        d.topCount = +d.topCount;
        d.top1Count = +d.top1Count;
        d.image = d.image;
    });

    const top7 = data.slice(0, 7);
    const othersCount = data.slice(7).reduce((acc, cur) => acc + cur.topCount, 0);
    const othersCountTop1 = data.slice(7).reduce((acc, cur) => acc + cur.top1Count, 0);
    top7.push({deck: "Others", topCount: othersCount, top1Count: othersCountTop1, image: "deck_images/other.jpg"});

    const top1Data = data.filter(d => d.top1Count > 0);

    // Calculate total counts for percentage calculation
    const totalTopCount = d3.sum(top7, d => d.topCount);
    const totalTop1Count = d3.sum(top1Data, d => d.top1Count);

    // Append patterns for each image
    const defs = svg1.append("defs");
    top7.forEach((d, i) => {
        defs.append("pattern")
            .attr("id", `pattern-${i}`)
            .attr("patternUnits", "objectBoundingBox")
            .attr("width", 1)
            .attr("height", 1)
            .append("image")
            .attr("xlink:href", d.image)
            .attr("width", 480)
            .attr("height", 480)
            .attr("preserveAspectRatio", "xMidYMid slice");
    });

    const g1 = svg1.selectAll(".arc")
        .data(pie(top7))
      .enter().append("g")
        .attr("class", "arc");

    g1.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => `url(#pattern-${i})`)
        .on("mouseover", function(event, d) {
            const percentage = ((d.data.topCount / totalTopCount) * 100).toFixed(2);
            tooltip.style("display", "block");
            tooltipImage.attr("src", d.data.image);
            tooltipText.html(`Deck: ${d.data.deck}<br>Top Count: ${d.data.topCount}<br>Percentage: ${percentage}%`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    g1.append("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("dy", ".35em")
        .attr("class", "deck-label")
        .text(d => d.data.deck);

    // Append patterns for the second chart images
    const defs2 = svg2.append("defs");
    top1Data.forEach((d, i) => {
        defs2.append("pattern")
            .attr("id", `pattern2-${i}`)
            .attr("patternUnits", "objectBoundingBox")
            .attr("width", 1)
            .attr("height", 1)
            .append("image")
            .attr("xlink:href", d.image)
            .attr("width", 480)
            .attr("height", 480)
            .attr("preserveAspectRatio", "xMidYMid slice");
    });

    const g2 = svg2.selectAll(".arc")
        .data(pieTop1(top1Data))
      .enter().append("g")
        .attr("class", "arc");

    g2.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => `url(#pattern2-${i})`)
        .on("mouseover", function(event, d) {
            const percentage = ((d.data.top1Count / totalTop1Count) * 100).toFixed(2);
            tooltip.style("display", "block");
            tooltipImage.attr("src", d.data.image);
            tooltipText.html(`Deck: ${d.data.deck}<br>Top 1 Count: ${d.data.top1Count}<br>Percentage: ${percentage}%`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    g2.append("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("dy", ".35em")
        .attr("class", "deck-label")
        .text(d => d.data.deck);
});

// Tooltip for header
const header = document.querySelector(".header");
const headerTooltip = document.querySelector(".header-tooltip");

header.addEventListener("mouseover", () => {
    headerTooltip.style.display = "block";
});

header.addEventListener("mousemove", (event) => {
    headerTooltip.style.left = (event.pageX + 10) + "px";
    headerTooltip.style.top = (event.pageY + 10) + "px";
});

header.addEventListener("mouseout", () => {
    headerTooltip.style.display = "none";
});
