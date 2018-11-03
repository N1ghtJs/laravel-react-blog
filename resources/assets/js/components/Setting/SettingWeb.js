import React, { Component } from 'react';
import { Form, Input, Button, message, Spin, Icon } from 'antd';
const FormItem = Form.Item;

export class SettingWeb extends React.Component {
  render(){
    return (
        <WrappedSettingWebForm />
    )
  }
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class SettingWebForm extends React.Component {
  state={
    loading: true,
    formData:{
      web_name:''
    }
  }
  componentWillMount() {
    let that = this;
    let keys = [];
    for(let i in this.state.formData){
      keys.push(i);
    }
    axios.get('z/settings?keys='+ keys.join(','))
    .then((response) => {
      this.setState({
        loading: false,
        formData: response.data.data
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formData = this.state.formData;
    if (this.state.loading) {
      return (
        <Spin
          style={{margin:'30px 50%'}}
          indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}/>
      )
    }else {
      return (
        <Form onSubmit={this.handleSubmit} style={{ paddingTop:20 }}>
          <FormItem {...formItemLayout} label="网站名称">
            {getFieldDecorator('web_name', {
              rules: [{
                required: true,
                message: '网站名称不能为空！',
              }],
              initialValue: formData.web_name
            })(
              <Input placeholder="请输入网站名称" />
            )}
          </FormItem>
          <FormItem {...formTailLayout}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </FormItem>
        </Form>
      )
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post('z/settings', values)
        .then(function (response) {
          message.success(response.data.message);
        })
        .catch(function (error) {
          console.log(error);
          message.error('error');
        });
      }
    });
  }
}

const WrappedSettingWebForm = Form.create()(SettingWebForm);
