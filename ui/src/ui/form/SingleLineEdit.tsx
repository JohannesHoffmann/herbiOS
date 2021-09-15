import { Input } from "@rebass/forms";
import React from "react";
type Props = {
    value: string;
    Wrapper: React.ReactElement;
    onChange?: (value: string) => void;
}

export default function SingleLineEdit (props: Props) {
    const {Wrapper} = props;
    const [edit, setEdit] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string>(props.value);
    const [changed, setChanged] = React.useState<boolean>(false);
    const inputField = React.useRef<HTMLInputElement>();

    const onClick = () => {
        setEdit(true);
    }

    const keypressHandler = (event: any) => {
        if (event.key === "Enter" && inputField.current) {
            inputField.current.blur();
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
        setChanged(true);
    }

    const editDone = () => {
        setEdit(false);
        if (changed && props.onChange) {
            props.onChange(value);
        }
    }

    if (edit) {
        return <Input 
            value={value} 
            onChange={onChange}
            onBlur={editDone}
            mb={3}
            autoFocus={true}
            onKeyPress={event => keypressHandler(event)}
            ref={inputField}
        />
    }

    return <>
        {{
            ...Wrapper,
            props: {
                ...Wrapper.props,
                children: value,
                onClick: onClick,
                mb: 3,
            }
        }}
    </>;
}