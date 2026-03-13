import { generateAllEdges, writeEdgesToFile } from "./generateEdges";
import * as helperStars from "./vertices_helperstars_graphson.json";

writeEdgesToFile(helperStars.vertices, "edges.json");



