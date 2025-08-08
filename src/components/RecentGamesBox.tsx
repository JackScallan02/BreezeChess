import React, { useState, useEffect } from "react";
import { RatingCategory } from "../types/ratingcategories";
import { UserRating } from "../types/userratings";
import { getRatingCategories } from "../api/rating_categories";
import { getUserRatings } from "../api/user_ratings";
import { useAuth } from "../contexts/AuthContext";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';

/*
 This component is currently not being used, but may be used when online play is introduced.
*/

const RecentGamesBox = () => {

    const { user } = useAuth();

    return (

        <div className={`rounded-lg p-4 bg-white dark:bg-slate-800 shadow-md border mt-16 w-full`}>
            <div className="w-full flex justify-center mt-8">
                <p className="text-[2rem] font-medium">Recent Games</p>
            </div>
        </div>
    )
}
export default RecentGamesBox;