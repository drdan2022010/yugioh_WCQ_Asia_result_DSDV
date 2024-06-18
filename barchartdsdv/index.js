const margin = {top: 20, right: 30, bottom: 40, left: 200};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

loadMonsterCSV(svg, width, height, margin);

document.getElementById("csvSelector").addEventListener("change", function() {
    switch(this.value) {
        case 'monster':
            loadMonsterCSV(svg, width, height, margin);
            break;
        case 'spell':
            loadSpellCSV(svg, width, height, margin);
            break;
        case 'trap':
            loadTrapCSV(svg, width, height, margin);
            break;
        case 'extradeck':
            loadExtraDeckCSV(svg, width, height, margin);
            break;
        case 'sidedeck':
            loadSideDeckCSV(svg, width, height, margin);
            break;
        default:
            break;
    }
});