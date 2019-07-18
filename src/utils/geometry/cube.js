export function createCubeModel(size = 1) {
    return {
        indices: [0, 1, 2, 0, 2, 3, // Front
            4, 5, 6, 4, 6, 7, // Back
            8, 9, 10, 8, 10, 11, // Top
            12, 13, 14, 12, 14, 15, // Bottom
            16, 17, 18, 16, 18, 19, // Right
            20, 21, 22, 20, 22, 23 // Left],
        ],
        normals: [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            // Back face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Top face
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Bottom face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            // Right face
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            // Left face
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0
        ],
        positions: [
            -size, -size, size,
            size, -size, size,
            size, size, size,
            -size, size, size,

            // Back face
            -size, -size, -size,
            -size, size, -size,
            size, size, -size,
            size, -size, -size,

            // Top face
            -size, size, -size,
            -size, size, size,
            size, size, size,
            size, size, -size,

            // Bottom face
            -size, -size, -size,
            size, -size, -size,
            size, -size, size,
            -size, -size, size,

            // Right face
            size, -size, -size,
            size, size, -size,
            size, size, size,
            size, -size, size,

            // Left face
            -size, -size, -size,
            -size, -size, size,
            -size, size, size,
            -size, size, -size
        ],
        texCoords: [
            0, 0, 0, 1, 1, 1, 1, 0,
            0, 0, 0, 1, 1, 1, 1, 0,
            0, 0, 0, 1, 1, 1, 1, 0,
            0, 0, 0, 1, 1, 1, 1, 0,
            0, 0, 0, 1, 1, 1, 1, 0,
            0, 0, 0, 1, 1, 1, 1, 0,
        ]
    };
}
