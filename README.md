# Personal Finance Dashboard

A client-side React dashboard with 10,000 deterministic demo transactions. TanStack Table v8 provides sorting and filtering, TanStack Virtual keeps the rendered row count small, and Recharts draws category spending and running balance. A plain data table under the charts gives the same numbers to screen-reader and keyboard users. The app has a skip link, labelled controls, and `aria-sort` headers.

```sh
npm install
npm run dev
npm test
```

All values are generated sample data. Nothing is connected to a bank or transmitted to a server. The core aggregation tests run with Node; a browser accessibility audit and Lighthouse score still need to be run in a full browser environment.

