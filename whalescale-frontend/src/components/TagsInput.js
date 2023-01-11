import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import {Grid} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  }));

const TagsInput = props => {
    const classes = useStyles();
    const [tags,setTags] = React.useState([]);
    const addTags = event => {
        if(event.key ==="," && event.target.value !== "") {
            setTags([...tags, event.target.value]);
            //props.selected([...tags, event.target.value])
            event.target.value = "";
        }
    };
    const removeTags = indexToRemove => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };
    return (
        <div>
            <Grid xs item = '5'>
            <div className="tags-input">
                <u1>
                    {tags.map((tag, index) => 
                    <li key={index}>
                        <Chip
                            label = {tag}
                            onDelete = {()=> removeTags(index)}
                        >
                        </Chip>
                    </li>
                    )}
                </u1>
                <input type="text" placeholder="Press ',' to add tags" onKeyUp={e => e.key === "," ? addTags(e) : null} />
            </div>
            </Grid>
        </div>
    );
}
export default TagsInput
