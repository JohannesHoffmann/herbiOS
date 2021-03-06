import { useTheme } from "emotion-theming";
import React from "react";
import { Box, Button, Flex, Heading } from "rebass";
import { useDrag } from "react-use-gesture";
import { useWebSocket } from "../utils/useWebSocket";
import useDoubleClick from 'use-double-click';

interface ILight {
    name: string, 
    id: number, 
    level: number
}

export default function Lights() {
    const height: number = 271;
    const max: number = 100;
    const min: number = 0;
    const theme: any = useTheme();
    const [activeLight, setActiveLight] = React.useState<ILight>({name: "Light", id: 0, level: 0});
    const [lights, getLights] = useWebSocket<Array<ILight>,string>("lights", "/lights");
    const [, changeLight] = useWebSocket<null, {lightId: number, value: number}>("light:change", "/lights");

    const dragValueStart = React.useRef(activeLight.level);

    const changeValue = (light: ILight, value: number) => {
        changeLight({lightId: light.id, value});
    };

    const bind = useDrag(({ event, movement: [, my], first, direction }) => {
        event?.preventDefault();
        event?.stopPropagation();

        if (first) {
            dragValueStart.current = activeLight.level;
        }
        if (direction[0] > 0.5 || direction[0] < -0.5) {
            return;
        }
       
        const newVal = max / window.innerHeight * 2 * my * -1;

        if (dragValueStart.current + newVal > max) {
            changeValue(activeLight, max);
        } else if (dragValueStart.current + newVal < min) {
            changeValue(activeLight, min);
        } else {
            changeValue(activeLight, Math.round(dragValueStart.current + newVal));
        }
    });

    // Request lights if not available
    React.useEffect(() => {
        if (!lights) {
            getLights("");
        }
    }, [lights, getLights]);

    // Set default light
    React.useEffect(() => {
        if (!lights || !activeLight) {
            return;
        }

        const index = lights.findIndex(light => light.id === activeLight.id);
        if (index >= 0) {
            setActiveLight(lights[index]);
        }
        
    }, [lights, activeLight, setActiveLight]);

    const lightButtonClick = (light: ILight) => {
        setActiveLight(light);
        changeValue(light, light.level);
    }

    const lightButtonDoubleClick = (light: ILight) => {
            if (light.level > min) {
                changeValue(light, min);
            }
            if (light.level === min) {
                changeValue(light, 80);
                setActiveLight(light);
            }
        }


    return <>
        <Heading>Licht</Heading>
        <Flex alignItems="center"  justifyContent="center">
            <Box
                {...bind()}
                flexGrow={1}
                pl={[2, 4]}
                pr={[2, 4]}
                sx={{
                    maxWidth: 450,
                    touchAction: "none",
                }}
            >
                <svg width="100%" viewBox="0 0 260 271" >
                    <g id="neutrealSun">
                        <path d="M139.416,49.478c1.301,-1.626 5.284,-8.536 5.69,-8.942c0.407,-0.407 2.846,-6.504 5.284,-7.317c2.439,-0.813 2.439,3.388 1.626,6.097c-1.761,3.794 -6.015,11.95 -8.942,14.226c-3.658,2.846 -5.284,-2.032 -3.658,-4.064Z" style={{fill: theme.colors.grey}}/>
                        <path d="M19.802,134.592c-1.968,-0.68 -9.813,-2.116 -10.332,-2.362c-0.52,-0.247 -7.081,-0.5 -8.665,-2.525c-1.584,-2.025 2.373,-3.433 5.199,-3.576c4.164,0.387 13.275,1.659 16.401,3.653c3.907,2.492 -0.143,5.66 -2.603,4.81Z" style={{fill: theme.colors.grey}}/>
                        <path d="M170.352,68.123c1.728,-1.162 7.596,-6.563 8.106,-6.83c0.509,-0.266 4.661,-5.354 7.231,-5.4c2.57,-0.045 1.313,3.962 -0.273,6.305c-2.816,3.092 -9.316,9.602 -12.789,10.898c-4.342,1.62 -4.434,-3.52 -2.275,-4.973Z" style={{fill: theme.colors.grey}}/>
                        <path d="M37.171,95.666c-1.675,-1.238 -8.731,-4.955 -9.153,-5.346c-0.421,-0.39 -6.607,-2.595 -7.512,-5.001c-0.905,-2.406 3.292,-2.566 6.031,-1.857c3.858,1.615 12.17,5.556 14.556,8.394c2.982,3.547 -1.83,5.357 -3.922,3.81Z" style={{fill: theme.colors.grey}}/>
                        <path d="M21.676,180.127c-1.977,0.654 -9.084,4.274 -9.646,4.393c-0.563,0.119 -5.931,3.9 -8.419,3.251c-2.488,-0.648 -0.197,-4.169 1.962,-5.997c3.545,-2.22 11.559,-6.737 15.253,-7.049c4.618,-0.39 3.321,4.585 0.85,5.402Z" style={{fill: theme.colors.grey}}/>
                        <path d="M113.184,213.281c34.832,0 64.846,-27.425 64.846,-60.224c0,-32.799 -30.014,-69.843 -64.846,-69.843c-34.831,0 -69.286,31.608 -69.286,64.406c0,32.799 34.455,65.661 69.286,65.661Zm-0.35,-9.755c29.344,0 54.628,-23.14 54.628,-50.814c0,-27.674 -25.284,-58.93 -54.628,-58.93c-29.343,0 -58.368,26.669 -58.368,54.343c0,27.674 29.025,55.401 58.368,55.401Z" style={{fill: theme.colors.grey, fillRule: "evenodd", clipRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: 2}} />
                        <path d="M53.653,47.445c1.951,-1.3 5.148,1.897 6.503,3.659c2.439,3.17 7.52,6.91 8.129,8.942c2.247,7.489 -5.69,6.91 -8.129,2.845c-1.045,-1.743 -8.942,-13.82 -6.503,-15.445l0,-0.001Z" style={{fill: theme.colors.grey,}}/>
                        <path d="M67.786,263.756c-1.88,-1.402 0.06,-5.487 1.265,-7.354c2.169,-3.361 3.988,-9.401 5.698,-10.657c6.302,-4.628 8.418,3.043 5.407,6.704c-1.291,1.57 -10.02,13.059 -12.37,11.307Z" style={{fill: theme.colors.grey,}}/>
                        <path d="M101.357,32.518c2.343,0.083 3.071,4.546 3.142,6.767c0.128,3.998 2.068,10.001 1.376,12.007c-2.55,7.391 -8.655,2.285 -8.26,-2.439c0.169,-2.025 0.813,-16.44 3.742,-16.335Z" style={{fill: theme.colors.grey,}}/>
                        <path d="M24.808,227.802c-0.707,-2.236 3.253,-4.418 5.322,-5.23c3.723,-1.461 8.728,-5.302 10.85,-5.323c7.818,-0.076 5.055,7.387 0.473,8.6c-1.965,0.52 -15.761,4.747 -16.645,1.953Z" style={{fill: theme.colors.grey,}}/>
                        <path d="M206.152,208.32c1.57,1.368 8.306,5.638 8.695,6.062c0.389,0.423 6.378,3.116 7.087,5.587c0.71,2.471 -3.487,2.294 -6.16,1.368c-3.716,-1.92 -11.686,-6.514 -13.837,-9.533c-2.689,-3.775 2.253,-5.194 4.215,-3.484Z" style={{fill: theme.colors.grey,}}/>
                        <path d="M167.365,241.093c1.004,1.824 5.863,8.149 6.083,8.68c0.219,0.531 4.919,5.118 4.736,7.682c-0.182,2.564 -4.063,0.957 -6.255,-0.832c-2.83,-3.079 -8.737,-10.131 -9.72,-13.706c-1.228,-4.469 3.9,-4.104 5.156,-1.824Z" style={{fill: theme.colors.grey,}}/>
                        <path d="M124.32,247.417c2.344,-0.061 3.345,4.349 3.552,6.561c0.374,3.983 2.68,9.855 2.112,11.899c-2.09,7.534 -8.497,2.814 -8.394,-1.925c0.044,-2.032 -0.2,-16.46 2.73,-16.535Z" style={{fill: theme.colors.grey,}}/>
                        <path d="M223.318,96.666c0.526,2.285 -3.596,4.144 -5.723,4.787c-3.829,1.158 -9.125,4.586 -11.241,4.437c-7.799,-0.551 -4.448,-7.769 0.217,-8.61c2,-0.361 16.09,-3.47 16.747,-0.614Z" style={{fill: theme.colors.grey,}}/>
                    </g>

                    
                    <use href="#fill" clipPath={"url(#sun)"} />

                    <g transform={"translate(0 " + ((height - 32)/100 * activeLight.level - height + 32) * -1 + ")"}  id="dragHandle" >
                        <path d="M100.63,25c-4.82,0 -8.727,-3.907 -8.727,-8.727l0,-6.273c0,-5.523 4.478,-10 10,-10l20,0c5.523,0 10,4.477 10,10l0,7.326c0,4.238 -3.435,7.674 -7.673,7.674l-1.5,0c-2.168,0 -4.127,1.296 -4.976,3.292c-1.865,4.389 -8.086,4.389 -9.951,0c-0.849,-1.996 -2.808,-3.292 -4.976,-3.292l-2.197,0Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                        <path d="M101.903,16.5c0,-1.38 1.121,-2.5 2.5,-2.5c1.38,0 2.5,1.12 2.5,2.5c0,1.38 -1.12,2.5 -2.5,2.5c-1.379,0 -2.5,-1.12 -2.5,-2.5Z" style={{fill: theme.colors.background}}/>
                        <path d="M109.903,16.5c0,-1.38 1.121,-2.5 2.5,-2.5c1.38,0 2.5,1.12 2.5,2.5c0,1.38 -1.12,2.5 -2.5,2.5c-1.379,0 -2.5,-1.12 -2.5,-2.5Z" style={{fill: theme.colors.background}}/>
                        <path d="M117.903,16.5c0,-1.38 1.121,-2.5 2.5,-2.5c1.38,0 2.5,1.12 2.5,2.5c0,1.38 -1.12,2.5 -2.5,2.5c-1.379,0 -2.5,-1.12 -2.5,-2.5Z" style={{fill: theme.colors.background}}/>
                        <path d="M101.903,8.5c0,-1.38 1.121,-2.5 2.5,-2.5c1.38,0 2.5,1.12 2.5,2.5c0,1.38 -1.12,2.5 -2.5,2.5c-1.379,0 -2.5,-1.12 -2.5,-2.5Z" style={{fill: theme.colors.background}}/>
                        <path d="M109.903,8.5c0,-1.38 1.121,-2.5 2.5,-2.5c1.38,0 2.5,1.12 2.5,2.5c0,1.38 -1.12,2.5 -2.5,2.5c-1.379,0 -2.5,-1.12 -2.5,-2.5Z" style={{fill: theme.colors.background}}/>
                        <path d="M117.903,8.5c0,-1.38 1.121,-2.5 2.5,-2.5c1.38,0 2.5,1.12 2.5,2.5c0,1.38 -1.12,2.5 -2.5,2.5c-1.379,0 -2.5,-1.12 -2.5,-2.5Z" style={{fill: theme.colors.background}}/>
                    </g>
                    
                    <text x="185.737px" y="162.389px" style={{fontFamily:"'Roboto-Regular', 'Roboto'", fontSize: "30.634px", fill: theme.colors.green}}>{activeLight.level}%</text>

                    <defs>
                        <path transform={"translate(0 " + ((height - 32)/100 * activeLight.level - height + 32) * -1 + ")"} id="fill" d="M260,55.485c-102.606,-31.682 -190.023,-33.173 -260,-0l0,215.515l260,-0l0,-215.515Z" style={{fill: theme.colors.primary}} />

                        <clipPath id="sun">
                            <path d="M139.416,49.478c1.301,-1.626 5.284,-8.536 5.69,-8.942c0.407,-0.407 2.846,-6.504 5.284,-7.317c2.439,-0.813 2.439,3.388 1.626,6.097c-1.761,3.794 -6.015,11.95 -8.942,14.226c-3.658,2.846 -5.284,-2.032 -3.658,-4.064Z" style={{fill: "#febf54"}}/>
                            <path d="M19.802,134.592c-1.968,-0.68 -9.813,-2.116 -10.332,-2.362c-0.52,-0.247 -7.081,-0.5 -8.665,-2.525c-1.584,-2.025 2.373,-3.433 5.199,-3.576c4.164,0.387 13.275,1.659 16.401,3.653c3.907,2.492 -0.143,5.66 -2.603,4.81Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                            <path d="M170.352,68.123c1.728,-1.162 7.596,-6.563 8.106,-6.83c0.509,-0.266 4.661,-5.354 7.231,-5.4c2.57,-0.045 1.313,3.962 -0.273,6.305c-2.816,3.092 -9.316,9.602 -12.789,10.898c-4.342,1.62 -4.434,-3.52 -2.275,-4.973Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                            <path d="M37.171,95.666c-1.675,-1.238 -8.731,-4.955 -9.153,-5.346c-0.421,-0.39 -6.607,-2.595 -7.512,-5.001c-0.905,-2.406 3.292,-2.566 6.031,-1.857c3.858,1.615 12.17,5.556 14.556,8.394c2.982,3.547 -1.83,5.357 -3.922,3.81Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                            <path d="M21.676,180.127c-1.977,0.654 -9.084,4.274 -9.646,4.393c-0.563,0.119 -5.931,3.9 -8.419,3.251c-2.488,-0.648 -0.197,-4.169 1.962,-5.997c3.545,-2.22 11.559,-6.737 15.253,-7.049c4.618,-0.39 3.321,4.585 0.85,5.402Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                            <path d="M113.184,213.281c34.832,0 64.846,-27.425 64.846,-60.224c0,-32.799 -30.014,-69.843 -64.846,-69.843c-34.831,0 -69.286,31.608 -69.286,64.406c0,32.799 34.455,65.661 69.286,65.661Z" style={{fill: "#febf54"}}/>
                            <path d="M53.653,47.445c1.951,-1.3 5.148,1.897 6.503,3.659c2.439,3.17 7.52,6.91 8.129,8.942c2.247,7.489 -5.69,6.91 -8.129,2.845c-1.045,-1.743 -8.942,-13.82 -6.503,-15.445l0,-0.001Z" style={{fill: "#febf54"}}/>
                            <path d="M67.786,263.756c-1.88,-1.402 0.06,-5.487 1.265,-7.354c2.169,-3.361 3.988,-9.401 5.698,-10.657c6.302,-4.628 8.418,3.043 5.407,6.704c-1.291,1.57 -10.02,13.059 -12.37,11.307Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                            <path d="M101.357,32.518c2.343,0.083 3.071,4.546 3.142,6.767c0.128,3.998 2.068,10.001 1.376,12.007c-2.55,7.391 -8.655,2.285 -8.26,-2.439c0.169,-2.025 0.813,-16.44 3.742,-16.335Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                            <path d="M24.808,227.802c-0.707,-2.236 3.253,-4.418 5.322,-5.23c3.723,-1.461 8.728,-5.302 10.85,-5.323c7.818,-0.076 5.055,7.387 0.473,8.6c-1.965,0.52 -15.761,4.747 -16.645,1.953Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                            <path d="M206.152,208.32c1.57,1.368 8.306,5.638 8.695,6.062c0.389,0.423 6.378,3.116 7.087,5.587c0.71,2.471 -3.487,2.294 -6.16,1.368c-3.716,-1.92 -11.686,-6.514 -13.837,-9.533c-2.689,-3.775 2.253,-5.194 4.215,-3.484Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                            <path d="M167.365,241.093c1.004,1.824 5.863,8.149 6.083,8.68c0.219,0.531 4.919,5.118 4.736,7.682c-0.182,2.564 -4.063,0.957 -6.255,-0.832c-2.83,-3.079 -8.737,-10.131 -9.72,-13.706c-1.228,-4.469 3.9,-4.104 5.156,-1.824Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                            <path d="M124.32,247.417c2.344,-0.061 3.345,4.349 3.552,6.561c0.374,3.983 2.68,9.855 2.112,11.899c-2.09,7.534 -8.497,2.814 -8.394,-1.925c0.044,-2.032 -0.2,-16.46 2.73,-16.535Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                            <path d="M223.318,96.666c0.526,2.285 -3.596,4.144 -5.723,4.787c-3.829,1.158 -9.125,4.586 -11.241,4.437c-7.799,-0.551 -4.448,-7.769 0.217,-8.61c2,-0.361 16.09,-3.47 16.747,-0.614Z" style={{fill: "#febf54", fillRule: "nonzero"}}/>
                        </clipPath>
                    </defs>


                </svg>
            </Box>
        </Flex>

        {lights && <Flex
            justifyContent="center"
        >

            {lights.map((value, key) => (
                <LightTab
                    key={value.id}
                    name={value.name}
                    value={value.level}
                    active={activeLight.id === value.id}
                    onSingleClick={(e) => {e.preventDefault(); lightButtonClick(value);}}
                    onDoubleClick={(e) => {e.preventDefault(); lightButtonDoubleClick(value)}}
                />
            ))}
            
        </Flex>}
        
        
    </>
}

type LightTabProps = {
    name: string;
    value: number;

    active?: boolean;
    onSingleClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
    onDoubleClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

function LightTab (props: LightTabProps) {
    const {name, value, active, onSingleClick, onDoubleClick} = props;
    const buttonRef = React.useRef();

    useDoubleClick({
        onSingleClick: onSingleClick,
        onDoubleClick: onDoubleClick,
        ref: buttonRef,
        latency: 200
      });

    return <Button
        p={4}
        paddingY={3}
        mr={2}
        sx={{
            backgroundColor: active ? "primary" : "transparent",
            border: "1px solid",
            borderColor: active ? "primary" : "grey",
            color: active ? "white" : "green",
            "& > span": {
                color: active ? "primary" : "grey",
            },
            textTransform: "uppercase",
        }}
        ref={buttonRef}
        onDoubleClick={(e) => e.preventDefault()}
    >
        {name}
        <span><br />
            {value}%
        </span>
    </Button>
}