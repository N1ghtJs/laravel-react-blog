import React, { Component } from 'react';
import { Form, Input, Button, message, Spin, Icon } from 'antd';
const FormItem = Form.Item;

export class SettingPersonal extends React.Component {
  render(){
    return (
      <WrappedSettingPersonalForm />
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

class SettingPersonalForm extends React.Component {
  state={
    formData:{
      name:'',
      email:''
    }
  }
  componentWillMount() {
    let that = this;
    let keys = [];
    for(let i in this.state.formData){
      keys.push(i);
    }
    if (master) {
        this.setState({
            formData: master,
        })
    }

    // axios.get('z/users/1')
    // .then((response) => {
    //   this.setState({
    //     loading: false,
    //     formData: response.data.data
    //   });
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formData = this.state.formData;
      return (
        <Form onSubmit={this.handleSubmit} style={{ paddingTop:20 }}>
          <FormItem {...formItemLayout} label="昵称">
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '昵称不能为空！',
              }],
              initialValue: formData.name
            })(
              <Input placeholder="请输入昵称" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              rules: [{
                  required: true,
                  message: '邮箱不能为空！'
                },{
                    type: 'email',
                    message: '邮箱格式不正确！'
                }],
                initialValue: formData.email
            })(
              <Input placeholder="请输入邮箱" />
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
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post('z/users/1', values)
        .then(function (response) {
          message.success(response.data.message);
          location.reload();
        })
        .catch(function (error) {
          console.log(error);
          message.error('error');
        });
      }
    });
  }
}

const WrappedSettingPersonalForm = Form.create()(SettingPersonalForm);
