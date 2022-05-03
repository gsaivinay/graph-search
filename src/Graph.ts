import Queue from "./Queue";

/**
 * @constructor
 */
export default class Graph {
    #adjList: Map<string | number, Array<string | number>>;
    #isDirected: boolean;
    #WHITE = 0;
    #GRAY = 1;
    #BLACK = 2;

    /**
     * 
     * @param isDirected boolean value indicates whether the input graph is directed
     */
    constructor(isDirected: boolean) {
        this.#isDirected = isDirected;
        this.#adjList = new Map();
    }

    #addVertex(v) {
        !this.#adjList.get(v) && this.#adjList.set(v, []);
    }

    addEdge(v, w) {
        this.#addVertex(v);
        this.#adjList.get(v).push(w);
        if (!this.#isDirected) {
            this.#addVertex(w);
            this.#adjList.get(w).push(v);
        }
    }

    addFromObject(graphObject: object[], sourceKeyName: string | number, targetKeyName: string | number){
        graphObject.forEach((edge) => {
            this.addEdge(edge[sourceKeyName], edge[targetKeyName]);
        });
    }

    printGraph() {
        let get_keys = this.#adjList.keys();

        for (let i of get_keys) {
            let get_values = this.#adjList.get(i);
            let conc = "";
            for (let j of get_values)
                conc += j + " ";
            console.log(i + ` -${ this.#isDirected ? '>' : '-' } ` + conc);
        }
    }

    bfs(startingNode) {
        let visited = {};
        let q = new Queue();
        visited[startingNode] = true;
        q.enqueue(startingNode);

        while (!q.isEmpty()) {
            let getQueueElement = q.dequeue();
            console.log(getQueueElement);
            let get_List = this.#adjList.get(getQueueElement);
            for (let i in get_List) {
                let neigh = get_List[i];
                if (!visited[neigh]) {
                    visited[neigh] = true;
                    q.enqueue(neigh);
                }
            }
        }
    }

    dfs(startingNode) {
        let visited = {};
        this.#DFSUtil(startingNode, visited);
    }

    // Recursive function
    #DFSUtil(vert, visited) {
        visited[vert] = true;
        console.log(vert);
        let get_neighbours = this.#adjList.get(vert);
        for (let i in get_neighbours) {
            let get_elem = get_neighbours[i];
            if (!visited[get_elem])
                this.#DFSUtil(get_elem, visited);
        }
    }

    #isCyclicDFSUtil(vertex: string | number, color: number[]) {

        color[vertex] = this.#GRAY;
        let connVertices = this.#adjList.get(vertex);
        if(connVertices){
            for (let connVertex of connVertices) {
                if (color[connVertex] === this.#GRAY)
                    return true;
                if (color[connVertex] === this.#WHITE && this.#isCyclicDFSUtil(connVertex, color) === true)
                    return true;
            }
        }
    
        color[vertex] = this.#BLACK;
        return false;
    }

    isCyclic(): boolean {
        if (!this.#isDirected) 
            throw new Error("Cannot do cyclic check for undirected graph");
            
        let size = this.#adjList.size;
        let keys = Array.from(this.#adjList.keys());

        let color = Array(size);
        for (let i = 0; i < size; i++) {
            color[i] = this.#WHITE;
        }

        for (let i = 0; i < size; i++) {
            if (color[i] == this.#WHITE) {
                if (this.#isCyclicDFSUtil(keys[i], color) === true)
                    return true;
            }
        }
        return false;
    }
};