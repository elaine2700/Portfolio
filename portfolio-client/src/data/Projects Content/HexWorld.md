## About
A hexagonal procedural world created with Unity Engine.

## Description
A while back a saw a tutorial on how to make a world like this in Blender using the Geometry Nodes system, and I thought it would be a good exercise to recreate it with Unity.

### Height
This tool creates the hexagon mesh and then changes its location to create a hexagonal grid. Before drawing the mesh, the height is decided with the help of the Mathf.PerlinNoise function that Unity provides, giving as arguments the hexagon's position.

### Mask
An important aspect of the world is the overall shape as a hexagon, so before generating the grid, the script spawns a big hexagon that will sorround the grid. And, before spawning every object I generated a ray to check if the position is inside the hexagon mask.

### Materials
To select a material for the hexagon, the script compares the height along the maximum height and with a lerp function, it maps the value with the index of a material list. Later, for the trees, the script compares the height in percentage and checks if it is between the set range.