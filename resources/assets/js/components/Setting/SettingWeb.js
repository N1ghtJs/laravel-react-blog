import React, { Component } from 'react';
import { Form, Input, Button, message, Spin, Icon, Radio, Popover, Badge, Alert, Switch } from 'antd';
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
      file_disk:'',
      comment_email:0,
      reply_email:0,
      web_icp:'',
    }
  }
  componentWillMount() {
    let that = this;
    let keys = [];
    for(let i in this.state.formData){
      keys.push(i);
    }
    axios.get(window.apiURL + 'settings?keys='+ keys.join(','))
    .then((response) => {
      console.log(response);
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
          <FormItem {...formItemLayout} label="网站名称" extra={<Alert message="网站名称不要轻易更换，影响SEO排名" type="warning" showIcon />}>
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
                message: '请选择图片存储位置！',
              }],
              initialValue: formData.file_disk
            })(
                <RadioGroup>
                    <Popover
                      content={(
                        <div>
                            <Badge status="default" text="无需配置，直接使用" /><br/>
                            <Badge status="warning" text="本地系统盘空间较小，不推荐使用系统盘存放图片！" />
                        </div>
                      )}>
                        <RadioButton value="local">本地系统盘</RadioButton>
                    </Popover>
                    <Popover content={(
                        <div>
                            <Badge status="default" text="需要手动完成配置才能使用，配置方法见源码readme" /><br/>
                            <Badge status="processing" text="静态存储访问速度快，空间大，推荐使用此项！" />
                        </div>
                      )}>
                        <RadioButton value="cos">腾讯云静态存储COS</RadioButton>
                    </Popover>
                </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="文章评论邮件提醒" extra={<Alert message="开启后文章收到评论会发送邮件提醒" type="info" showIcon />}>
            {getFieldDecorator('comment_email', {
              rules: [{
                required: true,
                message: '请选择是否开启文章评论邮件提醒'
              }],
              initialValue: Boolean(parseInt(formData.comment_email)),
              valuePropName: 'checked',
            })(
              <Switch checkedChildren="开" unCheckedChildren="关" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="评论回复邮件提醒" extra={<Alert message="开启后评论收到回复会发送邮件提醒" type="info" showIcon />}>
            {getFieldDecorator('reply_email', {
              rules: [{
                required: true,
                message: '请选择是否开启评论回复邮件提醒'
              }],
              initialValue: Boolean(parseInt(formData.reply_email)),
              valuePropName: 'checked',
            })(
              <Switch checkedChildren="开" unCheckedChildren="关" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="网站备案号" extra={<Alert message="有些省份会要求在网站底部添加备案号，并链接到工信部，在这里填写就好，不填则不显示" type="info" showIcon />}>
            {getFieldDecorator('web_icp', {
              initialValue: formData.web_icp
            })(
              <Input placeholder="请输入网站备案号" />
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
  //表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post(window.apiURL + 'settings', values)
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
