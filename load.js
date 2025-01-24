// const canvas = document.getElementById('graph-canvas');
// const context = canvas.getContext('2d');
const resultTable = document.querySelector("#dijkstra-table tbody");
const selects = [document.getElementById("node1"),document.getElementById("node2"),document.getElementById("start-node")]
const pesoInput = document.getElementById("pesoInput")
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
function updateForms() {
    let select = selects[0]
    const temp = select.length
    for (let i = 0; i < temp; i++) {
        selects.forEach((s) => s[0].remove())
    }
    nodosTable.innerHTML = "";
    aristasTable.innerHTML = "";
    Object.keys(graph).forEach( function(v){

        selects.forEach((s) => s.add(new Option(v)))
        row = document.createElement("tr");
        const nodeCell = document.createElement("td")
        nodeCell.textContent = v;
        row.appendChild(nodeCell)
        nodosTable.appendChild(row)

        //ESCRIBIR PARA TABLA DE ARISTAS
    })
        
}

function newNode() {
    var nodename = null
    nodename = window.prompt("¿Como se llamará el nodo?")
    if (nodename != null) {
        graph[nodename] = {}
    }
    updateForms()
}

function newEdge() {
    let pesoValue = Number(pesoInput.value)
    let node1 = selects[0].value
    let node2 = selects[1].value
    graph[node1][node2]=pesoValue
    graph[node2][node1]=pesoValue
}

function convert2SVG() {
    console.log("AQUI DEBERIA CREAR EL SVG CON LOS DATOS")
}