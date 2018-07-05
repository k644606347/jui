import * as React from 'react';
import * as enzyme from 'enzyme';
import Button from './Button';

it('render: <Button />', () => {
  const btn = enzyme.shallow(<Button />);
});

it('render: <Button type />', () => {
  const btn = enzyme.shallow(<div>
    <Button type="primary"/>
    <Button type="warning"/>
    <Button type="dashed"/>
  </div>);
});

it('render: <Button shape />', () => {
  const btn = enzyme.shallow(<Button shape="circle"/>);
});

it('render: <Button icon />', () => {
    enzyme.shallow(<div>
      <Button icon="cloud" />
      <Button icon="cloud-download" />
      <Button icon="cloud-upload" />
      <Button icon="download" />
      <Button icon="loading" />
      <Button icon="power-off" />
      <Button icon="search" />
    </div>);
});

it('render <Button size />', () => {
  enzyme.shallow(<div>
    <Button size="default" />
    <Button size="large" />
    <Button size="small" />
  </div>);
});
it('render <Button inline />', () => {
  enzyme.shallow(<div>
    <Button inline={true} />
    <Button inline={false} />
  </div>);
});
it('render <Button disabled />', () => {
  enzyme.shallow(<div>
    <Button disabled={true} />
    <Button disabled={false} />
  </div>);
});
it('render <Button loading />', () => {
  enzyme.shallow(<div>
    <Button loading={true}/>
    <Button loading={false}/>
</div>);
});
it('render <Button style />', () => {
  enzyme.shallow(<div>
    <Button style={{ color: 'red' }}/>
</div>);
});
it('render <Button className />', () => {
  enzyme.shallow(<div>
    <Button className="cls1"/>
</div>);
});
it('render <Button activeClassName />', () => {
  enzyme.shallow(<div>
    <Button activeClassName="activeCls1"/>
</div>);
});
it('render child', () => {
  enzyme.shallow(<div>
    <Button>
    {'btn1'}
    </Button>
</div>);
});
it('render onClick', () => {
  let click = () => {
    alert('btn clicked!');
  }
  
  enzyme.shallow(<div>
    <Button onClick={click} />
</div>);
});
it('render all props and child', () => {
  enzyme.shallow(<div>
    <Button icon="cloud" loading={true} type="warning" className="cls1" activeClassName="activeCls1" style={{color: 'green'}} disabled={true} inline={true} shape="circle">
    {'btn1'}
    </Button>
</div>);
});