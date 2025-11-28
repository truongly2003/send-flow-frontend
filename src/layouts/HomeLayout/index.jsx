import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
function HomeLayout() {
  return (
    <div className="bg-gray-900 min-h-screen ">
      <header className="fixed top-0 left-0 w-full h-16 shadow-md z-20 flex items-center">
        <div className="w-full">
          <Header isShow={false} />
        </div>
      </header>
      <div className="min-h-screen">
        <div className=" ">
          <Outlet />
        </div>
      </div>
     <div className="border-t-2"> <Footer /></div>
    </div>
  );
}

export default HomeLayout;
