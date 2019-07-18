export function createPlaneModel(size = 100, division = 100) {
    const positions = [];
    const indices = [];
    const texCoords = [];

    let i, j, index;
    for(i = 0; i <= division; i++) {
        for(j = 0; j <= division; j++) {
            positions.push((i - division / 2) * size / division, (j - division / 2) * size / division, 0);
            texCoords.push(i / division, j / division);
        }
    }
    for(i = 0; i < division; i++) {
        for(j = 0; j < division; j++) {
            index = (division + 1) * i + j;
            indices.push(
                index, index + 1, index + division + 1,
                index + 1, index + division + 2, index + division + 1
            );
        }
    }

    return {
        indices: indices,
        positions: positions,
        texCoords: texCoords
    };
}

