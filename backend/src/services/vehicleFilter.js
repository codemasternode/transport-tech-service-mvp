'use strict';

function costPallet(truck, palettes, capacity) {
    return 1000 + (truck.palettes - palettes) + (truck.capacity - capacity);
}

function costVolume(truck, volume, capacity) {
    return 1000 + (truck.volume - volume) + (truck.capacity - capacity);
}

export function vehicleFilterByPallet(trucks, palettes, weight) {
    var w = weight / palettes;
    var best_path = [{ cost: 0 }];
    trucks.forEach(function (truck) {
        var max_palettes = Math.min(truck.palettes, truck.capacity / w);

        for (var i = max_palettes - 1; 0 <= i; i--) {
            for (var j = 1; j <= Math.min(max_palettes, palettes - i); j++) {
                if (best_path[i] == null) {
                    continue;
                }
                let prev_node = best_path[i];
                let this_solution = {
                    truck: truck,
                    palettes: j,
                    cost: prev_node.cost + costPallet(truck, j, w * j),
                    prev_node: prev_node
                };
                if (best_path[i + j] == null) {
                    best_path[i + j] = this_solution;
                }
                else if (this_solution.cost < best_path[i + j].cost) {
                    best_path[i + j] = this_solution;
                }
            }
        }
    });
    if (best_path[palettes] == null) {
        return null;
    }
    else {
        let best = best_path[palettes];
        let answer = [];
        while (best.truck != null) {
            answer.unshift({
                truck: best.truck,
                palettes: best.palettes
            });
            best = best.prev_node;
        }
        return answer;
    }
}

export function vehicleFilterByVolume(trucks, volume, weight) {
    volume = volume * 100
    var w = weight / volume;    
    // To begin, we can carry nothing for no weight.
    console.log(trucks)
    var best_path = [{ cost: 0 }];
    trucks.forEach(function (truck) {
        truck.volume = Math.floor(truck.volume * 100)
        var max_volume = Math.min(truck.volume, truck.capacity / w);
        // i is the number of volume other trucks carry.
        // We count down so that there is no chance the solution there
        // has already used this truck.
        for (var i = max_volume - 1; 0 <= i; i--) {
            // j is the number of volume that truck carries
            for (var j = 1; j <= Math.min(max_volume, volume - i); j++) {
                // Do we improve on i+j volume by having truck carry i?33
                if (best_path[i] == null) {
                    // Other trucks can't carry i
                    continue;
                }
                let prev_node = best_path[i];
                let this_solution = {
                    truck: truck,
                    volume: j,
                    cost: prev_node.cost + costVolume(truck, j, w * j),
                    prev_node: prev_node
                };
                if (best_path[i + j] == null) {
                    best_path[i + j] = this_solution;
                }
                else if (this_solution.cost < best_path[i + j].cost) {
                    best_path[i + j] = this_solution;
                }
            }
        }
    });


    // The answer is a linked list.  Let's decode it for convenience.
    if (best_path[volume] == null) {
        return null;
    }
    else {
        let best = best_path[volume];
        let answer = [];
        while (best.truck != null) {
            answer.unshift({
                truck: best.truck,
                volume: best.volume
            });
            best = best.prev_node;
        }        
        return answer;
    }
}