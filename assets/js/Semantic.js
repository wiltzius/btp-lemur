import React from "react";
import {
  Button,
  Dropdown,
  Select,
  Container,
  Divider,
  Input,
  Form,
  Header,
  Grid,
  Image,
  Menu,
  Segment,
  Tab,
  Card
} from 'semantic-ui-react'

export class SemanticTest extends React.Component {

  render() {
    const facilities = [{text: 'Foo', value: 'foo'}, {text: 'Bar', value: 'bar'}];
    const panes = [
      {
        menuItem: 'Add Inmate', render: () => <Tab.Pane>
        <Form>
          <Form.Group widths='equal'>
            <Form.Field required>
              <label>First Name</label>
              <Input type='text'
                     placeholder='First Name'/>
            </Form.Field>
            <Form.Field required>
              <label>Last Name</label>
              <Input type='text'
                     placeholder='Last Name'/>
            </Form.Field>
            <Form.Field required>
              <label>Inmate ID</label>
              <Input type='text'
                     placeholder='Inmate ID'/>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field required
                        width='4'>
              <label>Facility</label>
              <Select options={facilities}
                      placeholder='Facility'/>
            </Form.Field>
            <Form.Field disabled
                        width='10'>
              <label>Address</label>
              <Input type='text'
                     fluid
                     placeholder='Address'/>
            </Form.Field>
          </Form.Group>
          <Button content='Add Inmate'/>
        </Form>
      </Tab.Pane>
      },
      {menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>},
      {menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane>},
    ];
    return <Container style={{marginTop: '3em'}}>
      <Header>Hello</Header>
      <Tab panes={panes}/>
    </Container>

  }

}