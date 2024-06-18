(function() {
    const mapWidth = 800;
    const mapHeight = 800;

    const svg2 = d3.select("#map");
    const g = svg2.append("g");

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", function(event) {
            g.attr("transform", event.transform);
        });

    svg2.call(zoom);

    let path;
    let lastClicked;

    const messageBox = d3.select("#messageBox");

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

            d3.csv("dataMapTopDeck.csv").then(data => {
                const filteredData = data.filter(deck => deck[d.properties.name] > 0);
                filteredData.sort((a, b) => b[d.properties.name] - a[d.properties.name]);
                const topDecks = filteredData.slice(0, 3);
                const topDecksList = d3.select("#topDecks");
                topDecksList.selectAll("li").remove();

                const deckItems = topDecksList.selectAll("li")
                    .data(topDecks)
                    .enter()
                    .append("li")
                    .style("margin-bottom", "10px");

                deckItems.append("p")
                    .text(deck => `${deck.Decks}: ${deck[d.properties.name]}`)
                    .style("margin", "0");

                deckItems.append("img")
                    .attr("src", deck => deck.ImagePath)
                    .attr("alt", deck => deck.Decks)
                    .style("width", "100px")
                    .style("height", "auto")
                    .style("display", "block");
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
                .attr("fill", d => countrySet.has(d.properties.name) ? colorScale(d.properties.name) : "#ccc")
                .attr("stroke", "#333")
                .attr("stroke-width", 0.5)
                .on("click", clicked);

            g.selectAll("text")
                .data(geoData.features)
                .enter().append("text")
                .attr("transform", d => `translate(${path.centroid(d)})`)
                .attr("text-anchor", "middle")
                .style("font-size", "20px")
                .text(d => countrySet.has(d.properties.name) ? d.properties.name : "");
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
