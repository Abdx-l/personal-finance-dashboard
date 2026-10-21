import React,{useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ColumnDef,flexRender,getCoreRowModel,getFilteredRowModel,getSortedRowModel,SortingState,useReactTable} from '@tanstack/react-table';
import {useVirtualizer} from '@tanstack/react-virtual';
import {Cell,Legend,Line,LineChart,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {analytics,categories,makeTransactions} from './data.mjs';
import './style.css';

type Transaction={id:number,date:string,merchant:string,category:string,amount:number};
const money=(value:number)=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(value);
const all=makeTransactions() as Transaction[];
const colors=['#174a8b','#9b3e10','#52600c','#732c7b','#00665c','#853448'];

function App(){
  const [search,setSearch]=useState(''),[category,setCategory]=useState('All'),[sorting,setSorting]=useState<SortingState>([{id:'date',desc:true}]);
  const filtered=useMemo(()=>all.filter(row=>(category==='All'||row.category===category)&&
    (row.merchant.toLowerCase().includes(search.toLowerCase())||row.date.includes(search))),[category,search]);
  const summary=useMemo(()=>analytics(filtered),[filtered]);
  const columns=useMemo<ColumnDef<Transaction>[]>(()=>[
    {accessorKey:'date',header:'Date'},
    {accessorKey:'merchant',header:'Merchant'},
    {accessorKey:'category',header:'Category'},
    {accessorKey:'amount',header:'Amount',cell:info=>money(info.getValue() as number)}
  ],[]);
  const table=useReactTable({data:filtered,columns,state:{sorting},onSortingChange:setSorting,
    getCoreRowModel:getCoreRowModel(),getSortedRowModel:getSortedRowModel(),getFilteredRowModel:getFilteredRowModel()});
  const rows=table.getRowModel().rows;
  const scrollRef=useRef<HTMLDivElement>(null);
  const virtual=useVirtualizer({count:rows.length,getScrollElement:()=>scrollRef.current,estimateSize:()=>42,overscan:8});
  return <><a className="skip" href="#main">Skip to dashboard</a><header><h1>Personal Finance Dashboard</h1><p>Demo transactions only</p></header>
    <main id="main"><section className="controls" aria-label="Transaction filters">
      <label>Search merchant or date <input value={search} onChange={e=>setSearch(e.target.value)} type="search"/></label>
      <label>Category <select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option><option>Income</option>{categories.map(x=><option key={x}>{x}</option>)}</select></label>
      <p aria-live="polite">{rows.length.toLocaleString()} transactions � Net {money(summary.net)}</p></section>
      <div className="charts"><section><h2>Spending by category</h2><div className="chart">
        <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={summary.categories} dataKey="value" nameKey="name" innerRadius={48} outerRadius={90}>
          {summary.categories.map((entry,i)=><Cell key={entry.name} fill={colors[i%colors.length]}/>)}</Pie><Tooltip formatter={(value:number)=>money(value)}/><Legend/></PieChart></ResponsiveContainer></div></section>
      <section><h2>Running balance</h2><div className="chart"><ResponsiveContainer width="100%" height="100%">
        <LineChart data={summary.balance}><XAxis dataKey="date" hide/><YAxis width={68}/><Tooltip formatter={(value:number)=>money(value)}/><Line type="monotone" dataKey="value" stroke="#174a8b" dot={false}/></LineChart>
      </ResponsiveContainer></div></section></div>
      <section><h2>Chart data</h2><table className="summary"><thead><tr><th scope="col">Category</th><th scope="col">Spent</th></tr></thead><tbody>
        {summary.categories.map(item=><tr key={item.name}><th scope="row">{item.name}</th><td>{money(item.value)}</td></tr>)}</tbody></table></section>
      <section><h2>Transactions</h2><div className="scroll" ref={scrollRef} role="region" aria-label="Scrollable transactions" tabIndex={0}>
        <table className="transactions"><thead><tr>{table.getHeaderGroups()[0].headers.map(header=><th scope="col" key={header.id}
          aria-sort={header.column.getIsSorted()==='asc'?'ascending':header.column.getIsSorted()==='desc'?'descending':'none'}>
          <button onClick={header.column.getToggleSortingHandler()}>{flexRender(header.column.columnDef.header,header.getContext())} {header.column.getIsSorted()==='asc'?'':header.column.getIsSorted()==='desc'?'':''}</button></th>)}</tr></thead>
          <tbody style={{height:virtual.getTotalSize(),position:'relative'}}>
            {virtual.getVirtualItems().map(item=><tr key={rows[item.index].id} style={{position:'absolute',transform:`translateY(${item.start}px)`,height:item.size,width:'100%'}}>
              {rows[item.index].getVisibleCells().map(cell=><td key={cell.id}>{flexRender(cell.column.columnDef.cell,cell.getContext())}</td>)}</tr>)}
          </tbody></table></div></section></main></>;
}
createRoot(document.getElementById('root')!).render(<App/>);

