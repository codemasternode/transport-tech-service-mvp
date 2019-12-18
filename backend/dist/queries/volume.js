'use strict';

function cost(truck, pallets, capacity) {
  return 1000 + (truck.pallets - pallets) + (truck.capacity - capacity);
}

function optimize(trucks, pallets, weight) {
  var w = weight / pallets; // To begin, we can carry nothing for no weight.

  var best_path = [{
    cost: 0
  }];
  trucks.forEach(function (truck) {
    var max_pallets = Math.floor(Math.min(truck.pallets, truck.capacity / w)); // i is the number of pallets other trucks carry.
    // We count down so that there is no chance the solution there
    // has already used this truck.

    for (var i = max_pallets - 1; 0 <= i; i--) {
      // j is the number of pallets that truck carries
      for (var j = 1; j <= Math.min(max_pallets, pallets - i); j++) {
        // Do we improve on i+j pallets by having truck carry i?
        if (best_path[i] == null) {
          // Other trucks can't carry i
          continue;
        }

        var prev_node = best_path[i];
        var this_solution = {
          truck: truck,
          pallets: j,
          cost: prev_node.cost + cost(truck, j, w * j),
          prev_node: prev_node
        };

        if (best_path[i + j] == null) {
          best_path[i + j] = this_solution;
        } else if (this_solution.cost < best_path[i + j].cost) {
          best_path[i + j] = this_solution;
        }
      }
    }
  }); // The answer is a linked list.  Let's decode it for convenience.

  if (best_path[pallets] == null) {
    return null;
  } else {
    var best = best_path[pallets];
    var answer = [];

    while (best.truck != null) {
      answer.unshift({
        truck: best.truck,
        pallets: best.pallets
      });
      best = best.prev_node;
    }

    return answer;
  }
}

var trucks = [{
  name: "Truck 1",
  pallets: 1.5,
  capacity: 15
}, {
  name: "Truck 2",
  pallets: 1.2,
  capacity: 10
}, {
  name: "Truck 3",
  pallets: 20,
  capacity: 22
}, {
  name: "Truck 4",
  pallets: 24,
  capacity: 12
}];
console.log(optimize(trucks, 1, 1));
//# sourceMappingURL=volume.js.map