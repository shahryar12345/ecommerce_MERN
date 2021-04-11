import React, { Component } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({

    root: {
        '&$checked': {
            color: 'rgb(53,60,66)',
        },
    },
    checked: {},
});

class CheckboxesGroup extends Component {
    state = {
        boxes: []
    };

    constructor(props) {
        super(props);
        this.state.boxes = props.boxes;

        let obj = {};

        this.state.boxes.forEach(box => {
            obj[box.id] = box.value;
        });
        this.props.updateValues(obj);

    }

    handleChange = index => event => {
        const data = this.state.boxes;
        data[index].value = !data[index].value;
        this.setState({ boxes: data });

        let obj = {};

        this.state.boxes.forEach(box => {
            obj[box.id] = box.value;
        });
        this.props.updateValues(obj);
    };

    render() {
        const { classes } = this.props;


        return (
            <div>
                <Typography variant="body2" align="left" >
                    {this.props.heading}
                    {this.props.required ? ' * ' : <span style={{ display: 'none' }}>Not Required</span>}
                    <span style={{ paddingRight: 30 }}>{this.props.heading ? ':' : ''}</span>

                    {this.state.boxes.map((box, index) => (
                        <FormControlLabel
                            key={box.label}
                            control={
                                <Checkbox
                                    checked={this.state.boxes[index].value}
                                    onChange={this.handleChange(index)}
                                    value={box.label}
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked,
                                    }}
                                />
                            }
                            label={box.label}
                        />
                    ))}
                </Typography>
            </div>
        )
    }
}

CheckboxesGroup.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckboxesGroup);