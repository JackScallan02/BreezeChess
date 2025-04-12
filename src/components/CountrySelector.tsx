import React, { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { updateUserInfo } from '../api/users';
import { getCountries } from '../api/countries';
import { getFlag } from '../helpers/countryHelpers';
import { Country } from '../types/country';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

interface props {
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    handleGetUserInfo: () => void;
}

const CountrySelector: React.FC<props> = ({ openDialog, setOpenDialog, handleGetUserInfo }) => {

    const { user, loading } = useAuth();

    const [loadingCountries, setLoadingCountries] = useState<boolean>(true);
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
    const [query, setQuery] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [layout, setLayout] = useState<any>('grid')
    const [hoverId, setHoverId] = useState<string>('');

    const handleCountryFetch = async () => {
        try {
            setLoadingCountries(true);
            const res = await getCountries();
            setCountries(res);
            setFilteredCountries(res)
            setLoadingCountries(false);
        } catch (err) {
            console.error('Error fetching countries:', err);
        }
    };

    useEffect(() => {
        handleCountryFetch();
    }, []);

    const handleUserCountryUpdate = async () => {
        try {
            if (user && selectedCountry) {
                await updateUserInfo(user.id, { country_id: selectedCountry.id });
                await handleGetUserInfo();
            }

        } catch (error) {
            console.error(error);
        }

    }

    const searchCountry = (input: string) => {
        const q = input.toLowerCase();

        const startsWith = countries.filter(country =>
            country.name.toLowerCase().startsWith(q)
        );

        const contains = countries.filter(
            country =>
                !country.name.toLowerCase().startsWith(q) &&
                country.name.toLowerCase().includes(q)
        );

        setFilteredCountries([...startsWith, ...contains]);
    };

    const handleCountrySelection = (country: any) => {
        if (selectedCountry && selectedCountry.iso_code === country.iso_code) {
            setSelectedCountry(null);
        } else {
            setSelectedCountry(country);
        }
    }

    const getBg = (iso_code: string) => {
        if (iso_code === hoverId && ((selectedCountry && selectedCountry.iso_code !== iso_code) || !selectedCountry)) {
            return 'bg-gray-100 transition-colors duration-250';
        } else if (selectedCountry && iso_code === selectedCountry.iso_code) {
            return 'bg-gray-200 transition-colors duration-250';
        } else {
            return 'bg-white transition-colors duration-250';
        }
    }

    const listItem = (country: any, index: number) => {
        return (
            <div key={country.iso_code}>
                <div onClick={() => handleCountrySelection(country)} onMouseOver={() => setHoverId(country.iso_code)} onMouseLeave={() => setHoverId('')} className={`flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 ${getBg(country.iso_code)} cursor-pointer`}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={getFlag(country.iso_code)} alt={country.name} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className={`text-2xl font-bold text-900 ${(hoverId === country.iso_code || (selectedCountry && selectedCountry.iso_code === country.iso_code)) && 'text-sky-400'}`}>{country.name}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (country: any) => {
        return (
            <div key={country.iso_code} onClick={() => handleCountrySelection(country)} onMouseOver={() => setHoverId(country.iso_code)} onMouseLeave={() => setHoverId('')} className={`p-4 border-1 surface-border surface-card border-round cursor-pointer ${getBg(country.iso_code)}`}>
                <div className="flex flex-column items-center gap-3 py-5">
                    <img className="w-9 shadow-2 border-round" src={getFlag(country.iso_code)} alt={country.name} />
                    <div className={`text-2xl font-bold ${(hoverId === country.iso_code || (selectedCountry && selectedCountry.iso_code === country.iso_code)) && 'text-sky-400'}`}>{country.name}</div>
                </div>
            </div>
        );
    };

    const itemTemplate = (country: any, layout: any, index: number) => {
        if (!country) {
            return;
        }

        if (layout === 'list') return listItem(country, index);
        else if (layout === 'grid') return gridItem(country);
    };

    const listTemplate = (countries: any[], layout: any) => {
        return <div className={`grid grid-nogutter ${layout === 'grid' && 'xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'}`}>{filteredCountries.map((country, index) => itemTemplate(country, layout, index))}</div>;
    };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => { setLayout(e.value); setHoverId(''); setSelectedCountry(null); }} />
            </div>
        );
    };

    const footerContent = () => (
        <div className="flex lg:justify-end justify-center items-center h-[10vh] mt-4">
            <Button label="Cancel" icon="pi pi-times" onClick={() => setOpenDialog(false)} className="p-4 mr-4 w-[15%] h-[60%] min-w-[120px] active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all border-2 border-gray-200" />
            <Button
                label="Submit"
                icon="pi pi-check"
                className="p-4 w-[20%] h-[60%] min-w-[120px] active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all bg-sky-500 text-white" disabled={selectedCountry === null}
                onClick={() => {
                    if (selectedCountry !== null) {
                        setOpenDialog(false);
                        handleUserCountryUpdate();
                    }
                }}
            />
        </div>
    );

    return (
        <Dialog
            header="Change country"
            headerClassName="bc-dark-bg-light"
            contentClassName="bc-dark-bg-light"
            draggable={false}
            resizable={false}
            visible={openDialog}
            style={{ width: '50vw', height: '80vh' }}
            contentStyle={{ minWidth: '400px' }}
            headerStyle={{ minWidth: '400px' }}
            onHide={() => { if (!openDialog) return; setOpenDialog(false); }}
        >
            <div className="flex flex-col justify-between h-full">
                <div>
                    <InputText
                        value={query}
                        onChange={(e) => {
                            const value = e.target.value;
                            setQuery(value);
                            searchCountry(value);
                            setHoverId('');
                            setSelectedCountry(null);
                        }}
                        placeholder="Search country"
                        className="w-full min-w-64 mt-2 text-[1.25rem] border-2 border-gray-200 rounded-lg p-2"
                    />
                    <div className="card">
                        <DataView className="overflow-scroll max-h-[47.5vh]" value={countries} listTemplate={listTemplate} layout={layout} header={header()} />
                    </div>
                </div>
                {footerContent()}
            </div>
        </Dialog>
    )
}
export default CountrySelector;
