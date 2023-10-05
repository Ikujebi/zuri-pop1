import logoimg from "../images/Layer 1.png"
import { Link } from "react-router-dom";

const logo = () => {
  return (
    <Link to="https://vercel.com/ikujebi/chrome-extension" target="_blank" rel="noopener noreferrer" className="logo w-[10rem] xl:ml-[3rem] inline-flex justify-center gap-1">
      <img src={logoimg} alt="logo" className="w-[2.2rem] h-[2.2rem]" />
      <h1 className="text-[#100A42] font-bold mt-2 xl:text-[1.2rem] lg:text-[1.2rem] md:text-[.8rem]">
        HelpMeOut
      </h1>
    </Link>
  );
};

export default logo;
