import Logo from "../components/logo";
import { useRef } from "react";
import closeImg from "../images/close-circle.png";
import setting  from "../images/setting-2.png";


const PopupNav = () => {
    const componentRef = useRef(null);

    const handleClosePopup = () => {
      // Perform actions to close the popup
      console.log("Closing the popup...");
      // Add logic to close the popup, such as setting state or calling a close function.
    };
    
  return (
    <div ref={componentRef} className=" mb-[5rem] text-[#100A42]">
        <nav className="bg-white py-4 w-full top-0 fixed z-10 flex shadow-md hover:shadow-xl px-1 hover:bg-blue-100">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <Logo />
              <div className="responsive font-semibold flex gap-4"></div>

              <div className=" flex gap-2">
                <img 
                  src={setting}
                  alt="profileImg"
                  className="w-[1.3rem] h-[1.4rem]"
                />
                <img 
                  src={closeImg}
                  alt="profileImg"
                  onClick={handleClosePopup}
                  className="w-[1.3rem] h-[1.4rem]"
                />
              </div>
            </div>
          </div>
        </nav>
      </div>
  )
}

export default PopupNav
