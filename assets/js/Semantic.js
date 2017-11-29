import _ from 'lodash';
import React from "react";
import {
  Button,
  Dropdown,
  Select,
  Container,
  Item,
  List,
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


class OrderBuild extends React.PureComponent {

  render() {
    return <Segment>
      <Segment.Group horizontal>
        <Segment>
          <Form>
            <Form.Field required>
              <label>First Name</label>
              <Input type='text'
                     placeholder='First Name'/>
            </Form.Field>
          </Form>
        </Segment>
        <Segment>order cart</Segment>
      </Segment.Group>
    </Segment>
  }

}

export class SemanticTest extends React.Component {

  form() {
    const facilities = [{text: 'Foo', value: 'foo'}, {text: 'Bar', value: 'bar'}];
    return <Form>
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
                    width='5'>
          <label>Facility</label>
          <Select options={facilities}
                  placeholder='Facility'/>
        </Form.Field>
        <Form.Field disabled
                    width='11'>
          <label>Address</label>
          <Input type='text'
                 fluid
                 placeholder='Address'/>
        </Form.Field>
      </Form.Group>
      <Button content='Add Inmate'/>
    </Form>
  }

  results() {
    return <Item.Group divided>
      <For each="thing"
           of={_.range(10)}>
        <Item key={thing}>
          {/*<List.Icon></List.Icon>*/}
          <Item.Content>
            <Item.Header>Some Body</Item.Header>
            <Item.Description>lives here</Item.Description>
          </Item.Content>
        </Item>

      </For>
    </Item.Group>
  }

  render() {
    return <Container style={{marginTop: '3em'}}>
      <Header>Hello</Header>
      <Menu>
        <Menu.Item>
          Search Inmates
        </Menu.Item>
        <Menu.Item>
          Add/Edit Inmate
        </Menu.Item>
        <Menu.Item>
          Send Out Order
        </Menu.Item>
      </Menu>
      {/*<Segment>*/}
      {/*{this.form()}*/}
      {/*<Divider section hidden />*/}
      {/*{this.results()}*/}
      {/*</Segment>*/}
      <OrderBuild/>
    </Container>
  }

}