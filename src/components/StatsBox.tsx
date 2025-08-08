import React, { useState, useEffect } from "react";
import { RatingCategory } from "../types/ratingcategories";
import { UserRating } from "../types/userratings";
import { getRatingCategories } from "../api/rating_categories";
import { getUserRatings } from "../api/user_ratings";
import { useAuth } from "../contexts/AuthContext";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';
import useDarkMode from '../darkmode/useDarkMode';

/*
 This component is currently not being used, but may be used when online play is introduced.
*/

const StatsBox = () => {

    const { user } = useAuth();

    const [ratingCategories, setRatingCategories] = useState<Array<RatingCategory>>([]);
    const [userRatings, setUserRatings] = useState<Array<UserRating>>([]);

    const isDarkMode = useDarkMode();

    const fetchRatingData = async () => {
        const ratingCategoriesRes = await getRatingCategories();
        setRatingCategories(ratingCategoriesRes);
        const userRatingsRes = await getUserRatings(user?.id);
        setUserRatings(userRatingsRes);
        console.log(userRatingsRes)
    }

    useEffect(() => {
        fetchRatingData();
    }, []);

    return (

        <div className={`rounded-lg p-4 bg-whit dark:bg-slate-800 shadow-md border mt-16 w-full`}>
            <div className="w-full flex justify-center mt-8">
                <p className="text-[2rem] font-medium">Statistics</p>
            </div>
            <div className="flex flex-row justify-evenly pt-8 w-full">
                <div className="w-full">
                    <div className="card w-full">
                        {ratingCategories.length === 0 ? (
                            <>
                                <div className="flex flex-col space-y-2">
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} height="5vh" />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <DataTable
                                stripedRows
                                value={ratingCategories.map(category => ({
                                    name: category.name[0].toUpperCase() + category.name.slice(1),
                                    rating: userRatings.find(rating => rating.category_id === category.id)?.rating || '---',
                                    numgames: '---' //TODO
                                }))}
                                tableStyle={{ width: '100%' }}
                            >
                                <Column field="name" header="Name" style={{
                                    width: '33%',
                                    backgroundColor: isDarkMode ? '#314158' : undefined,
                                    color: isDarkMode ? 'white' : undefined
                                }}></Column>
                                <Column field="rating" header="Rating" style={{
                                    width: '33%',
                                    backgroundColor: isDarkMode ? '#314158' : undefined,
                                    color: isDarkMode ? 'white' : undefined
                                }}></Column>
                                <Column field="numgames" header="Games Played" style={{
                                    width: '33%',
                                    backgroundColor: isDarkMode ? '#314158' : undefined,
                                    color: isDarkMode ? 'white' : undefined
                                }}></Column>
                            </DataTable>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
export default StatsBox;