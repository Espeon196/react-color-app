import React, { FC } from "react";
import { FaStar } from "react-icons/fa";

type StarProps = {
    selected?: boolean;
    onSelect?: () => void;
}
const Star: FC<StarProps> = ({ selected = false, onSelect = () => {} }) => {
    return <FaStar color={selected ? "red" : "grey"} onClick={onSelect} />;
}

export default Star;
