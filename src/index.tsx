import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import DevPane from './utils/DevPane';
import Tools from './utils/Tools';
import ConsoleLog from './utils/ConsoleLog';

const tools = Tools.getInstance();
tools.isDev() && ConsoleLog.init();
ReactDOM.render(
  <React.Fragment>
    <App />
    {tools.isDev() ? <DevPane /> : ''}
  </React.Fragment>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
