import React from "react";
import { Box, Text } from "rebass";

type Props = {
    label: string;
    value?:boolean;
    onChange: (data: boolean) => void;
    bgOn?: string;
    bgOff?: string;
    icon?: React.ReactElement;
};

export default function OnOffButton(props: Props) {
    const { label, onChange, icon } = props;
    const [value, setValue] = React.useState<boolean>(props.value !== undefined ? props.value : false);
    const bgOn = props.bgOn ? props.bgOn : "primary";
    const bgOff = props.bgOff ? props.bgOff : "grey";

    React.useEffect(() => {
        if (props.value !== undefined && props.value !== value) {
            setValue(props.value);
        }
    }, [props.value, value]);

    const doSingleClick = () => {
        onChange(!value);
        setValue(!value)
    };


    return (
        <Box
            p={3}
            fontSize={4}
            color="white"
            variant="tile"
            bg={!value ? bgOff : bgOn}
            onClick={() => doSingleClick()}
            height="100%"
            style={{touchAction: "manipulation"}}
        >
            <Text fontSize={[3, 4, 5]} color="white">
                {label}
                {icon}
            </Text>
            <Text fontSize={[5, 6, 7]} fontWeight="bold" color="white">
                {!value && <>Aus</>}
                {value && <>An</>}
            </Text>
        </Box>
    );
}
