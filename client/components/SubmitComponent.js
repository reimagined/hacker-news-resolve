import React, { Component } from 'react';
import uuid from 'uuid';
import { connect } from 'react-redux';
import actions from '../actions/news';

class SubmitComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            url: '',
            text: ''
        };
    }

    handleChange(event, name) {
        this.setState({[name]: event.target.value});
    }

    handleSubmit() {
        if (!this.state.text) {
            this.props.onAddNews(this.props.userId, this.state.title, this.state.url);
        }
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <form onSubmit={() => this.handleSubmit()}>
                    <table border="0">
                        <tbody>
                            <tr>
                                <td>Title</td>
                                <td>
                                    <input
                                        type="text"
                                        value={this.state.title}
                                        onChange={(e) => this.handleChange(e, 'title')}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Url</td>
                                <td>
                                    <input
                                        size="50"
                                        type="text"
                                        value={this.state.url}
                                        onChange={(e) => this.handleChange(e, 'url')}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><b>or</b></td>
                            </tr>
                            <tr>
                                <td>Text</td>
                                <td><textarea name="text" rows="4" cols="49"></textarea></td>
                            </tr>
                            <tr><td></td><td></td></tr>
                            <tr><td></td><td><input type="submit" value="Submit" /></td></tr>
                            <tr><td></td><td><p>Leave url blank to submit a question for discussion. If there is no url, the text (if any) will appear at the top of the thread.</p></td></tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userId: state.user.id
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onAddNews(userId, title, link) {
            return dispatch(
                actions.createNews(uuid.v4(), {
                    title,
                    link,
                    userId
                })
            );
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubmitComponent);


