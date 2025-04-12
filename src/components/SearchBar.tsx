
import React, { SetStateAction, useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

interface props {
    searchValue: string;
    setSearchValue: React.Dispatch<SetStateAction<string>>;
    searchLabel: string;
    searchBarClasses?: string;
    floatLabelClasses?: string;
    divClasses?: string;
}

const SearchBar: React.FC<props> = ({ searchValue, setSearchValue, searchLabel, searchBarClasses="", floatLabelClasses="", divClasses="" }) => {
    return (
        <div className={`card flex justify-content-center ${divClasses}`}>
            <FloatLabel className={`w-full ${floatLabelClasses}`}>
                <InputText id={searchLabel} className={`pl-2 ${searchBarClasses}`} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                <label htmlFor={searchLabel}>{searchLabel}</label>
            </FloatLabel>
        </div>
    )
}

export default SearchBar;
        