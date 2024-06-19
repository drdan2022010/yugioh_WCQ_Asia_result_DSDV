function loadSpellCSV(svg, width, height, margin) {
    d3.csv("spell.csv").then(data => {
        const parsedData = data.map(d => ({
            name: d.CardName,
            value: +d.IFPickRate
        }));

        svg.selectAll("*").remove();

        const x = d3.scaleLinear()
            .domain([0, d3.max(parsedData, d => d.value)])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(parsedData.map(d => d.name))
            .range([0, height])
            .padding(0.1);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "#f4f4f4")
            .style("border", "1px solid #d4d4d4")
            .style("padding", "5px")
            .style("border-radius", "8px")
            .style("display", "none");

        svg.selectAll(".bar")
            .data(parsedData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("width", 0)
            .attr("y", d => y(d.name))
            .attr("height", y.bandwidth())
            .on("mouseover", function(event, d) {
                tooltip.style("display", "block")
                    .html(`Card: ${d.name}<br>Times Used: ${d.value}`);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("display", "none");
            })
            .transition()
            .duration(1000)
            .attr("width", d => x(d.value));

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d} times`));

        svg.append("g")
            .call(d3.axisLeft(y));
    });
}
