import React, { Component } from 'react';
import { Icon, Form, Input, Button, Upload, message, Modal, Badge, Select } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

export class ArticleForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      //表单
      id: 0,
      title: '',
      tags: [],
      cover: '',
      editorState: BraftEditor.createEditorState(null),

      //可选标签
      tagsArr: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.article) {
      this.setState({
        id: nextProps.article.id,
        title: nextProps.article.title,
        tags: nextProps.article.tags,
        cover: nextProps.article.cover,
        editorState: BraftEditor.createEditorState(nextProps.article.content_raw)
      });
    }
    if (nextProps.tagsArr) {
      this.setState({
        tagsArr: nextProps.tagsArr,
      });
    }
  }
  render() {
    //表单布局
    const formItemLayout = {
      wrapperCol: {
        sm:{ span:24 },
        md:{ span:24 },
        lg:{ span: 20, offset: 2 }
      },
    };
    //可选标签
    const children = [];
    this.state.tagsArr.map((tag) => {
      children.push(<Option key={tag}>{tag}</Option>)
    })

    return (
      <Form>
        <FormItem
          {...formItemLayout}>
          <Input
            prefix={<Icon type="info-circle-o" />}
            placeholder="输入文章标题"
            ref="title"
            value={this.state.title}
            onChange={this.handelTitleChange} />
        </FormItem>
        <FormItem
          {...formItemLayout}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="添加标签"
            value={this.state.tags}
            onChange={this.handleTagsChange}
          >
            {children}
          </Select>
        </FormItem>
        <FormItem {...formItemLayout}>
          <div  style={{ borderRadius: 5, boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.1)'}}>
            <BraftEditor
              value={this.state.editorState}
              onChange={this.handleEditorChange}
              media={{
                uploadFn:this.uploadFn,
                accepts:{
                  image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
                  video: false,
                  audio: false
                }
              }}
              onSave={this.props.handleSubmit.bind(this, {
                title:this.state.title,
                tags:this.state.tags,
                cover:this.state.cover,
                content_raw:this.state.editorState.toRAW(),
                content_html:this.state.editorState.toHTML()
              })}
            />
          </div>
        </FormItem>
        <FormItem {...formItemLayout} style={{textAlign:'right'}}>
          <Button
            onClick={this.props.handleSubmit.bind(this, {
              title:this.state.title,
              tags:this.state.tags,
              cover:this.state.cover,
              content_raw:this.state.editorState.toRAW(),
              content_html:this.state.editorState.toHTML()
            })}
            type="primary"
            htmlType="submit"
            icon="form"> 保存
          </Button>
        </FormItem>
      </Form>
    )
  }
  //标题改变处理
  handelTitleChange = (e) => {
    let title = this.refs.title.input.value
    this.setState({title: title})
  }
  //标签改变处理
  handleTagsChange = (value) => {
    this.setState({tags: value})
  }
  //编辑器改变处理
  handleEditorChange = (editorState) => {
      this.setState({ editorState })
  }
  //上传图片函数
  uploadFn = (param) => {
    const serverURL = 'z/upload'
    const xhr = new XMLHttpRequest
    const fd = new FormData()

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: imageURL(xhr.responseText)
      })
    }
    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }
    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败！'
      })
    }
    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.setRequestHeader('X-CSRF-TOKEN', document.head.querySelector('meta[name="csrf-token"]').content);
    xhr.send(fd)
  }
  //new function
}
