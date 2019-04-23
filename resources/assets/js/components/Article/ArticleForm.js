import React, { Component } from 'react';
import { Icon, Form, Input, Button, Upload, message, Modal, Badge, Select, Switch, Popover } from 'antd';
import BraftEditor from 'braft-editor';
import ReactMarkdown from 'react-markdown';
import {markdown} from 'markdown';
import upndown from 'upndown';
import 'braft-editor/dist/index.css'
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const ButtonGroup = Button.Group;

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
      editorMarkdown: '',

      //可选标签
      tagsArr: [],

      //上传封面控件
      loading: false,

      // Modal
      visibleCoverUploadModal: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.article) {
      this.setState({
        id: nextProps.article.id,
        title: nextProps.article.title,
        tags: nextProps.article.tags,
        cover: nextProps.article.cover,
        editorState: BraftEditor.createEditorState(nextProps.article.content_raw),
        editorMarkdown: nextProps.article.content_markdown,
      });
    }
    if (nextProps.tagsArr) {
      this.setState({tagsArr: nextProps.tagsArr});
    }
    this.setState({isMarkdown:nextProps.isMarkdown});
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
    // 封面上传组件
    const CoverUploader = (
      <div style={{width: 400, padding: '0 10px'}}>
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          className="article__cover-uploader"
          action={window.apiURL+'upload'}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          headers={{
            'X-CSRF-TOKEN':document.head.querySelector('meta[name="csrf-token"]').content
          }}
        >
          {this.state.cover&&!this.state.loading ?
            <img src={imageURL(this.state.cover)} alt="avatar" style={{width:'100%'}} /> :
            (<div style={{width:'100%'}}>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
              </div>)
          }
        </Upload>
      </div>
    )
		const ExportMarkdown = () => {
			return (
				<div style={{width: 400, padding: 10}}>
					<TextArea rows={6} value={this.state.html2markdown || ''} />
				</div>
			)
		}
    // editor 扩展控件
    const extendControls = [
      {
        key: 'custom-modal',
        type: 'modal',
        text: '文章封面上传',
        modal: {
          id: 'my-moda-1',
          title: '文章封面设置',
          showFooter: false,
          children: CoverUploader,
        }
      },
			{
        key: 'custom-modal2',
        type: 'modal',
        text: '导出 Markdown',
        modal: {
          id: 'my-moda-2',
          title: '导出 Markdown',
          showFooter: false,
          children: <ExportMarkdown />,
				},
				onClick: () => {
					var und = new upndown();
					und.convert(this.state.editorState.toHTML(), (err, markdown) => {
					    if(err) {
								console.log(err);
							}
					    else {
								this.setState({
									html2markdown: markdown
								})
							}
					});
				}
      }
    ]

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
        {
          this.state.isMarkdown?
          (
            <FormItem
              {...formItemLayout}>
              <Switch checkedChildren="预览" unCheckedChildren="编辑" onChange={v => this.setState({preview:v})} />
              <ButtonGroup style={{marginLeft:20}}>
                <Button size="small" onClick={() => document.getElementById('imageUploader').click()}>
                  <Icon type="picture" />插入图片
                </Button>
                <input type="file" id="imageUploader" name="file" onChange={this.uploadImage} style={{display:'none'}}/>
                <Button size="small" onClick={() => this.setState({visibleCoverUploadModal:true})}>
                  <Icon type="pushpin" />文章封面上传
                </Button>
                <Modal
                  title="文章封面上传"
                  visible={this.state.visibleCoverUploadModal}
                  onCancel={() => this.setState({visibleCoverUploadModal:false})}
                  footer={null}
                >
                  {CoverUploader}
                </Modal>
              </ButtonGroup>
              <a href="http://rexxars.github.io/react-markdown/" target="_blank">
                <Button icon="question" size="small" style={{marginLeft:20}}>Markdown 语法示例</Button>
              </a>
              {
                this.state.preview?
                (
                  <ReactMarkdown
                    className="article__markdown-preview"
                    source={this.state.editorMarkdown}/>
                ):
                (
                  <TextArea
                    id="textarea"
                    autosize={{ minRows: 20, maxRows: 25 }}
                    value={this.state.editorMarkdown}
                    onChange={this.handleTextAreaChange}
                    />
                )
              }
            </FormItem>
          ):
          (
            <FormItem {...formItemLayout}>
              <div  style={{ borderRadius: 5, boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.1)'}}>
                <BraftEditor
                  value={this.state.editorState}
                  onChange={this.handleEditorChange}
                  extendControls={extendControls}
                  media={{
                    uploadFn:this.uploadFn,
                    accepts:{
                      image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
                      video: false,
                      audio: false
                    }
                  }}
                  onSave={this.handleSubmit}
                />
              </div>
            </FormItem>
          )
        }
        <FormItem {...formItemLayout} style={{textAlign:'right'}}>
          <Button
            onClick={this.handleSubmit}
            type="primary"
            htmlType="submit"
            icon="form"> 保存
          </Button>
        </FormItem>
      </Form>
    )
  }
  //保存
  handleSubmit = () => {
    this.props.handleSubmit({
      id:this.state.id,
      title:this.state.title,
      tags:this.state.tags,
      cover:this.state.cover,
      content_raw:this.state.editorState.toRAW(),
      content_html:this.state.isMarkdown?markdown.toHTML(this.state.editorMarkdown):this.state.editorState.toHTML(),
      content_markdown:this.state.editorMarkdown,
      is_markdown:this.state.isMarkdown,
    })
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
  //editor 改变处理
  handleEditorChange = (editorState) => {
      this.setState({ editorState })
  }
  //editor 上传图片函数
  uploadFn = (param) => {
    const serverURL = window.apiURL + 'upload'
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
  //上传封面前的校验
  beforeUpload = (file) => {
    const allowType = ["image/png", "image/jpeg"];
    const isJPGPNG = ~allowType.indexOf(file.type);
    if (!isJPGPNG) {
      message.error('仅支持上传JPG，PNG格式的图片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('仅支持上传小于2MB的图片！');
    }
    return isJPGPNG && isLt2M;
  }
  //上传封面
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({
        cover: info.file.response,
        loading: false,
      });
      message.success('上传成功，保存后生效哦！')
    }
  }
  // markdown 编辑器change函数
  handleTextAreaChange = (e) => {
    this.setState({editorMarkdown: e.target.value});
  }
  // markdown 编辑器上传图片
  uploadImage = (e) => {
    let textarea = document.getElementById('textarea');
    let data = new FormData();
    data.append('file', e.target.files[0]);
    axios.post(window.apiURL+'upload', data)
    .then((response) => {
      let url = `![](${imageURL(response.data)})`;
      this.insertText(textarea, url);
      this.setState({editorMarkdown: textarea.value});
    })
    .catch((error) => {
      console.log(error);
    });
  }
  //在 textarea 光标位置处插入文字
  insertText = (obj,str) => {
      if (document.selection) {
          var sel = document.selection.createRange();
          sel.text = str;
      } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
          var startPos = obj.selectionStart,
              endPos = obj.selectionEnd,
              cursorPos = startPos,
              tmpStr = obj.value;
          obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
          cursorPos += str.length;
          obj.selectionStart = obj.selectionEnd = cursorPos;
      } else {
          obj.value += str;
      }
  }
  //new function
}
