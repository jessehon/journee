import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

const TreeRowCard = (props) => {
  const { classes, treeRow, onClick, activeTreeRowId } = props;

  return (
    <Card
      className={classes.card}
      onClick={onClick}
    >
      <CardContent>
          <Collapse in={activeTreeRowId === treeRow.prim_key} collapsedHeight="5px">
              <Typography variant="headline" component="h2">
                  {treeRow.user}
              </Typography>
              <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
                  {new Date(treeRow.timestamp*1000).toString()}
              </Typography>
              <Typography component="pre">
                  {treeRow.dna}
              </Typography>
              <Typography component="pre">
                  {treeRow.message}
              </Typography>
          </Collapse>
      </CardContent>
    </Card>
  );
};

export default TreeRowCard;
