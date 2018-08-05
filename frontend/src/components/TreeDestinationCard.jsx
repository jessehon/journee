import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import CardMedia from "@material-ui/core/es/CardMedia";
import * as _ from 'lodash';

const profiles = require('../data/profiles.json');

const findTreeProfileByDna = (dna) => {
  return _.find(profiles.tree_profiles, { dna });
}

const findSupplierProfileByName = (name) => {
  return _.find(profiles.supplier_profiles, { name });
}

const TreeDestinationCard = (props) => {
  const { classes, treeRow, onClick, activeTreeRowId, title } = props;
  const treeProfile = findTreeProfileByDna(treeRow.dna);
  const supplierProfile = findSupplierProfileByName(treeRow.user);
  const treeRowData = JSON.parse(treeRow.message);

  return (
    <Card
      className={classes.card}
      onClick={onClick}
    >
        <Collapse in={activeTreeRowId === treeRow.prim_key} collapsedHeight="75px">
            <CardContent>
                <Typography variant="headline" component="h2">
                    {treeRowData.description}
                </Typography>
                <Typography style={{fontSize: 12}} color="textSecondary" gutterBottom>
                    {treeRowData.location_name}
                </Typography>
                <div style={{marginTop: 15}} className="more">
                    <img src={treeProfile.image_url} width={175} style={{float: 'left', marginLeft: -24, marginRight: 24}}/>
                    <div>
                        <Typography component="p">
                            {supplierProfile.description}
                        </Typography>
                        <Typography component="p">
                        <img src="/img/text.png" width={180}  style={{marginTop: 20, marginLeft: 24, marginRight: 24}}/>
                        </Typography>

                    </div>
                </div>
            </CardContent>
        </Collapse>
    </Card>
  );
};

export default TreeDestinationCard;
