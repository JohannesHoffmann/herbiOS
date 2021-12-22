import React from "react";
import { Box, Flex, Text } from "rebass";
import { Switch } from '@rebass/forms'

type Props = {
    label: string;
    value?:boolean;
    onChange: (data: boolean) => void;
    bgOn?: string;
    bgOff?: string;
    icon?: React.ReactElement;
};

export default function SwitchToggle(props: Props) {
    const { label, onChange, icon } = props;
    const [value, setValue] = React.useState<boolean>(props.value !== undefined ? props.value : false);

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
        <Flex
            fontSize={4}
            onClick={() => doSingleClick()}
            height="100%"
            style={{touchAction: "manipulation"}}
        >
            <Box pr={1}>
                {icon}
            </Box>
            <Text 
                fontSize={[3, 3,]} 
                flexGrow={1}
            >
                {label}
            </Text>
            <Switch checked={value} />
        </Flex>
    );
}
