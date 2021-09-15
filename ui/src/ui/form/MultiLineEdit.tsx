import { Textarea } from "@rebass/forms";
import React from "react";

type Props = {
    value: string | undefined;
    Wrapper: React.ReactElement;
    onChange?: (value: string) => void;
    addText?: string;
}

export default function MultiLineEdit (props: Props) {
    const {Wrapper, addText} = props;
    const [edit, setEdit] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string | undefined>(props.value);
    const [changed, setChanged] = React.useState<boolean>(false);

    React.useEffect(() => {
        setValue(props.value);
    }, [props.value])

    const onClick = () => {
        setEdit(true);
    }


    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.currentTarget.value);
        setChanged(true);
    }

    const editDone = () => {
        setEdit(false);
        if (changed && props.onChange && value) {
            props.onChange(value);
        }
    }

    if (edit) {
        return <Textarea
            value={value} 
            onChange={onChange}
            onBlur={editDone}
            mb={3}
            autoFocus={true}
            rows={12}
        />
    }

    return <>
        {{
            ...Wrapper,
            props: {
                ...Wrapper.props,
                children: value ? value : addText ? addText : "Text hinzufügen",
                onClick: onClick,
                mb: 3,
                sx: {
                    ...Wrapper.props.sx,
                    whiteSpace: "pre-wrap",
                }
            }
        }}
    </>;
}