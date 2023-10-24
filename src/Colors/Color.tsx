import React, { memo, FC } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import StarRating from "./StarRating";
import { useColors, Color as ColorType } from "./hooks";

const Trash = memo(FaTrash);
const Rating = memo(StarRating);

type ColorProps = Omit<ColorType, "rating"> & {rating?: number};
const Color: FC<ColorProps> = ({
    id,
    title,
    color,
    rating = 0,
}) => {
    const {
        rateColor,
        removeColor
    } = useColors();

    let navigate = useNavigate();

    return (
        <section
            className="color"
        >
            <h1>{title}</h1>
            <button onClick={() => removeColor(id)}>
                <Trash color="red" />
            </button>
            <div 
                onClick={() => navigate(`/${id}`)}
                style={{
                    height: 50,
                    backgroundColor: color
                }}
            />
            <Rating
                selected={rating}
                onChange={(rating: number) => rateColor(id, rating)}
            />            
        </section>
    );
}

export default Color;
