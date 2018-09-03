import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import Tools from '../utils/Tools';
import DevPane from './DevPane';
import App from './App';

const tools = Tools.getInstance();
ReactDOM.render(
  <React.Fragment>
    <App />
    {tools.isDev() ? <DevPane /> : ''}
  </React.Fragment>,
  document.getElementById('root') as HTMLElement
);