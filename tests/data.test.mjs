import test from 'node:test';
import assert from 'node:assert/strict';
import {analytics,makeTransactions} from '../src/data.mjs';

test('large deterministic dataset',()=>{
  const rows=makeTransactions(10000);
  assert.equal(rows.length,10000);
  assert.equal(new Set(rows.map(x=>x.id)).size,10000);
  assert.deepEqual(makeTransactions(4),rows.slice(0,4));
});
test('category spending and chronological balance',()=>{
  const rows=[{id:2,date:'2026-01-02',category:'Food',amount:-20},
    {id:1,date:'2026-01-01',category:'Income',amount:100},
    {id:3,date:'2026-01-03',category:'Food',amount:-10}];
  const result=analytics(rows);
  assert.deepEqual(result.categories,[{name:'Food',value:30}]);
  assert.deepEqual(result.balance.map(x=>x.value),[100,80,70]);
  assert.equal(result.net,70);
});

