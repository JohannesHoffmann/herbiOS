import React from "react";
import { Box } from "rebass";
import TripsMenu from "../../touring/TripsMenu";
import List from "../../ui/list/List";
import ListHeader from "../../ui/list/ListHeader";
import ListItem from "../../ui/list/ListItem";
import SwitchToggle from "../../ui/SwitchToggle";

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
                <SwitchToggle label="Lüftung Elektrik" onChange={() => { }} />
            </ListItem>
            <ListItem>
                <SwitchToggle label="Lüftung Kabine" onChange={() => { }} />
            </ListItem>
        </List>
    </Box>
}