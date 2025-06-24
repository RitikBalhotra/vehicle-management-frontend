import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { Provider } from 'react-redux';
// import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';
import AppToast from './Components/UI/AppToast';
import Spinner from './Components/UI/Spinner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <AppToast />
    <BrowserRouter>
      <Spinner />
      <App />
    </BrowserRouter>
    {/* </Provider> */}
  </React.StrictMode>
);
