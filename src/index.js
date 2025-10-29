import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers/index';
import App from './App'
import './index.css'


const root = ReactDOM.createRoot(document.getElementById('root'));

const store = createStore(reducers);


root.render(

  <React.StrictMode>

    <Provider store={store}>
    
      <App />

    </Provider>

  </React.StrictMode>
);



// measure and report performance
// reportWebVitals(console.log);
