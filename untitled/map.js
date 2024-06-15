(function() {
    const mapWidth = 800; // Updated width
    const mapHeight = 800; // Updated height

    const svg2 = d3.select("#map");
    const g = svg2.append("g");
    svg2.style("border", "1px solid black");

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", function(event) {
            g.attr("transform", event.transform);
        });

    svg2.call(zoom);

    let path;
    let lastClicked;

    // Create a message box inside the SVG
    const messageBox = svg2.append("foreignObject")
        .attr("x", mapWidth - 200) // Position from the left
        .attr("y", 0) // Position from the top
        .attr("width", 200)
        .attr("height", 600) // Increased height to accommodate more content
        .append("xhtml:div")
        .attr("id", "messageBox")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .style("background-color", "white"); // Ensure visibility against the map

    messageBox.append("xhtml:h3")
        .text("Top 3 Decks");

    const topDecksList = messageBox.append("xhtml:ul")
        .attr("id", "topDecks")
        .style("list-style-type", "none") // Remove default list styling
        .style("padding", "0");

    function clicked(event, d) {
        if (countrySet.has(d.properties.name)) {
            if (lastClicked === d) {
                svg2.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg2.node()).invert([mapWidth / 2, mapHeight / 2])
                );
                lastClicked = null;
            } else {
                const [[x0, y0], [x1, y1]] = path.bounds(d);
                event.stopPropagation();
                svg2.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(mapWidth / 2, mapHeight / 2)
                        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / mapWidth, (y1 - y0) / mapHeight)))
                        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                    d3.pointer(event, svg2.node())
                );
                lastClicked = d;
            }

            // Load the data and update the message box
            d3.csv("dataMapTopDeck.csv").then(data => {
                // Filter out decks with a count of 0 for the clicked country
                const filteredData = data.filter(deck => deck[d.properties.name] > 0);

                // Sort the remaining decks by popularity
                filteredData.sort((a, b) => b[d.properties.name] - a[d.properties.name]);

                // Select the top 3 decks
                const topDecks = filteredData.slice(0, 3);

                // Update the message box with the top 3 decks
                const topDecksList = d3.select("#topDecks");
                topDecksList.selectAll("li").remove(); // Clear the list

                const deckItems = topDecksList.selectAll("li")
                    .data(topDecks)
                    .enter()
                    .append("li")
                    .style("margin-bottom", "10px"); // Add spacing between items

                deckItems.append("p")
                    .text(deck => `${deck.Decks}: ${deck[d.properties.name]}`)
                    .style("margin", "0"); // Remove default margins

                deckItems.append("img")
                    .attr("src", deck => deck.ImagePath)
                    .attr("alt", deck => deck.Decks)
                    .style("width", "100px")
                    .style("height", "auto")
                    .style("display", "block"); // Ensure each image is displayed on a new line
            });
        }
    }

    let countrySet = new Set();
    d3.csv("dataMapTopDeck.csv").then(data => {
        const countryNames = Object.keys(data[0]);
        countryNames.forEach(name => {
            if (name !== "" && name !== "Decks" && name !== "ImagePath") {
                countrySet.add(name);
            }
        });

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        d3.json("asia.json").then(geoData => {
            const projection = d3.geoMercator().fitSize([mapWidth, mapHeight], geoData);
            path = d3.geoPath().projection(projection);

            g.selectAll("path")
                .data(geoData.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", function(d) {
                    return countrySet.has(d.properties.name) ? colorScale(d.properties.name) : "#ccc";
                })
                .attr("stroke", "#333")
                .attr("stroke-width", 0.5)
                .on("click", clicked);

            g.selectAll("text")
                .data(geoData.features)
                .enter().append("text")
                .attr("transform", function(d) {
                    return "translate(" + path.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .style("font-size", "20px") // Set the font size here
                .text(function(d) {
                    return countrySet.has(d.properties.name) ? d.properties.name : "";
                });
        });
    });

    svg2.on("click", function(event) {
        svg2.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg2.node()).invert([mapWidth / 2, mapHeight / 2])
        );
    });
})();
