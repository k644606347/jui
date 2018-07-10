import * as React from 'react';
import './App.css';
import Hello from './components/Hello';

import Button from './components/Button';
import logo from './logo.svg';
import Icon from './components/Icon';
import { icon500px_brand, iconAccessibleIcon_brand, iconAddressBook_solid } from './components/icons/FontAwesomeMap';

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
        <Button type="warning" size="large" loading={true}>btn3</Button>
        <Button icon={<React.Fragment><Icon style={{marginRight: '20px'}} icon={icon500px_brand} /></React.Fragment>} disabled={true}>disabled btn</Button>
        <Button type="dashed" size="small">small btn</Button>
        <Button size="large">large btn</Button>
        <Button loading={true} icon='cloud' inline={true}>inline btn</Button>
        <Button shape="circle" loading={true} inline={true} size="large">btn4</Button>
        <Button className="body-btn" type={'primary'}>custom className</Button>
        <Icon icon={icon500px_brand} size="2x" rotation={90} flip="vertical" border={true} pulse={true} spin={true}/>
        <Icon icon={iconAccessibleIcon_brand} size="2x" rotation={90} flip="vertical" border={true} pulse={true} spin={true}/>
        <Icon icon={iconAddressBook_solid} size="2x" rotation={90} flip="vertical" border={true} pulse={true} spin={true}/>
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
