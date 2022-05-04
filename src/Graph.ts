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

    /**
     * 
     * @returns JS Map with nodes as keys and direct connected nodes as values
     */
    getGraph() {
        let get_keys = this.#adjList.keys();
        let graphPath =  new Map();
        for (let i of get_keys) {
            !graphPath.get(i) && graphPath.set(i, []);
            let get_values = this.#adjList.get(i);
            for (let j of get_values)
                graphPath.get(i).push(j);
        }
        return graphPath;
    }

    /**
     * 
     * @param startingNode 
     * @returns array of travelled nodes from given starting node
     */
    bfs(startingNode: string | number) {
        return this.#BFSUtil(startingNode);
    }

    #BFSUtil(startingNode: string | number, endingNode?: string | number) {
        let visited = {};
        let travelledPath = [];
        let q = new Queue();
        visited[startingNode] = true;
        q.enqueue(startingNode);

        while (!q.isEmpty()) {
            let getQueueElement = q.dequeue();
            travelledPath.push(getQueueElement);
            if(endingNode && endingNode === getQueueElement){
                return [true, travelledPath];
            }
            let getList = this.#adjList.get(getQueueElement);
            for (let i in getList) {
                let neighbour = getList[i];
                if (!visited[neighbour]) {
                    visited[neighbour] = true;
                    q.enqueue(neighbour);
                }
            }
        }
        if(endingNode){
            return [false, travelledPath];
        }
        return travelledPath;
    }

    /**
     * 
     * @param startingNode 
     * @returns array of travelled nodes from given starting node
     */
    dfs(startingNode) {
        let visited = {};
        let travelledPath = [];
        return this.#DFSUtil(startingNode, visited, travelledPath);
    }

    // Recursive function
    #DFSUtil(vert: string | number, visited: { }, travelledPath: any[]) {
        visited[vert] = true;
        travelledPath.push(vert);
        let getNeighbours = this.#adjList.get(vert);
        for (let i in getNeighbours) {
            let get_elem = getNeighbours[i];
            if (!visited[get_elem])
                this.#DFSUtil(get_elem, visited, travelledPath);
        }
        return travelledPath;
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

    /**
     * 
     * @returns boolean indicating whether the directed graph contains cyclic paths
     */
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

    /**
     * 
     * @param source 
     * @param target 
     * @returns array[boolean, array[travelled paths]]
     */
    isPathExists(source: string | number, target: string | number){
        return this.#BFSUtil(source, target);
    }
};