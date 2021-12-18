import { useTheme } from "emotion-theming";

export default function useThemeColor (color?: string) {
    const theme: any = useTheme();
    return color ?
        theme.colors[color] ? theme.colors[color] : color
        : theme.colors.text;
}