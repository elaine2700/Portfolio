import { useState } from "react"

const ProfileCard = () => {
    const [vr, setVr] = useState(false);

    const checkToogle = ()=>{
        setVr(!vr);

        const lensImage = document.getElementById("icon-lens");
        if(vr){
            lensImage.className = "invisible transition-right";
        }
        else{
            lensImage.className = "visible transition-normalState";
        }
    };

    return (
        <div className="profile-card window">
            <div className="profile-image">
                <img id="icon-base" src="/src/assets/images/Head.svg" />
                <img id="icon-lens" className="invisible transition-right" src="src/assets/images/Lens.svg" />
                <div id="VR-checkbox">
                    <span>VR</span>
                    <input 
                    id="VR-Toggle" 
                    type="checkbox"
                    checked={vr}
                    onChange={checkToogle} />
                    <label className="switch" htmlFor="VR-Toggle"></label>
                </div>
            </div>
            <div className="name">
                <h1>Elaine Serrano</h1>
                <h2>XR Developer & Designer</h2>
            </div>
        </div>
    )
}

export default ProfileCard