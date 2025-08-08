import useDarkMode from '../darkmode/useDarkMode';
import MainToolBar from '../components/MainToolBar';
import TrainingTree from './TrainingTree';

const TrainingHome = () => {

    useDarkMode();

    return (
        <div className="flex flex-col min-h-screen w-full h-full">
            <MainToolBar />
            <main className="w-full h-full">
                <TrainingTree />
            </main>
        </div>
    );
};

export default TrainingHome;
