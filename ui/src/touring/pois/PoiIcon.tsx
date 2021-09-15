import React from "react";
import IconHiking from "../../ui/icons/IconHiking";
import IconOvernight from "../../ui/icons/IconOvernight";
import IconParking from "../../ui/icons/IconParking";
import IconSightSeeing from "../../ui/icons/IconSightSeeing";
import IconWorking from "../../ui/icons/IconWorking";
import { IconProps } from "../../ui/icons/IIcons";

type Props = {
    typeId: number;
} & IconProps;

export default function PoiIcon(props: Props) {
    const { typeId } = props;


    switch (typeId) {
        case 1:
            return <IconOvernight {...props} />
        case 2:
            return <IconParking {...props} secondary="background" />
        case 3:
            return <IconWorking {...props} secondary="background"  />
        case 4:
            return <IconHiking {...props} secondary="background"  />
        case 5:
            return <IconSightSeeing {...props} secondary="background"  />
    }

    return null;
}