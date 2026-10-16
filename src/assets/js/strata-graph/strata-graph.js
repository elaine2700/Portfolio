// packages/strata-graph/node_modules/d3-force/src/center.js
function center_default(x3, y3) {
  var nodes, strength = 1;
  if (x3 == null) x3 = 0;
  if (y3 == null) y3 = 0;
  function force() {
    var i, n = nodes.length, node, sx = 0, sy = 0;
    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x, sy += node.y;
    }
    for (sx = (sx / n - x3) * strength, sy = (sy / n - y3) * strength, i = 0; i < n; ++i) {
      node = nodes[i], node.x -= sx, node.y -= sy;
    }
  }
  force.initialize = function(_) {
    nodes = _;
  };
  force.x = function(_) {
    return arguments.length ? (x3 = +_, force) : x3;
  };
  force.y = function(_) {
    return arguments.length ? (y3 = +_, force) : y3;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };
  return force;
}

// packages/strata-graph/node_modules/d3-quadtree/src/add.js
function add_default(d) {
  const x3 = +this._x.call(null, d), y3 = +this._y.call(null, d);
  return add(this.cover(x3, y3), x3, y3, d);
}
function add(tree, x3, y3, d) {
  if (isNaN(x3) || isNaN(y3)) return tree;
  var parent, node = tree._root, leaf = { data: d }, x0 = tree._x0, y0 = tree._y0, x1 = tree._x1, y1 = tree._y1, xm, ym, xp, yp, right, bottom, i, j;
  if (!node) return tree._root = leaf, tree;
  while (node.length) {
    if (right = x3 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y3 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
  }
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x3 === xp && y3 === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x3 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y3 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));
  return parent[j] = node, parent[i] = leaf, tree;
}
function addAll(data) {
  var d, i, n = data.length, x3, y3, xz = new Array(n), yz = new Array(n), x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (i = 0; i < n; ++i) {
    if (isNaN(x3 = +this._x.call(null, d = data[i])) || isNaN(y3 = +this._y.call(null, d))) continue;
    xz[i] = x3;
    yz[i] = y3;
    if (x3 < x0) x0 = x3;
    if (x3 > x1) x1 = x3;
    if (y3 < y0) y0 = y3;
    if (y3 > y1) y1 = y3;
  }
  if (x0 > x1 || y0 > y1) return this;
  this.cover(x0, y0).cover(x1, y1);
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }
  return this;
}

// packages/strata-graph/node_modules/d3-quadtree/src/cover.js
function cover_default(x3, y3) {
  if (isNaN(x3 = +x3) || isNaN(y3 = +y3)) return this;
  var x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x3)) + 1;
    y1 = (y0 = Math.floor(y3)) + 1;
  } else {
    var z = x1 - x0 || 1, node = this._root, parent, i;
    while (x0 > x3 || x3 >= x1 || y0 > y3 || y3 >= y1) {
      i = (y3 < y0) << 1 | x3 < x0;
      parent = new Array(4), parent[i] = node, node = parent, z *= 2;
      switch (i) {
        case 0:
          x1 = x0 + z, y1 = y0 + z;
          break;
        case 1:
          x0 = x1 - z, y1 = y0 + z;
          break;
        case 2:
          x1 = x0 + z, y0 = y1 - z;
          break;
        case 3:
          x0 = x1 - z, y0 = y1 - z;
          break;
      }
    }
    if (this._root && this._root.length) this._root = node;
  }
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
}

// packages/strata-graph/node_modules/d3-quadtree/src/data.js
function data_default() {
  var data = [];
  this.visit(function(node) {
    if (!node.length) do
      data.push(node.data);
    while (node = node.next);
  });
  return data;
}

// packages/strata-graph/node_modules/d3-quadtree/src/extent.js
function extent_default(_) {
  return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}

// packages/strata-graph/node_modules/d3-quadtree/src/quad.js
function quad_default(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}

// packages/strata-graph/node_modules/d3-quadtree/src/find.js
function find_default(x3, y3, radius) {
  var data, x0 = this._x0, y0 = this._y0, x1, y1, x22, y22, x32 = this._x1, y32 = this._y1, quads = [], node = this._root, q, i;
  if (node) quads.push(new quad_default(node, x0, y0, x32, y32));
  if (radius == null) radius = Infinity;
  else {
    x0 = x3 - radius, y0 = y3 - radius;
    x32 = x3 + radius, y32 = y3 + radius;
    radius *= radius;
  }
  while (q = quads.pop()) {
    if (!(node = q.node) || (x1 = q.x0) > x32 || (y1 = q.y0) > y32 || (x22 = q.x1) < x0 || (y22 = q.y1) < y0) continue;
    if (node.length) {
      var xm = (x1 + x22) / 2, ym = (y1 + y22) / 2;
      quads.push(
        new quad_default(node[3], xm, ym, x22, y22),
        new quad_default(node[2], x1, ym, xm, y22),
        new quad_default(node[1], xm, y1, x22, ym),
        new quad_default(node[0], x1, y1, xm, ym)
      );
      if (i = (y3 >= ym) << 1 | x3 >= xm) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    } else {
      var dx = x3 - +this._x.call(null, node.data), dy = y3 - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
      if (d2 < radius) {
        var d = Math.sqrt(radius = d2);
        x0 = x3 - d, y0 = y3 - d;
        x32 = x3 + d, y32 = y3 + d;
        data = node.data;
      }
    }
  }
  return data;
}

// packages/strata-graph/node_modules/d3-quadtree/src/remove.js
function remove_default(d) {
  if (isNaN(x3 = +this._x.call(null, d)) || isNaN(y3 = +this._y.call(null, d))) return this;
  var parent, node = this._root, retainer, previous, next, x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1, x3, y3, xm, ym, right, bottom, i, j;
  if (!node) return this;
  if (node.length) while (true) {
    if (right = x3 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y3 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
    if (!node.length) break;
    if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
  }
  while (node.data !== d) if (!(previous = node, node = node.next)) return this;
  if (next = node.next) delete node.next;
  if (previous) return next ? previous.next = next : delete previous.next, this;
  if (!parent) return this._root = next, this;
  next ? parent[i] = next : delete parent[i];
  if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
    if (retainer) retainer[j] = node;
    else this._root = node;
  }
  return this;
}
function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
  return this;
}

// packages/strata-graph/node_modules/d3-quadtree/src/root.js
function root_default() {
  return this._root;
}

// packages/strata-graph/node_modules/d3-quadtree/src/size.js
function size_default() {
  var size = 0;
  this.visit(function(node) {
    if (!node.length) do
      ++size;
    while (node = node.next);
  });
  return size;
}

// packages/strata-graph/node_modules/d3-quadtree/src/visit.js
function visit_default(callback) {
  var quads = [], q, node = this._root, child, x0, y0, x1, y1;
  if (node) quads.push(new quad_default(node, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[3]) quads.push(new quad_default(child, xm, ym, x1, y1));
      if (child = node[2]) quads.push(new quad_default(child, x0, ym, xm, y1));
      if (child = node[1]) quads.push(new quad_default(child, xm, y0, x1, ym));
      if (child = node[0]) quads.push(new quad_default(child, x0, y0, xm, ym));
    }
  }
  return this;
}

// packages/strata-graph/node_modules/d3-quadtree/src/visitAfter.js
function visitAfter_default(callback) {
  var quads = [], next = [], q;
  if (this._root) quads.push(new quad_default(this._root, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    var node = q.node;
    if (node.length) {
      var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[0]) quads.push(new quad_default(child, x0, y0, xm, ym));
      if (child = node[1]) quads.push(new quad_default(child, xm, y0, x1, ym));
      if (child = node[2]) quads.push(new quad_default(child, x0, ym, xm, y1));
      if (child = node[3]) quads.push(new quad_default(child, xm, ym, x1, y1));
    }
    next.push(q);
  }
  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }
  return this;
}

// packages/strata-graph/node_modules/d3-quadtree/src/x.js
function defaultX(d) {
  return d[0];
}
function x_default(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}

// packages/strata-graph/node_modules/d3-quadtree/src/y.js
function defaultY(d) {
  return d[1];
}
function y_default(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}

// packages/strata-graph/node_modules/d3-quadtree/src/quadtree.js
function quadtree(nodes, x3, y3) {
  var tree = new Quadtree(x3 == null ? defaultX : x3, y3 == null ? defaultY : y3, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}
function Quadtree(x3, y3, x0, y0, x1, y1) {
  this._x = x3;
  this._y = y3;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = void 0;
}
function leaf_copy(leaf) {
  var copy = { data: leaf.data }, next = copy;
  while (leaf = leaf.next) next = next.next = { data: leaf.data };
  return copy;
}
var treeProto = quadtree.prototype = Quadtree.prototype;
treeProto.copy = function() {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1), node = this._root, nodes, child;
  if (!node) return copy;
  if (!node.length) return copy._root = leaf_copy(node), copy;
  nodes = [{ source: node, target: copy._root = new Array(4) }];
  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({ source: child, target: node.target[i] = new Array(4) });
        else node.target[i] = leaf_copy(child);
      }
    }
  }
  return copy;
};
treeProto.add = add_default;
treeProto.addAll = addAll;
treeProto.cover = cover_default;
treeProto.data = data_default;
treeProto.extent = extent_default;
treeProto.find = find_default;
treeProto.remove = remove_default;
treeProto.removeAll = removeAll;
treeProto.root = root_default;
treeProto.size = size_default;
treeProto.visit = visit_default;
treeProto.visitAfter = visitAfter_default;
treeProto.x = x_default;
treeProto.y = y_default;

// packages/strata-graph/node_modules/d3-force/src/constant.js
function constant_default(x3) {
  return function() {
    return x3;
  };
}

// packages/strata-graph/node_modules/d3-force/src/jiggle.js
function jiggle_default(random) {
  return (random() - 0.5) * 1e-6;
}

// packages/strata-graph/node_modules/d3-force/src/collide.js
function x(d) {
  return d.x + d.vx;
}
function y(d) {
  return d.y + d.vy;
}
function collide_default(radius) {
  var nodes, radii, random, strength = 1, iterations = 1;
  if (typeof radius !== "function") radius = constant_default(radius == null ? 1 : +radius);
  function force() {
    var i, n = nodes.length, tree, node, xi, yi, ri, ri2;
    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x, y).visitAfter(prepare);
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        ri = radii[node.index], ri2 = ri * ri;
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        tree.visit(apply);
      }
    }
    function apply(quad, x0, y0, x1, y1) {
      var data = quad.data, rj = quad.r, r = ri + rj;
      if (data) {
        if (data.index > node.index) {
          var x3 = xi - data.x - data.vx, y3 = yi - data.y - data.vy, l = x3 * x3 + y3 * y3;
          if (l < r * r) {
            if (x3 === 0) x3 = jiggle_default(random), l += x3 * x3;
            if (y3 === 0) y3 = jiggle_default(random), l += y3 * y3;
            l = (r - (l = Math.sqrt(l))) / l * strength;
            node.vx += (x3 *= l) * (r = (rj *= rj) / (ri2 + rj));
            node.vy += (y3 *= l) * r;
            data.vx -= x3 * (r = 1 - r);
            data.vy -= y3 * r;
          }
        }
        return;
      }
      return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
    }
  }
  function prepare(quad) {
    if (quad.data) return quad.r = radii[quad.data.index];
    for (var i = quad.r = 0; i < 4; ++i) {
      if (quad[i] && quad[i].r > quad.r) {
        quad.r = quad[i].r;
      }
    }
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, node;
    radii = new Array(n);
    for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };
  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant_default(+_), initialize(), force) : radius;
  };
  return force;
}

// packages/strata-graph/node_modules/d3-force/src/link.js
function index(d) {
  return d.index;
}
function find(nodeById, nodeId) {
  var node = nodeById.get(nodeId);
  if (!node) throw new Error("node not found: " + nodeId);
  return node;
}
function link_default(links) {
  var id = index, strength = defaultStrength, strengths, distance = constant_default(30), distances, nodes, count, bias, random, iterations = 1;
  if (links == null) links = [];
  function defaultStrength(link) {
    return 1 / Math.min(count[link.source.index], count[link.target.index]);
  }
  function force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x3, y3, l, b; i < n; ++i) {
        link = links[i], source = link.source, target = link.target;
        x3 = target.x + target.vx - source.x - source.vx || jiggle_default(random);
        y3 = target.y + target.vy - source.y - source.vy || jiggle_default(random);
        l = Math.sqrt(x3 * x3 + y3 * y3);
        l = (l - distances[i]) / l * alpha * strengths[i];
        x3 *= l, y3 *= l;
        target.vx -= x3 * (b = bias[i]);
        target.vy -= y3 * b;
        source.vx += x3 * (b = 1 - b);
        source.vy += y3 * b;
      }
    }
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, m2 = links.length, nodeById = new Map(nodes.map((d, i2) => [id(d, i2, nodes), d])), link;
    for (i = 0, count = new Array(n); i < m2; ++i) {
      link = links[i], link.index = i;
      if (typeof link.source !== "object") link.source = find(nodeById, link.source);
      if (typeof link.target !== "object") link.target = find(nodeById, link.target);
      count[link.source.index] = (count[link.source.index] || 0) + 1;
      count[link.target.index] = (count[link.target.index] || 0) + 1;
    }
    for (i = 0, bias = new Array(m2); i < m2; ++i) {
      link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
    }
    strengths = new Array(m2), initializeStrength();
    distances = new Array(m2), initializeDistance();
  }
  function initializeStrength() {
    if (!nodes) return;
    for (var i = 0, n = links.length; i < n; ++i) {
      strengths[i] = +strength(links[i], i, links);
    }
  }
  function initializeDistance() {
    if (!nodes) return;
    for (var i = 0, n = links.length; i < n; ++i) {
      distances[i] = +distance(links[i], i, links);
    }
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.links = function(_) {
    return arguments.length ? (links = _, initialize(), force) : links;
  };
  force.id = function(_) {
    return arguments.length ? (id = _, force) : id;
  };
  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant_default(+_), initializeStrength(), force) : strength;
  };
  force.distance = function(_) {
    return arguments.length ? (distance = typeof _ === "function" ? _ : constant_default(+_), initializeDistance(), force) : distance;
  };
  return force;
}

// packages/strata-graph/node_modules/d3-dispatch/src/dispatch.js
var noop = { value: () => {
} };
function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}
function Dispatch(_) {
  this._ = _;
}
function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};
function get(type, name) {
  for (var i = 0, n = type.length, c2; i < n; ++i) {
    if ((c2 = type[i]).name === name) {
      return c2.value;
    }
  }
}
function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name, value: callback });
  return type;
}
var dispatch_default = dispatch;

// packages/strata-graph/node_modules/d3-timer/src/timer.js
var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1e3;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}
function timerFlush() {
  now();
  ++frame;
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
    t = t._next;
  }
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
}
function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}
function sleep(time) {
  if (frame) return;
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

// packages/strata-graph/node_modules/d3-force/src/lcg.js
var a = 1664525;
var c = 1013904223;
var m = 4294967296;
function lcg_default() {
  let s = 1;
  return () => (s = (a * s + c) % m) / m;
}

// packages/strata-graph/node_modules/d3-force/src/simulation.js
function x2(d) {
  return d.x;
}
function y2(d) {
  return d.y;
}
var initialRadius = 10;
var initialAngle = Math.PI * (3 - Math.sqrt(5));
function simulation_default(nodes) {
  var simulation, alpha = 1, alphaMin = 1e-3, alphaDecay = 1 - Math.pow(alphaMin, 1 / 300), alphaTarget = 0, velocityDecay = 0.6, forces = /* @__PURE__ */ new Map(), stepper = timer(step), event = dispatch_default("tick", "end"), random = lcg_default();
  if (nodes == null) nodes = [];
  function step() {
    tick();
    event.call("tick", simulation);
    if (alpha < alphaMin) {
      stepper.stop();
      event.call("end", simulation);
    }
  }
  function tick(iterations) {
    var i, n = nodes.length, node;
    if (iterations === void 0) iterations = 1;
    for (var k = 0; k < iterations; ++k) {
      alpha += (alphaTarget - alpha) * alphaDecay;
      forces.forEach(function(force) {
        force(alpha);
      });
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        if (node.fx == null) node.x += node.vx *= velocityDecay;
        else node.x = node.fx, node.vx = 0;
        if (node.fy == null) node.y += node.vy *= velocityDecay;
        else node.y = node.fy, node.vy = 0;
      }
    }
    return simulation;
  }
  function initializeNodes() {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.index = i;
      if (node.fx != null) node.x = node.fx;
      if (node.fy != null) node.y = node.fy;
      if (isNaN(node.x) || isNaN(node.y)) {
        var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
        node.x = radius * Math.cos(angle);
        node.y = radius * Math.sin(angle);
      }
      if (isNaN(node.vx) || isNaN(node.vy)) {
        node.vx = node.vy = 0;
      }
    }
  }
  function initializeForce(force) {
    if (force.initialize) force.initialize(nodes, random);
    return force;
  }
  initializeNodes();
  return simulation = {
    tick,
    restart: function() {
      return stepper.restart(step), simulation;
    },
    stop: function() {
      return stepper.stop(), simulation;
    },
    nodes: function(_) {
      return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
    },
    alpha: function(_) {
      return arguments.length ? (alpha = +_, simulation) : alpha;
    },
    alphaMin: function(_) {
      return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
    },
    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
    },
    alphaTarget: function(_) {
      return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
    },
    velocityDecay: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
    },
    randomSource: function(_) {
      return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
    },
    force: function(name, _) {
      return arguments.length > 1 ? (_ == null ? forces.delete(name) : forces.set(name, initializeForce(_)), simulation) : forces.get(name);
    },
    find: function(x3, y3, radius) {
      var i = 0, n = nodes.length, dx, dy, d2, node, closest;
      if (radius == null) radius = Infinity;
      else radius *= radius;
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        dx = x3 - node.x;
        dy = y3 - node.y;
        d2 = dx * dx + dy * dy;
        if (d2 < radius) closest = node, radius = d2;
      }
      return closest;
    },
    on: function(name, _) {
      return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
    }
  };
}

// packages/strata-graph/node_modules/d3-force/src/manyBody.js
function manyBody_default() {
  var nodes, node, random, alpha, strength = constant_default(-30), strengths, distanceMin2 = 1, distanceMax2 = Infinity, theta2 = 0.81;
  function force(_) {
    var i, n = nodes.length, tree = quadtree(nodes, x2, y2).visitAfter(accumulate);
    for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, node2;
    strengths = new Array(n);
    for (i = 0; i < n; ++i) node2 = nodes[i], strengths[node2.index] = +strength(node2, i, nodes);
  }
  function accumulate(quad) {
    var strength2 = 0, q, c2, weight = 0, x3, y3, i;
    if (quad.length) {
      for (x3 = y3 = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c2 = Math.abs(q.value))) {
          strength2 += q.value, weight += c2, x3 += c2 * q.x, y3 += c2 * q.y;
        }
      }
      quad.x = x3 / weight;
      quad.y = y3 / weight;
    } else {
      q = quad;
      q.x = q.data.x;
      q.y = q.data.y;
      do
        strength2 += strengths[q.data.index];
      while (q = q.next);
    }
    quad.value = strength2;
  }
  function apply(quad, x1, _, x22) {
    if (!quad.value) return true;
    var x3 = quad.x - node.x, y3 = quad.y - node.y, w = x22 - x1, l = x3 * x3 + y3 * y3;
    if (w * w / theta2 < l) {
      if (l < distanceMax2) {
        if (x3 === 0) x3 = jiggle_default(random), l += x3 * x3;
        if (y3 === 0) y3 = jiggle_default(random), l += y3 * y3;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        node.vx += x3 * quad.value * alpha / l;
        node.vy += y3 * quad.value * alpha / l;
      }
      return true;
    } else if (quad.length || l >= distanceMax2) return;
    if (quad.data !== node || quad.next) {
      if (x3 === 0) x3 = jiggle_default(random), l += x3 * x3;
      if (y3 === 0) y3 = jiggle_default(random), l += y3 * y3;
      if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
    }
    do
      if (quad.data !== node) {
        w = strengths[quad.data.index] * alpha / l;
        node.vx += x3 * w;
        node.vy += y3 * w;
      }
    while (quad = quad.next);
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant_default(+_), initialize(), force) : strength;
  };
  force.distanceMin = function(_) {
    return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
  };
  force.distanceMax = function(_) {
    return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
  };
  force.theta = function(_) {
    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
  };
  return force;
}

// packages/strata-graph/src/client/canvas-engine.js
var CanvasEngine = class {
  constructor(canvasElement, nodeRenderer, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.renderer = nodeRenderer;
    this.options = {
      enableZoom: true,
      enablePan: true,
      minZoom: 0.3,
      maxZoom: 3.5,
      ...options
    };
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.camera = { x: 0, y: 0, k: 1 };
    this.targetCamera = { x: 0, y: 0, k: 1 };
    this.isCameraAnimating = false;
    this.cameraAnimationProgress = 1;
    this.cameraStart = { x: 0, y: 0, k: 1 };
    this.cameraAnimDuration = 500;
    this.cameraAnimStartTime = 0;
    this.nodes = [];
    this.links = [];
    this.simulation = null;
    this.hoveredNode = null;
    this.draggedNode = null;
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.dragStartPos = { x: 0, y: 0 };
    this.dragDistance = 0;
    this.onFolderClick = null;
    this.onArticleClick = null;
    this.onBackgroundClick = null;
    this.rafId = null;
    this.init();
  }
  init() {
    this.handleResize();
    this.bindEvents();
    this.renderer.setImageLoadCallback(() => {
      this.requestRender();
    });
    this.startRenderLoop();
  }
  handleResize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 800;
    this.height = rect.height || 600;
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    if (this.camera.x === 0 && this.camera.y === 0) {
      this.camera.x = this.width / 2;
      this.camera.y = this.height / 2;
      this.targetCamera.x = this.camera.x;
      this.targetCamera.y = this.camera.y;
    }
  }
  /**
   * Converts screen (mouse) coordinates to world (simulation) coordinates.
   */
  screenToWorld(screenX, screenY) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = screenX - rect.left;
    const clientY = screenY - rect.top;
    const worldX = (clientX - this.camera.x) / this.camera.k;
    const worldY = (clientY - this.camera.y) / this.camera.k;
    return { x: worldX, y: worldY };
  }
  /**
   * Converts world coordinates to screen canvas coordinates.
   */
  worldToScreen(worldX, worldY) {
    return {
      x: worldX * this.camera.k + this.camera.x,
      y: worldY * this.camera.k + this.camera.y
    };
  }
  /**
   * Find node under cursor.
   */
  findNodeAt(screenX, screenY) {
    const { x: x3, y: y3 } = this.screenToWorld(screenX, screenY);
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i];
      const radius = this.renderer.getNodeRadius(node);
      const dx = node.x - x3;
      const dy = node.y - y3;
      if (dx * dx + dy * dy <= radius * radius) {
        return node;
      }
    }
    return null;
  }
  setData(nodesData, linksData, origin = null) {
    this.nodes = nodesData.map((d, i) => {
      const angle = i / nodesData.length * Math.PI * 2;
      const spread = 120 + Math.random() * 40;
      const startX = origin ? origin.x + Math.cos(angle) * 30 : Math.cos(angle) * spread;
      const startY = origin ? origin.y + Math.sin(angle) * 30 : Math.sin(angle) * spread;
      return {
        ...d,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: this.renderer.getNodeRadius(d)
      };
    });
    this.links = linksData.map((l) => ({ ...l }));
    this.hoveredNode = null;
    this.draggedNode = null;
    this.initSimulation();
    this.resetView(true);
  }
  initSimulation() {
    if (this.simulation) {
      this.simulation.stop();
    }
    this.simulation = simulation_default(this.nodes).force("center", center_default(0, 0).strength(0.08)).force("charge", manyBody_default().strength(-380)).force(
      "collide",
      collide_default().radius((d) => (d.radius || 40) + 26).iterations(2)
    ).alpha(1).alphaDecay(0.035).velocityDecay(0.35);
    if (this.links.length > 0) {
      this.simulation.force(
        "link",
        link_default(this.links).id((d) => d.id).distance((d) => d.distance || 140).strength((d) => d.strength || 0.5)
      );
    }
    this.simulation.on("tick", () => {
      this.requestRender();
    });
  }
  bindEvents() {
    const c2 = this.canvas;
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
        this.requestRender();
      });
      this.resizeObserver.observe(c2);
    }
    c2.addEventListener("pointerdown", this.onPointerDown.bind(this));
    window.addEventListener("pointermove", this.onPointerMove.bind(this));
    window.addEventListener("pointerup", this.onPointerUp.bind(this));
    c2.addEventListener("wheel", this.onWheel.bind(this), { passive: false });
  }
  onPointerDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    this.dragStartPos = { x: sx, y: sy };
    this.dragDistance = 0;
    const hit = this.findNodeAt(sx, sy);
    if (hit) {
      this.draggedNode = hit;
      hit.fx = hit.x;
      hit.fy = hit.y;
      if (this.simulation) {
        this.simulation.alphaTarget(0.3).restart();
      }
      this.canvas.classList.add("is-dragging");
    } else {
      this.isPanning = true;
      this.panStart = { x: sx - this.camera.x, y: sy - this.camera.y };
      this.canvas.classList.add("is-dragging");
    }
  }
  onPointerMove(e) {
    const sx = e.clientX;
    const sy = e.clientY;
    if (this.draggedNode) {
      const dx = sx - this.dragStartPos.x;
      const dy = sy - this.dragStartPos.y;
      this.dragDistance += Math.hypot(dx, dy);
      const { x: x3, y: y3 } = this.screenToWorld(sx, sy);
      this.draggedNode.fx = x3;
      this.draggedNode.fy = y3;
      this.requestRender();
      return;
    }
    if (this.isPanning) {
      const dx = sx - this.dragStartPos.x;
      const dy = sy - this.dragStartPos.y;
      this.dragDistance += Math.hypot(dx, dy);
      this.camera.x = sx - this.panStart.x;
      this.camera.y = sy - this.panStart.y;
      this.targetCamera.x = this.camera.x;
      this.targetCamera.y = this.camera.y;
      this.requestRender();
      return;
    }
    const prevHovered = this.hoveredNode;
    this.hoveredNode = this.findNodeAt(sx, sy);
    if (this.hoveredNode !== prevHovered) {
      if (this.hoveredNode) {
        this.canvas.classList.add("is-hovering");
      } else {
        this.canvas.classList.remove("is-hovering");
      }
      this.requestRender();
    }
  }
  onPointerUp(e) {
    const sx = e.clientX;
    const sy = e.clientY;
    const clickThreshold = 6;
    if (this.draggedNode) {
      const node = this.draggedNode;
      this.draggedNode.fx = null;
      this.draggedNode.fy = null;
      this.draggedNode = null;
      if (this.simulation) {
        this.simulation.alphaTarget(0);
      }
      this.canvas.classList.remove("is-dragging");
      if (this.dragDistance < clickThreshold) {
        this.handleNodeClick(node);
      }
      this.requestRender();
      return;
    }
    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.classList.remove("is-dragging");
      if (this.dragDistance < clickThreshold) {
        if (this.onBackgroundClick) {
          this.onBackgroundClick();
        }
      }
      this.requestRender();
    }
  }
  handleNodeClick(node) {
    if (node.type === "folder") {
      if (this.onFolderClick) {
        this.onFolderClick(node);
      }
    } else if (node.type === "article") {
      if (this.onArticleClick) {
        this.onArticleClick(node);
      }
    }
  }
  onWheel(e) {
    e.preventDefault();
    if (!this.options.enableZoom) return;
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newScale = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, this.camera.k * zoomFactor));
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldX = (mouseX - this.camera.x) / this.camera.k;
    const worldY = (mouseY - this.camera.y) / this.camera.k;
    this.camera.k = newScale;
    this.camera.x = mouseX - worldX * newScale;
    this.camera.y = mouseY - worldY * newScale;
    this.targetCamera.k = this.camera.k;
    this.targetCamera.x = this.camera.x;
    this.targetCamera.y = this.camera.y;
    this.requestRender();
  }
  zoomIn() {
    const newK = Math.min(this.options.maxZoom, this.camera.k * 1.3);
    this.animateCameraTo(this.camera.x, this.camera.y, newK, 250);
  }
  zoomOut() {
    const newK = Math.max(this.options.minZoom, this.camera.k / 1.3);
    this.animateCameraTo(this.camera.x, this.camera.y, newK, 250);
  }
  resetView(animated = true) {
    const targetX = this.width / 2;
    const targetY = this.height / 2;
    const targetK = 1;
    if (animated) {
      this.animateCameraTo(targetX, targetY, targetK, 450);
    } else {
      this.camera.x = targetX;
      this.camera.y = targetY;
      this.camera.k = targetK;
      this.targetCamera.x = targetX;
      this.targetCamera.y = targetY;
      this.targetCamera.k = targetK;
      this.requestRender();
    }
  }
  animateCameraTo(targetX, targetY, targetK, duration = 400) {
    this.cameraStart = { ...this.camera };
    this.targetCamera = { x: targetX, y: targetY, k: targetK };
    this.cameraAnimDuration = duration;
    this.cameraAnimStartTime = performance.now();
    this.isCameraAnimating = true;
    this.requestRender();
  }
  /**
   * Smoothly transitions camera to focus onto a node before drilling down.
   */
  zoomToNode(node, duration = 450) {
    return new Promise((resolve) => {
      const targetK = 2.2;
      const targetX = this.width / 2 - node.x * targetK;
      const targetY = this.height / 2 - node.y * targetK;
      this.animateCameraTo(targetX, targetY, targetK, duration);
      setTimeout(resolve, duration);
    });
  }
  updateCameraAnimation(now2) {
    if (!this.isCameraAnimating) return;
    const elapsed = now2 - this.cameraAnimStartTime;
    const progress = Math.min(1, elapsed / this.cameraAnimDuration);
    const ease = 1 - Math.pow(1 - progress, 3);
    this.camera.x = this.cameraStart.x + (this.targetCamera.x - this.cameraStart.x) * ease;
    this.camera.y = this.cameraStart.y + (this.targetCamera.y - this.cameraStart.y) * ease;
    this.camera.k = this.cameraStart.k + (this.targetCamera.k - this.cameraStart.k) * ease;
    if (progress >= 1) {
      this.isCameraAnimating = false;
      this.camera = { ...this.targetCamera };
    }
  }
  startRenderLoop() {
    const loop = (timestamp) => {
      this.updateCameraAnimation(timestamp);
      this.render();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
  requestRender() {
  }
  render() {
    const ctx = this.ctx;
    const dpr = this.dpr;
    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.scale(dpr, dpr);
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.k, this.camera.k);
    for (const link of this.links) {
      this.renderer.drawLink(ctx, link);
    }
    let hoveredToDraw = null;
    for (const node of this.nodes) {
      if (node === this.hoveredNode) {
        hoveredToDraw = node;
      } else {
        this.renderer.drawNode(ctx, node, false);
      }
    }
    if (hoveredToDraw) {
      this.renderer.drawNode(ctx, hoveredToDraw, true);
    }
    ctx.restore();
  }
  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.simulation) this.simulation.stop();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
};

// packages/strata-graph/src/client/node-renderer.js
var NodeRenderer = class {
  constructor(options = {}) {
    this.options = {
      folderRadius: options.folderRadius || 42,
      articleRadius: options.articleRadius || 34,
      folderBorderColor: options.folderBorderColor || "#8EA8B5",
      articleBorderColor: options.articleBorderColor || "#1A1A1A",
      borderWidth: options.borderWidth || 2,
      hoverRingColor: options.hoverRingColor || "rgba(140, 166, 142, 0.6)",
      badgeBg: options.badgeBg || "#8CA68E",
      badgeText: options.badgeText || "#FFFFFF",
      labelFont: options.labelFont || "11px 'JetBrains Mono', monospace, sans-serif",
      labelColor: options.labelColor || "#1A1A1A",
      labelBg: options.labelBg || "rgba(234, 235, 215, 0.94)",
      ...options
    };
    this.imageCache = /* @__PURE__ */ new Map();
    this.pendingImages = /* @__PURE__ */ new Set();
    this.onImageLoadCallback = null;
  }
  setImageLoadCallback(cb) {
    this.onImageLoadCallback = cb;
  }
  /**
   * Preloads or retrieves cached image.
   * @param {string} url
   * @returns {HTMLImageElement|null}
   */
  getImage(url) {
    if (!url) return null;
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url);
    }
    if (!this.pendingImages.has(url)) {
      this.pendingImages.add(url);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        this.imageCache.set(url, img);
        this.pendingImages.delete(url);
        if (this.onImageLoadCallback) {
          this.onImageLoadCallback();
        }
      };
      img.onerror = () => {
        this.pendingImages.delete(url);
        this.imageCache.set(url, null);
      };
      img.src = url;
    }
    return null;
  }
  /**
   * Calculates radius for a node based on type and importance.
   * @param {object} node
   * @returns {number}
   */
  getNodeRadius(node) {
    if (node.radius) return node.radius;
    return node.type === "folder" ? this.options.folderRadius : this.options.articleRadius;
  }
  /**
   * Draws a link line between two nodes.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} link
   */
  drawLink(ctx, link) {
    if (!link.source || !link.target) return;
    const sx = link.source.x;
    const sy = link.source.y;
    const tx = link.target.x;
    const ty = link.target.y;
    if (isNaN(sx) || isNaN(sy) || isNaN(tx) || isNaN(ty)) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = "rgba(26, 26, 26, 0.22)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.restore();
  }
  /**
   * Draws a single node.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} node
   * @param {boolean} isHovered
   */
  drawNode(ctx, node, isHovered = false) {
    const x3 = node.x;
    const y3 = node.y;
    const r = this.getNodeRadius(node);
    const isFolder = node.type === "folder";
    if (isNaN(x3) || isNaN(y3)) return;
    ctx.save();
    if (isHovered) {
      ctx.beginPath();
      ctx.arc(x3, y3, r + 7, 0, Math.PI * 2);
      ctx.strokeStyle = this.options.hoverRingColor;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x3, y3, r + 12, 0, Math.PI * 2);
      ctx.strokeStyle = isFolder ? "#8EA8B5" : "#1A1A1A";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.beginPath();
    ctx.arc(x3, y3, r, 0, Math.PI * 2);
    ctx.fillStyle = isFolder ? "#D8D9C5" : "#EAEBD7";
    ctx.fill();
    const img = this.getImage(node.thumbnail);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x3, y3, r - 1, 0, Math.PI * 2);
      ctx.clip();
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const diameter = (r - 1) * 2;
      const scale = Math.max(diameter / imgW, diameter / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const drawX = x3 - drawW / 2;
      const drawY = y3 - drawH / 2;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    } else {
      this.drawFallbackGraphic(ctx, x3, y3, r, node, isFolder);
    }
    ctx.beginPath();
    ctx.arc(x3, y3, r, 0, Math.PI * 2);
    ctx.strokeStyle = isFolder ? this.options.folderBorderColor : this.options.articleBorderColor;
    ctx.lineWidth = isFolder ? 3 : this.options.borderWidth;
    ctx.stroke();
    if (isFolder) {
      ctx.beginPath();
      ctx.arc(x3, y3, r - 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(26, 26, 26, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (isFolder && node.itemCount !== void 0) {
      this.drawBadge(ctx, x3 + r * 0.7, y3 - r * 0.7, String(node.itemCount));
    }
    this.drawLabel(ctx, x3, y3 + r + 14, node.title || "Untitled", isFolder, isHovered);
    ctx.restore();
  }
  /**
   * Draws a stylized retro-technical fallback inside node if no image is present.
   */
  drawFallbackGraphic(ctx, x3, y3, r, node, isFolder) {
    ctx.save();
    ctx.strokeStyle = "rgba(26, 26, 26, 0.4)";
    ctx.lineWidth = 1.2;
    if (isFolder) {
      const fw = r * 0.9;
      const fh = r * 0.65;
      const fx = x3 - fw / 2;
      const fy = y3 - fh / 2 + 2;
      ctx.beginPath();
      ctx.rect(fx, fy, fw, fh);
      ctx.fillStyle = "rgba(142, 168, 181, 0.2)";
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(fx, fy - 5, fw * 0.45, 5);
      ctx.stroke();
      ctx.fillStyle = "#1A1A1A";
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("DIR", x3, y3 + 4);
    } else {
      ctx.beginPath();
      ctx.arc(x3, y3, r * 0.5, 0, Math.PI * 2);
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#1A1A1A";
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const initials = (node.title || "DOC").split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
      ctx.fillText(initials || "DOC", x3, y3);
    }
    ctx.restore();
  }
  /**
   * Draws a badge pill with text.
   */
  drawBadge(ctx, x3, y3, text) {
    ctx.save();
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    const textWidth = ctx.measureText(text).width;
    const pillW = Math.max(18, textWidth + 8);
    const pillH = 14;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x3 - pillW / 2, y3 - pillH / 2, pillW, pillH, 7) : ctx.rect(x3 - pillW / 2, y3 - pillH / 2, pillW, pillH);
    ctx.fillStyle = this.options.badgeBg;
    ctx.fill();
    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = this.options.badgeText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x3, y3);
    ctx.restore();
  }
  /**
   * Draws text label with a subtle background capsule for crisp readability.
   */
  drawLabel(ctx, x3, y3, text, isFolder, isHovered) {
    ctx.save();
    ctx.font = isHovered ? "bold 11px 'JetBrains Mono', monospace" : "10.5px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let display = text;
    if (display.length > 24) {
      display = display.substring(0, 22) + "...";
    }
    const paddingX = 6;
    const paddingY = 3;
    const metrics = ctx.measureText(display);
    const boxW = metrics.width + paddingX * 2;
    const boxH = 16;
    ctx.fillStyle = this.options.labelBg;
    ctx.strokeStyle = isHovered ? isFolder ? "#8EA8B5" : "#1A1A1A" : "rgba(26, 26, 26, 0.25)";
    ctx.lineWidth = isHovered ? 1.5 : 1;
    ctx.beginPath();
    ctx.rect(x3 - boxW / 2, y3 - boxH / 2, boxW, boxH);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = this.options.labelColor;
    ctx.fillText(display, x3, y3);
    ctx.restore();
  }
};

// packages/strata-graph/src/client/zoom-manager.js
var ZoomManager = class {
  constructor(containerElement, graphData, options = {}) {
    this.container = containerElement;
    this.data = graphData;
    this.options = {
      enableUrlSync: options.enableUrlSync !== false,
      ...options
    };
    this.currentPath = "/";
    this.historyStack = ["/"];
    this.onLevelChangeCallback = null;
    this.breadcrumbsEl = null;
    this.metaEl = null;
    this.buildHeaderDOM();
  }
  buildHeaderDOM() {
    const header = document.createElement("div");
    header.className = "strata-graph-header";
    const breadcrumbs = document.createElement("div");
    breadcrumbs.className = "strata-graph-breadcrumbs";
    this.breadcrumbsEl = breadcrumbs;
    const meta = document.createElement("div");
    meta.className = "strata-graph-level-meta";
    this.metaEl = meta;
    header.appendChild(breadcrumbs);
    header.appendChild(meta);
    this.container.insertBefore(header, this.container.firstChild);
    this.render();
  }
  setOnLevelChange(callback) {
    this.onLevelChangeCallback = callback;
  }
  getCurrentLevel() {
    return this.data.levels[this.currentPath] || this.data.root;
  }
  /**
   * Navigates to a specific folder path.
   * @param {string} path
   * @param {object} [sourceNode] - Node clicked to trigger this drill-down
   */
  async navigateTo(path, sourceNode = null) {
    const targetLevel = this.data.levels[path];
    if (!targetLevel) {
      console.warn(`[strata-graph] Level not found for path: ${path}`);
      return;
    }
    const previousPath = this.currentPath;
    this.currentPath = path;
    if (!this.historyStack.includes(path)) {
      this.historyStack.push(path);
    }
    this.render();
    if (this.onLevelChangeCallback) {
      await this.onLevelChangeCallback(targetLevel, sourceNode, previousPath);
    }
  }
  /**
   * Drills down into a folder node.
   * @param {object} folderNode
   */
  async drillDown(folderNode) {
    if (!folderNode || !folderNode.targetPath) return;
    await this.navigateTo(folderNode.targetPath, folderNode);
  }
  /**
   * Navigates one level up.
   */
  async navigateUp() {
    const current = this.getCurrentLevel();
    if (current && current.parentPath) {
      await this.navigateTo(current.parentPath);
    }
  }
  render() {
    const currentLevel = this.getCurrentLevel();
    if (!currentLevel) return;
    this.breadcrumbsEl.innerHTML = "";
    const crumbs = currentLevel.breadcrumbs || [{ title: "ROOT", path: "/" }];
    crumbs.forEach((crumb, idx) => {
      if (idx > 0) {
        const sep = document.createElement("span");
        sep.className = "strata-graph-separator";
        sep.textContent = ">";
        this.breadcrumbsEl.appendChild(sep);
      }
      const btn = document.createElement("button");
      btn.className = "strata-graph-crumb" + (idx === crumbs.length - 1 ? " active" : "");
      btn.textContent = crumb.title;
      btn.type = "button";
      if (idx !== crumbs.length - 1) {
        btn.addEventListener("click", () => {
          this.navigateTo(crumb.path);
        });
      }
      this.breadcrumbsEl.appendChild(btn);
    });
    const totalItems = (currentLevel.subfolderCount || 0) + (currentLevel.articleCount || 0);
    this.metaEl.innerHTML = `
      <span>[ DIRECTORY: <strong>${currentLevel.path.toUpperCase()}</strong> ]</span>
      <span class="strata-graph-count-pill">${totalItems} ${totalItems === 1 ? "NODE" : "NODES"}</span>
    `;
  }
};

// packages/strata-graph/src/client/modal-viewer.js
var ModalViewer = class {
  constructor(options = {}) {
    this.options = {
      onClose: null,
      ...options
    };
    this.isOpen = false;
    this.currentArticle = null;
    this.overlayEl = null;
    this.containerEl = null;
    this.bodyEl = null;
    this.buildDOM();
    this.bindEvents();
  }
  buildDOM() {
    const overlay = document.createElement("div");
    overlay.className = "sg-modal-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div class="sg-modal-container">
        <div class="sg-modal-header-bar">
          <div class="sg-modal-breadcrumb" id="sg-modal-breadcrumb">
            READING / ARTICLE
          </div>
          <button type="button" class="sg-modal-close-btn" id="sg-modal-close-btn" aria-label="Close article">
            <span>CLOSE</span>
            <span class="sg-modal-close-key">ESC</span>
          </button>
        </div>
        <div class="sg-modal-body" id="sg-modal-body">
          <!-- Injected dynamically -->
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    this.overlayEl = overlay;
    this.containerEl = overlay.querySelector(".sg-modal-container");
    this.bodyEl = overlay.querySelector("#sg-modal-body");
    this.breadcrumbEl = overlay.querySelector("#sg-modal-breadcrumb");
    this.closeBtn = overlay.querySelector("#sg-modal-close-btn");
  }
  bindEvents() {
    this.closeBtn.addEventListener("click", () => this.close());
    this.overlayEl.addEventListener("click", (e) => {
      if (e.target === this.overlayEl) {
        this.close();
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  }
  /**
   * Opens and renders an article.
   * @param {object} article
   */
  open(article) {
    if (!article) return;
    this.currentArticle = article;
    this.isOpen = true;
    const folderLabel = (article.folderPath || "/").toUpperCase();
    this.breadcrumbEl.textContent = `CATALOG: ${folderLabel} / ${article.title.toUpperCase()}`;
    const tagsHtml = (article.tags || []).map((tag) => `<span class="sg-article-tag">#${tag}</span>`).join(" ");
    const heroImgHtml = article.thumbnail ? `<img src="${article.thumbnail}" alt="${article.title}" class="sg-article-hero-img" />` : "";
    const metaParts = [];
    if (article.date) metaParts.push(`<span>DATE: ${article.date}</span>`);
    if (article.readingTime) metaParts.push(`<span>TIME: ${article.readingTime}</span>`);
    if (article.wordCount) metaParts.push(`<span>WORDS: ${article.wordCount}</span>`);
    this.bodyEl.innerHTML = `
      <header class="sg-article-hero">
        <div class="sg-article-meta-line">
          ${metaParts.join(" &bull; ")}
        </div>
        <h1 class="sg-article-title">${article.title}</h1>
        ${tagsHtml ? `<div class="sg-article-tags">${tagsHtml}</div>` : ""}
        ${heroImgHtml}
      </header>
      <article class="sg-article-content">
        ${article.htmlContent || `<p>${article.description || article.summary || "No content provided."}</p>`}
      </article>
    `;
    this.bodyEl.scrollTop = 0;
    this.overlayEl.classList.add("is-active");
    this.overlayEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      this.closeBtn.focus();
    }, 50);
  }
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.overlayEl.classList.remove("is-active");
    this.overlayEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (this.options.onClose) {
      this.options.onClose();
    }
  }
  destroy() {
    if (this.overlayEl && this.overlayEl.parentNode) {
      this.overlayEl.parentNode.removeChild(this.overlayEl);
    }
  }
};

// packages/strata-graph/src/client/strata-graph.js
var StrataGraph = class {
  /**
   * @param {object} config
   * @param {string|HTMLElement} config.container - Target element or selector
   * @param {string|object} [config.data] - Data object or URL to JSON
   * @param {string} [config.dataUrl] - URL to JSON
   * @param {object} [config.options] - Customization options
   */
  constructor(config = {}) {
    this.container = typeof config.container === "string" ? document.querySelector(config.container) : config.container;
    if (!this.container) {
      throw new Error(`[strata-graph] Container element not found: ${config.container}`);
    }
    this.dataUrl = config.dataUrl || (typeof config.data === "string" ? config.data : null);
    this.data = typeof config.data === "object" ? config.data : null;
    this.options = config.options || {};
    this.renderer = null;
    this.canvasEngine = null;
    this.zoomManager = null;
    this.modalViewer = null;
    this.wrapperEl = null;
    this.viewportEl = null;
    this.canvasEl = null;
    this.init();
  }
  async init() {
    this.buildDOM();
    if (this.dataUrl && !this.data) {
      try {
        const response = await fetch(this.dataUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.data = await response.json();
      } catch (err) {
        console.error("[strata-graph] Failed to load data:", err);
        this.renderErrorState(`Failed to load graph data from ${this.dataUrl}`);
        return;
      }
    }
    if (!this.data) {
      this.renderErrorState("No graph data provided to strata-graph.");
      return;
    }
    this.renderer = new NodeRenderer(this.options.nodeOptions);
    this.canvasEngine = new CanvasEngine(this.canvasEl, this.renderer, this.options.canvasOptions);
    this.zoomManager = new ZoomManager(this.wrapperEl, this.data, this.options.zoomOptions);
    this.modalViewer = new ModalViewer(this.options.modalOptions);
    this.wireSubsystems();
    const initialLevel = this.data.root || this.data.levels["/"];
    if (initialLevel) {
      this.canvasEngine.setData(initialLevel.nodes, initialLevel.links);
    }
  }
  buildDOM() {
    this.container.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "strata-graph-wrapper";
    const viewport = document.createElement("div");
    viewport.className = "strata-graph-viewport";
    const canvas = document.createElement("canvas");
    canvas.className = "strata-graph-canvas";
    const controls = document.createElement("div");
    controls.className = "strata-graph-controls";
    controls.innerHTML = `
      <button type="button" class="strata-graph-btn" id="sg-zoom-in" title="Zoom In">+</button>
      <button type="button" class="strata-graph-btn" id="sg-zoom-out" title="Zoom Out">&minus;</button>
      <button type="button" class="strata-graph-btn" id="sg-zoom-reset" title="Reset View">&#x2316;</button>
    `;
    const hint = document.createElement("div");
    hint.className = "strata-graph-hint";
    hint.innerHTML = `
      <div class="strata-graph-hint-item">
        <span class="strata-graph-hint-dot folder"></span>
        <span>FOLDER / DIRECTORY</span>
      </div>
      <div class="strata-graph-hint-item">
        <span class="strata-graph-hint-dot article"></span>
        <span>ARTICLE / READ</span>
      </div>
    `;
    viewport.appendChild(canvas);
    viewport.appendChild(controls);
    viewport.appendChild(hint);
    wrapper.appendChild(viewport);
    this.container.appendChild(wrapper);
    this.wrapperEl = wrapper;
    this.viewportEl = viewport;
    this.canvasEl = canvas;
    controls.querySelector("#sg-zoom-in").addEventListener("click", () => {
      if (this.canvasEngine) this.canvasEngine.zoomIn();
    });
    controls.querySelector("#sg-zoom-out").addEventListener("click", () => {
      if (this.canvasEngine) this.canvasEngine.zoomOut();
    });
    controls.querySelector("#sg-zoom-reset").addEventListener("click", () => {
      if (this.canvasEngine) this.canvasEngine.resetView(true);
    });
  }
  wireSubsystems() {
    this.canvasEngine.onFolderClick = async (folderNode) => {
      await this.canvasEngine.zoomToNode(folderNode, 400);
      await this.zoomManager.drillDown(folderNode);
    };
    this.canvasEngine.onArticleClick = (articleNode) => {
      const articleData = this.data.articles[articleNode.articleId || articleNode.id];
      if (articleData) {
        this.modalViewer.open(articleData);
      } else {
        this.modalViewer.open(articleNode);
      }
    };
    this.zoomManager.setOnLevelChange((targetLevel, sourceNode) => {
      this.canvasEngine.setData(targetLevel.nodes, targetLevel.links, sourceNode);
    });
  }
  renderErrorState(message) {
    if (this.viewportEl) {
      this.viewportEl.innerHTML = `
        <div style="padding: 2rem; color: #1a1a1a; font-family: monospace;">
          <h3 style="color: #c00;">[STRATA-GRAPH ERROR]</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }
  /**
   * Directly opens an article by ID.
   * @param {string} articleId
   */
  openArticle(articleId) {
    const article = this.data && this.data.articles ? this.data.articles[articleId] : null;
    if (article && this.modalViewer) {
      this.modalViewer.open(article);
    }
  }
  /**
   * Directly navigates to a level.
   * @param {string} path
   */
  setLevel(path) {
    if (this.zoomManager) {
      this.zoomManager.navigateTo(path);
    }
  }
  destroy() {
    if (this.canvasEngine) this.canvasEngine.destroy();
    if (this.modalViewer) this.modalViewer.destroy();
    if (this.container) this.container.innerHTML = "";
  }
};
if (typeof window !== "undefined") {
  window.StrataGraph = StrataGraph;
}
export {
  StrataGraph
};
