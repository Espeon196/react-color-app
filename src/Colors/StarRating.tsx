import React, { FC } from "react";
import Star from "./Star";

type StarRatingProps = {
    total?: number;
    selected?: number;
    onChange?: (i: number) => void;
}
const StarRating: FC<StarRatingProps> = ({
    total = 5,
    selected = 0,
    onChange = i => {}
}) => {
    return (
        <div className="star-rating">
            {[...Array(total)].map((_, i) => (
                <Star
                    key={i}
                    selected={selected > i}
                    onSelect={() => onChange(i+1)}
                />
            ))}
            <p>
                {selected} of {total} stars
            </p>
        </div>
    );
}

export default StarRating;
