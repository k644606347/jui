import * as React from 'react';
import './App.css';
import Hello from './components/Hello';

import Button from './components/Button';
import logo from './logo.svg';
import Icon from './components/Icon';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button>btn1</Button>
        <Button type={'primary'}>btn2</Button>
        <Button type="danger" size="large">btn2</Button>
        <Button type="dashed" size="small">btn3</Button>
        <Button shape="circle" loading={true}>btn4</Button>
        <Button icon="search">btn5</Button>
        <Button loading={true} icon="cloud" inline={true}>inline btn</Button>
        <Icon icon="ambulance" size="2x" rotation={90} flip="vertical" border={true} pulse={true} spin={true}/>
        <a href="www.baidu.com">link1</a>
        <a onClick={this.link2}>link2</a>
        <Hello name="TypeScript" enthusiasmLevel={10} />
      </div>
    );
  }
  private link2(e:any) {
    window.alert(e);
  }
}

export default App;
