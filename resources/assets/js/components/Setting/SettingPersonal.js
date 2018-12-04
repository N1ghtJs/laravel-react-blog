import React, { Component } from 'react';
import { Form, Input, Button, message, Spin, Icon, Upload, Alert } from 'antd';
const FormItem = Form.Item;

export class SettingPersonal extends React.Component {
  render(){
    return (
      <WrappedSettingPersonalForm />
    )
  }
}

class SettingPersonalForm extends React.Component {
  state={
    formData:{
      name: '',
      email: ''
    }
  }
  componentWillMount() {
    if (master) {
        this.setState({
            formData: master,
        })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formData = this.state.formData;
    //上传控件配置
    const props = {
      action: '',
      listType: "picture-card",
      className: "avatar-uploader",
      showUploadList: false,
      beforeUpload: this.beforeUpload,
      headers:{
        'X-CSRF-TOKEN':document.head.querySelector('meta[name="csrf-token"]').content
      }
    };
    //上传按钮
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

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
          <FormItem {...formItemLayout} label="邮箱" extra={<Alert message="更换邮箱后，登录需使用新邮箱" type="warning" showIcon />}>
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
          <FormItem {...formItemLayout} label="头像">
            {getFieldDecorator('avatar', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload {...props}>
                {this.state.imageUrl ? <img src={this.state.imageUrl} style={{width:'100%'}} alt="avatar" /> : uploadButton}
              </Upload>
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
  //上传头像前的校验
  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('仅支持上传JPG格式的图片!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片大小不能大于1MB!');
    }
    if (isJPG && isLt1M) {
        this.getBase64(file, imageUrl => this.setState({
          imageUrl
        }));
    }
    return false;
  }
  //获取图片 base64 地址
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  //可以把 onChange 的参数（如 event）转化为控件的值
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  //表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (values[key]) {
                if (key == 'avatar') {
                    formData.append(key, values[key][0].originFileObj);
                }else {
                    formData.append(key, values[key]);
                }
            }
        })
        axios.post(window.apiURL + 'users/1', formData)
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

//表单布局
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
