import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import CardMedia from "@material-ui/core/es/CardMedia";

const TreeRowCard = (props) => {
  const { classes, treeRow, onClick, activeTreeRowId } = props;

  return (
    <Card
      className={classes.card}
      onClick={onClick}
    >
        <Collapse in={activeTreeRowId === treeRow.prim_key} collapsedHeight="75px">
            <CardContent>
                <Typography variant="headline" component="h2">
                    {treeRow.user}
                </Typography>
                <Typography style={{fontSize: 12}} color="textSecondary" gutterBottom>
                    {new Date(treeRow.timestamp * 1000).toString()}
                </Typography>
                <div style={{marginTop: 15}} className="more">
                    <img src="img/chair.png" width={175} style={{float: 'left', marginLeft: -24, marginRight: 24}}/>
                    <div>
                        <Typography component="p">
                            {treeRow.dna}
                        </Typography>
                        <Typography component="p">
                            {treeRow.message}
                        </Typography>
                    </div>
                </div>
            </CardContent>
        </Collapse>
    </Card>
  );
};

export default TreeRowCard;
