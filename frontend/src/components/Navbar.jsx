import React from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Button,
  MobileNav,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import NavListMenu from "./NavListMenu"; // import the new NavListMenu component

export function NavbarDefault() {
  const baseURL = import.meta.env.VITE_API_URL;
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const user = cookies?.user;
  console.log(user.id,user.first_name)
  const handleLogout = async () => {
    removeCookie("user");
    removeCookie("token");
    localStorage.clear();
  };

  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <Link to="report-incident" className="flex items-center">
          Report Incident
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <Link to="/my-incident" className="flex items-center">
          My Incident
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <Link to="/contact-us" className="flex items-center">
          Contact Us
        </Link>
      </Typography>

      <Typography
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <NavListMenu /> {/* Add NavListMenu component here */}
      </Typography>
    </ul>
  );

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4 mt-2">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography className="mr-4 cursor-pointer py-1.5 font-medium">
          <Link to="/">UOM Safe</Link>
        </Typography>
        <div className="hidden lg:block">{navList}</div>
        <div className="flex items-center gap-x-1">
          {user ? (
            <>
              <span variant="text" size="sm" className="me-8">
                Welcome, {user.first_name}
              </span>
              <Button
                onClick={handleLogout}
                variant="gradient"
                size="sm"
                className="hidden lg:inline-block"
              >
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button
                variant="gradient"
                size="sm"
                className="hidden lg:inline-block"
              >
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <MobileNav open={openNav}>
        <div className="container mx-auto">
          {navList}
          <div className="flex items-center gap-x-1">
            {user ? (
              <Button
                onClick={handleLogout}
                fullWidth
                variant="gradient"
                size="sm"
              >
                <span>Logout</span>
              </Button>
            ) : (
              <Button fullWidth variant="gradient" size="sm">
                <Link to="/login">
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </MobileNav>
    </Navbar>
  );
}

export default NavbarDefault;
