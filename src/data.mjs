export const categories = ['Housing','Food','Transport','Utilities','Health','Entertainment'];
export function makeTransactions(count=10000) {
  const rows=[];
  for(let i=0;i<count;i++){
    const amount= i%7===0 ? 2200 : -(15+((i*37)%185));
    rows.push({id:i+1,date:new Date(Date.UTC(2025,0,1+i%365)).toISOString().slice(0,10),
      merchant:amount>0?'Payroll':'Merchant '+(i%79),
      category:amount>0?'Income':categories[i%categories.length], amount});
  }
  return rows;
}
export function analytics(rows) {
  const spending=new Map();
  const ordered=[...rows].sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id);
  let balance=0;
  const byDay=new Map();
  for(const row of ordered){
    if(row.amount<0)spending.set(row.category,(spending.get(row.category)||0)-row.amount);
    balance+=row.amount;
    byDay.set(row.date,balance);
  }
  return {categories:[...spending].map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value),
    balance:[...byDay].map(([date,value])=>({date,value})),net:balance};
}

