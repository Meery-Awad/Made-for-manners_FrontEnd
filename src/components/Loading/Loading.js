import './Loading.scss';
import { useSelector } from "react-redux";
import { useBetween } from "use-between";



const Loading = () => {
    const state = useSelector((state) => state.data);
    const { Loading } = useBetween(state.useShareState);

    return (
        <div>
            {Loading && (
                <div className="fullscreen-loader">
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Loading;
