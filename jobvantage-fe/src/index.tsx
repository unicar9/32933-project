import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';

import { extendTheme } from '@chakra-ui/react';

// const breakpoints = {
//   sm: '30em',
//   md: '48em',
//   lg: '62em',
//   xl: '80em',
//   '2xl': '96em',
// };

// const theme = extendTheme({
//   colors: {
//     teal: {
//       500: '#317773',
//     },
//   },
//   breakpoints,
// });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <AppRouter />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
