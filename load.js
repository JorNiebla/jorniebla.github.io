// const canvas = document.getElementById('graph-canvas');
// const context = canvas.getContext('2d');
const resultTable = document.querySelector("#dijkstra-table tbody");
const selects = [document.getElementById("node1"),document.getElementById("node2"),document.getElementById("start-node")]
const pesoInput = document.getElementById("pesoInput")
const graphSVG = document.getElementById("graph-svg")
const nodosTable = document.querySelector("#nodes-table tbody");
const aristasTable = document.querySelector("#edges-table tbody");

var graph = {};

var mode = 0

// ------------------------- Algoritmo -----------------------------------------

function runDijkstra() {
    const startNode = selects[2].value;
    const costs = {};
    const processed = [];
    const predecessors = {};

    // Inicializar costos
    for (let node in graph) {
        costs[node] = node === startNode ? 0 : Infinity;
        predecessors[node] = null;
    }

    let node = findLowestCostNode(costs, processed);

    while (node) {
        const cost = costs[node];
        const neighbors = graph[node];

        for (let neighbor in neighbors) {
            const newCost = cost + neighbors[neighbor];
            if (newCost < costs[neighbor]) {
                costs[neighbor] = newCost;
                predecessors[neighbor] = node;
            }
        }

        processed.push(node);
        node = findLowestCostNode(costs, processed);
    }

    displayResults(costs, predecessors);
}

function findLowestCostNode(costs, processed) {
    let lowestCost = Infinity;
    let lowestCostNode = null;

    for (let node in costs) {
        const cost = costs[node];
        if (cost < lowestCost && !processed.includes(node)) {
            lowestCost = cost;
            lowestCostNode = node;
        }
    }

    return lowestCostNode;
}

function displayResults(costs, predecessors) {
    resultTable.innerHTML = "";

    for (let node in costs) {
        const row = document.createElement("tr");

        const nodeCell = document.createElement("td");
        nodeCell.textContent = node;

        const costCell = document.createElement("td");
        costCell.textContent = costs[node] === Infinity ? "∞" : costs[node];

        const predecessorCell = document.createElement("td");
        predecessorCell.textContent = predecessors[node] || "-";

        row.appendChild(nodeCell);
        row.appendChild(costCell);
        row.appendChild(predecessorCell);

        resultTable.appendChild(row);
    }
}

// ------------------------------ Cosas de dibujo ------------------------------
function updateNodesForms(type,n) {
    if (type === 1){
        selects.forEach((s) => s.add(new Option(n)))
    } else if (type === 0){
        console.log("VOY A ELIMINAR")
        console.log(n)
        for (var j = 0; j<selects.length;j++) {
            var s = selects[j]
            for (var i=0; i<s.length;i++){
                console.log("LOOP" + s.options[i].value)
                if(s.options[i].value == n)
                    s.remove(i)
            }
        }
    }
    nodosTable.innerHTML = "";
    for (const [key,v] of Object.entries(graph)) {
        console.log(key)
        row = document.createElement("tr");

        let nodeCell = document.createElement("td")
        nodeCell.textContent = key;
        row.appendChild(nodeCell)

        let buttonCell = document.createElement("td")
        buttonCell.innerHTML = `<button onclick=\"removeNode(\'${key}\')\">Eliminar</button>`
        row.appendChild(buttonCell)

        nodosTable.appendChild(row)
    }
}

function updateEdgesForms() {
    aristasTable.innerHTML = "";
    for (const [key, value] of Object.entries(graph)) {
        for (const [k, v] of Object.entries(value)) {
            row = document.createElement("tr");

            let edgeCell = document.createElement("td")
            edgeCell.textContent = `${key}->${k}: ${v}`;
            row.appendChild(edgeCell)

            let buttonCell = document.createElement("td")
            buttonCell.innerHTML = `<button onclick=\"removeEdge(\'${key}\',\'${k}\')\">Eliminar</button>`
            row.appendChild(buttonCell)
            
            aristasTable.appendChild(row)
        }
    }
}

function removeEdge(n1,n2) {
    delete graph[n1][n2]
    delete graph[n2][n1]
    updateEdgesForms()
    convert2SVG()
    runDijkstra()
}

function removeNode(n1) {
    delete graph[n1]
    for(const [key,value] of Object.entries(graph)) {
        for(const [k,v] of Object.entries(value)) {
            if (k == n1)
                delete graph[key][k]
        }
    }
    updateNodesForms(0,n1)
    updateEdgesForms()
    convert2SVG()
    runDijkstra()
}

const removeNonASCII = (str) => str.replace(/[^\x20-\x7E]/g, "?");

function getlength(number) {
    return number.toString().length;
}

function newNode() {
    var nodename = null
    nodename = window.prompt("¿Como se llamará el nodo?")
    if (nodename != null) {
        cleannodes = removeNonASCII(nodename);
        nodes = cleannodes.split(',')
        nodes.forEach(function(node){
            graph[node] = {}
            updateNodesForms(1,node)
            convert2SVG()
            runDijkstra()
        })
    }
}

function newEdge() {
    let pesoValue = Number(pesoInput.value)
    let node1 = selects[0].value
    let node2 = selects[1].value
    graph[node1][node2]=pesoValue
    graph[node2][node1]=pesoValue
    updateEdgesForms()
    convert2SVG()
    runDijkstra()
}

function convert2SVG() {
    //---------Calcular posiciones----------
    graphL = Object.keys(graph).length
    let nodeCords = {}
    const angle = 2 * Math.PI / graphL
    let i = 0
    graphSVG.innerHTML = ""
    Object.keys(graph).forEach(function(k){
        let temp = [Math.floor(250 + 200 * Math.cos(i * angle + Math.PI)),Math.floor(250 + 200 * Math.sin(i * angle + Math.PI))]
        nodeCords[k] = temp
        i = i + 1
    })

    //Aristas
    var tempgraph = structuredClone(graph)
    for (const [k, v] of Object.entries(tempgraph)) {
        let x1 = nodeCords[k][0]
        let y1 = nodeCords[k][1]
        for (const [j,peso] of Object.entries(v)) {
            delete tempgraph[j][k]
            let x2 = nodeCords[j][0]
            let y2 = nodeCords[j][1]
            let mx = 0
            let my = 0
            if (x1 > x2) {
                mx = Math.floor(((((x1+x2)/2)+x1)/2))
                my = Math.floor(((((y1+y2)/2)+y1)/2))
            } else {
                mx = Math.floor(((((x1+x2)/2)+x2)/2))
                my = Math.floor(((((y1+y2)/2)+y2)/2))
            }
            
            graphSVG.innerHTML += `<line x1=\"${x1}\" y1=\"${y1}\" x2=\"${x2}\" y2=\"${y2}\" stroke=\"black\" stroke-width=\"2\"></line>`
            graphSVG.innerHTML += `<rect x=\"${mx-10}\" y=\"${my-10}\" width=\"${(getlength(peso)-1)*7+25}\" height=\"20\" rx=\"3\" />`
            graphSVG.innerHTML += `<text x=\"${mx-2}\" y=\"${my+5}\" fill=\"red\" style=\"font-family:monospace;font-size:14px;\">${peso}</text>`
        }
    }

    //Nodos
    for (const [k, v] of Object.entries(nodeCords)) {
        let cx = v[0]
        let cy = v[1]
        graphSVG.innerHTML += `<circle cx=\"${cx}\" cy=\"${cy}\" r=\"20\" fill=\"lightblue\" stroke=\"black\" stroke-width=\"2\"></circle>\n`
        graphSVG.innerHTML += `<text x=\"${cx-5}\" y=\"${cy+5}\" fill=\"black\" style=\"font-family:monospace;font-size:20px;\">${k}</text>`
    }
}