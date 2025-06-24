import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { Provider } from 'react-redux';
// import { store } from './app/store';
import Spinner from './Components/UI/Spinner';
import { BrowserRouter } from 'react-router-dom';
import AppToast from './Components/UI/AppToast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <Spinner />
    <AppToast />
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </Provider> */}
  </React.StrictMode>
);
