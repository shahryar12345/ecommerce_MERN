import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import Typography from '@material-ui/core/Typography';
import htmlToDraft from 'html-to-draftjs';


export default class WYSIWYGEditor extends Component {
    state = {
        editorState: EditorState.createEmpty(),
    }

    constructor(props) {
        super(props)
        const html = this.props.defaultValue ? this.props.defaultValue : '';
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
            this.props.updateValues(draftToHtml(convertToRaw(editorState.getCurrentContent())));

        }

        console.log("WYSIWYG:")
        console.log(this.props.editorId)
    }





    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        }, () => {
            console.log(this.state)
        });
    };




    render() {

        const { editorState } = this.state;

        return (
            <div>
                <br />
                <Typography variant="body2" align="left" >
                    {this.props.heading}
                    {this.props.required ? ' * ' : <span style={{ display: 'none' }}>Not Required</span>}
                    :
                    </Typography>
                <Editor
                    editorState={editorState}
                    wrapperClassName={styles.editor}
                    editorClassName={styles.editor}
                    onEditorStateChange={this.onEditorStateChange}
                    wrapperStyle={{
                        border: 'solid rgba(0,0,0,0.3) 1px',
                        borderRadius: 4,

                    }}
                    toolbarStyle={{
                        borderRadius: 4
                    }}
                    editorStyle={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        maxHeight: this.props.height,
                        minHeight: this.props.height,
                        marginBottom: 5,
                        cursor: 'text',
                    }}
                    placeholder={this.props.description}
                    onChange={event => {
                        this.props.updateValues(draftToHtml(convertToRaw(editorState.getCurrentContent())));

                    }}
                />

            </div>
        )
    }
}
const styles = ({

    editor: {
        ':&hover': {
            backgroundColor: 'orange'
        }
    }
});
