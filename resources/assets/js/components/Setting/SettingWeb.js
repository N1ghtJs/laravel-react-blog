import React, { Component } from 'react';
import { Form, Input, Button, message, Spin, Icon, Radio, Popover, Badge, Alert } from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
      web_name:'',
      file_disk:''
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
    //本地系统盘提示框
    const fileDiskTipsLocal = (
      <div>
          <Badge status="default" text="无需配置，直接使用" /><br/>
          <Badge status="warning" text="本地系统盘空间较小，不推荐使用系统盘存放图片！" />
      </div>
    );
    //腾讯云COS提示框
    const fileDiskTipsCOS = (
      <div>
          <Badge status="default" text="需要手动完成配置才能使用，配置方法见源码readme" /><br/>
          <Badge status="processing" text="静态存储访问速度快，空间大，推荐使用此项！" />
      </div>
    );

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
          <FormItem {...formItemLayout} label="图片存储位置" extra={<Alert message="切换图片存储位置后，未同步的图片会无法显示" type="warning" showIcon />}>
            {getFieldDecorator('file_disk', {
              rules: [{
                required: true,
                message: '图片存储位置不能为空！',
              }],
              initialValue: formData.file_disk
            })(
                <RadioGroup defaultValue="local">
                    <Popover content={fileDiskTipsLocal} >
                        <RadioButton value="local">本地系统盘</RadioButton>
                    </Popover>
                    <Popover content={fileDiskTipsCOS}>
                        <RadioButton value="cos">腾讯云静态存储COS</RadioButton>
                    </Popover>
                </RadioGroup>
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

const WrappedSettingWebForm = Form.create()(SettingWebForm);
