/// Copyright by Erik Weitnauer, 2013.

/// testing with nodeunit
var assert = require('nodeunit').assert;
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
