import Graph from "../src";

console.log(Graph)

// Sample graph input object
let edges = [
    { source: '0', target: '9' },
    { source: '9', target: '2' },
    { source: '2', target: '3' },
    { source: '2', target: '4' },
    { source: '3', target: '8' },
    { source: '8', target: '13' },
    { source: '8', target: '10' },
    { source: '10', target: '11' },
    { source: '10', target: '14' },
    { source: '14', target: '13' },
    { source: '11', target: '12' },
    { source: '4', target: '5' },
    { source: '5', target: '6' },
    { source: '5', target: '7' },
    { source: '13', target: '1' },
    { source: '6', target: '13' },
    { source: '12', target: '13' },
    { source: '7', target: '13' }
];

// Create object from Graph class with parameter as true indicating that input graph is directed
let g = new Graph(true);

// Add edges to graph using edges object
g.addFromObject(edges, 'source', 'target');

// Manually add edge from source to target
// g.addEdge('13', '8');

// Print graph with paths
console.log(g.getGraph());

// Print if input directed graph is cyclic
// Works only if input graph is set as directed in constructor `new Graph(true)`
console.log(`Is cyclic: ${g.isCyclic()}`);

// Check if path exists between two nodes
// returns array[boolean, array[nodes]]
console.log(g.isPathExists('9', '4'));

// Print path from a source vertex with depth first search algorithm 
console.log(g.dfs('0'));

// Print path from a source vertex with breadth first search algorithm
console.log(g.bfs('0'));
