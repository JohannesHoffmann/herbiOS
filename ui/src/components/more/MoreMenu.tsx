import React from "react";
import { Box } from "rebass";
import Fans from "../../fans/Fans";
import Sensors from "../../sensors/Sensors";
import TripsMenu from "../../touring/TripsMenu";
import List from "../../ui/list/List";
import ListHeader from "../../ui/list/ListHeader";
import ListItem from "../../ui/list/ListItem";

type Props = {
    
}

export default function MoreMenu (props: Props) {
    
    
    return <Box>
        <TripsMenu />
        <List>
            <ListHeader>Heizung</ListHeader>
            <ListItem>
                Hysterese
            </ListItem>
        </List>

        <List>
            <ListHeader>Belüftung</ListHeader>
            <ListItem>
                <Fans />
            </ListItem>
        </List>

        <List>
            <ListHeader>Information</ListHeader>
            <ListItem>
                <Sensors />
            </ListItem>
        </List>
        <List>
            <ListHeader>herbiOS</ListHeader>
            <ListItem>
                Version: 0.3.6
            </ListItem>
        </List>
    </Box>
}