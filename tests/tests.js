/// Copyright by Erik Weitnauer, 2013.

/// testing with nodeunit
var Tree   = require('../tree.js').Tree;

exports['Tree'] = function(test) {
  var t1 = new Tree();
  var n = {};
  var t2 = new Tree(n);

  test.equals(t1.children.length, 0);
  test.equals(t2.children.length, 1);
  test.equals(t2.children[0], n);
  test.equals(t2.children[0].parent, t2);

  test.done();
}

exports['parse'] = function(test) {
  var t1 = Tree.parse('[]');
  var t2 = Tree.parse('[A,B]');
  var t3 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');

  test.equals(t1.children.length, 1);

  test.equals(t2.children.length, 2);
  test.equals(t2.children[0].value, 'A');
  test.equals(t2.children[1].value, 'B');
  test.equals(t2.children[0].rs.value, 'B');
  test.equals(t2.children[1].ls.value, 'A');
  test.equals(t2.children[0].children.length, 0);
  test.equals(t2.children[1].children.length, 0);

  test.equals(t3.children.length, 3);
  test.equals(t3.children[0].children.length, 2);
  test.equals(t3.children[1].children.length, 0);
  test.equals(t3.children[2].children.length, 1);
  test.equals(t3.children[2].children[0].children.length, 1);
  test.equals(t3.children[2].children[0].children[0].children.length, 0);

  test.done();
}

exports['stringify'] = function(test) {
  var t1 = new Tree();
  test.equals(t1.stringify(), '[]');
  test.equals(Tree.parse('[A,B]').stringify(), '[A,B]');
  test.equals(Tree.parse('[A[A1,A2],B,C[C1[C11]]]').stringify(), '[A[A1,A2],B,C[C1[C11]]]');

  test.done();
}

exports['uid'] = function(test) {
  var ids = [], hexp = /[\da-fA-F]{16}/;
  for (var i=0; i<500; i++) {
    var id = Tree.uid();
    test.ok(ids.indexOf(id)===-1);
    test.ok(hexp.test(id));
    ids.push(id);
  }

  test.done();
}

exports['validate'] = function(test) {
  var t1 = new Tree();
  test.doesNotThrow(function() {t1.validate()});

  var t2 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  test.doesNotThrow(function() {t2.validate()});

  var t3 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  t3.children[2].children[0].children[0].parent = null;
  test.throws(function() {t3.validate()});

  var t3b = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  t3b.children[2].children[0].children[0].parent = t3b.children[2];
  test.throws(function() {t3b.validate()});

  var t4 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  t4.children[0].children[0].rs = null;
  test.throws(function() {t4.validate()});

  var t5 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  t5.children[0].children[1].ls = null;
  test.throws(function(){t5.validate()});

  var t6 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  t6.children[0].children = t6.children[0].children.slice(1);
  test.throws(function(){t6.validate()});

  test.done();
}

exports['insert_range'] = function(test) {
  var t0 = new Tree();
  Tree.insert_range(t0, 0, Tree.parse('[a,b]').children);
  test.equals(t0.stringify(), '[a,b]');
  test.doesNotThrow(function(){t0.validate()});

  var t1 = Tree.parse('[A,B]');
  Tree.insert_range(t1, 1, Tree.parse('[a,b,c]').children.slice(1,3));
  test.equals(t1.stringify(), '[A,b,c,B]');
  test.doesNotThrow(function(){t1.validate()});

  var t2 = Tree.parse('[A,B]');
  Tree.insert_range(t2, 1, []);
  test.equals(t2.stringify(), '[A,B]');
  test.doesNotThrow(function(){t2.validate()});

  test.done();
}

exports['remove_range'] = function(test) {
  test.doesNotThrow(function(){Tree.remove_range([])});

  var t1 = Tree.parse('[A,B,C]');
  var idx = Tree.remove_range([t1.children[1]]);
  test.equals(t1.stringify(), '[A,C]');
  test.equals(idx, 1);
  test.doesNotThrow(function(){t1.validate()});

  var t2 = Tree.parse('[A,B[a,b],C,D]');
  idx = Tree.remove_range(t2.children.slice(0,3));
  test.equals(t2.stringify(), '[D]');
  test.equals(idx, 0);
  test.doesNotThrow(function(){t2.validate()});

  test.done();
}

exports['insert'] = function(test) {
  var t0 = new Tree();
  Tree.insert(t0, 0, {value:'A'});
  test.equals(t0.stringify(), '[A]');
  test.doesNotThrow(function(){t0.validate()});

  var t1 = Tree.parse('[A,B]');
  Tree.insert(t1, 1, {value: 'AB'});
  test.equals(t1.stringify(), '[A,AB,B]');
  test.doesNotThrow(function(){t1.validate()});

  test.done();
}

exports['get_child'] = function(test){
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]')
  test.equals(t1.get_child([0]).value, 'A')
  test.equals(t1.get_child([1]).value, 'B')
  test.equals(t1.get_child([1, 1]).value, 'b')
  test.equals(t1.get_child([3,0,2,1]).value, '2')
  test.throws(function(){t1.get_child([4])})
  test.throws(function(){t1.get_child([1,3])})
  test.throws(function(){t1.get_child([1,0,0])})

  test.done()
}

exports['get_path'] = function(test){
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]')

  test.deepEqual(Tree.get_path(t1.children[0]), [0])
  test.deepEqual(Tree.get_path(t1.children[1]), [1])
  test.deepEqual(Tree.get_path(t1.children[1].children[1]), [1,1])
  test.deepEqual(Tree.get_path(t1.get_child([3,0,2,1])), [3,0,2,1])

  test.throws(function(){Tree.get_path('8')})

  test.done()
}
