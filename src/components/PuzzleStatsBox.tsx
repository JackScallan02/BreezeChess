import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';
import useDarkMode from '../darkmode/useDarkMode';

const PuzzleStatsBox = () => {

    const { user } = useAuth();

    const [data, setData] = useState<Array<Array<string>>>([]);
    const isDarkMode = useDarkMode();


    useEffect(() => {
        setTimeout(() => {
            setData(
                [
                    [ 'Puzzles completed', '321' ],
                    [ 'Puzzle completion accuracy', '76%' ],
                    [ 'Pieces owned', '32' ],
                    [ 'Complete sets owned', '4' ],
                    [ 'Boards owned', '58' ],
                ]
            );
    }, 1000);
}, [])

return (

    <div className={`rounded-lg p-4 bg-whit dark:bg-slate-800 shadow-md border mt-16 w-full`}>
        <div className="w-full flex justify-center mt-8">
            <p className="text-[2rem] font-medium">Statistics</p>
        </div>
        <div className="flex flex-row justify-evenly pt-8 w-full">
            <div className="w-full">
                <div className="card w-full">
                    {data.length === 0 ? (
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
                            value={data.map(item => ({
                                name: item[0],
                                value: item[1],
                            }))}
                            tableStyle={{ width: '100%' }}
                        >
                            <Column field="name" header="Stat" style={{
                                width: '33%',
                                backgroundColor: isDarkMode ? '#314158' : undefined,
                                color: isDarkMode ? 'white' : undefined
                            }}></Column>
                            <Column field="value" header="Value" style={{
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
export default PuzzleStatsBox;