import React, {
    useReducer,
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from "react";
import { v4 } from "uuid";

export const useInput = (initialValue: string) => {
    const [value, setValue] = useState(initialValue);
    return [
        { value, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)},
        () => setValue(initialValue)
    ] as const;
};

export type Color = {
    id: string;
    title: string;
    color: string;
    rating: number;
}
type ColorContextProps = {
    colors: Color[];
    addColor: (title: string, color: string) => void;
    removeColor: (id: string) => void;
    rateColor: (id: string, rating: number) => void;
}
const ColorContext = createContext<ColorContextProps | null>(null);
export const useColors = () => {
    const ctx = useContext(ColorContext);
    if (!ctx) {
        throw new Error("useColors must be used within a ColorProvider")
    }
    return ctx;
};

type Action = |
{
    type: "ADD_COLOR";
    payload: Omit<Color, "rating">;
} |
{
    type: "REMOVE_COLOR";
    payload: Pick<Color, "id">
} |
{
    type: "RATE_COLOR";
    payload: Pick<Color, "id" | "rating">
};
const reducer = (state: Color[] = [], action: Action): Color[] => {
    switch (action.type) {
        case "ADD_COLOR":
            return [
                ...state,
                {
                    id: action.payload.id,
                    title: action.payload.title,
                    color: action.payload.color,
                    rating: 0,
                }
            ];
        case "REMOVE_COLOR":
            return state.filter(c => c.id !== action.payload.id);
        case "RATE_COLOR":
            return state.map(c => 
                c.id !== action.payload.id ? c : {...c, rating: action.payload.rating}
                );
        default:
            return state;
    }
}

interface ColorProviderProps {
    children: React.ReactNode;
}
export const ColorProvider: React.FC<ColorProviderProps> = ({ children }) => {
    const initColors = localStorage.getItem("colors");
    const [_colors, dispatch] = useReducer(
        reducer,
        initColors ? JSON.parse(initColors) : []
    );

    const colors = useMemo(() => _colors, [_colors]);

    const addColor = useCallback((title: string, color: string) => 
        dispatch({
            type: "ADD_COLOR",
            payload: {
                id: v4(),
                title,
                color,
            }
        })
    , []);

    const rateColor = useCallback((id: string, rating: number) => {
        dispatch({
            type: "RATE_COLOR",
            payload: {id, rating}
        });
    }, []);

    const removeColor = useCallback((id: string) => {
        dispatch({
            type: "REMOVE_COLOR",
            payload: { id }
        });
    }, []);

    useEffect(() => {
        localStorage.setItem("colors", JSON.stringify(colors));
    }, [colors]);

    return (
        <ColorContext.Provider value={{ colors, addColor, rateColor, removeColor}}>
            {children}
        </ColorContext.Provider>
    );
};
