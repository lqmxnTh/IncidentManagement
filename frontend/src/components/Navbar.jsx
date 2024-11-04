import React, { useEffect, useState } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Button,
  MobileNav,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  BellAlertIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  LightBulbIcon,
  MegaphoneIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import NavListMenu from "./NavListMenu"; // import the new NavListMenu component
import axios from "axios";
import ToggleButton from "react-toggle-button";
import makeRequest from "./../hooks/utils";

export function NavbarDefault() {
  const baseURL = import.meta.env.VITE_API_URL;
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const [profile, setProfile] = useState([]);
  const user = cookies?.user;
  const [toggleValue, setToggleValue] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [refreshNotif, setRefreshNotif] = useState(false);
  const navigate = useNavigate();
  const togglePopup = () => setPopupOpen(!isPopupOpen);

  const handleLogout = async () => {
    removeCookie("user");
    removeCookie("token");
    localStorage.clear();
    navigate("/profiles");
  };

  const [openNav, setOpenNav] = React.useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get(`${baseURL}/api/profiles/user/${user?.id}`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      })
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Error fetching profiles", error));
  }, [baseURL, user]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/notifications/unread/${user?.id}`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      })
      .then(
        (response) => setNotifications(response.data),
        console.log(notifications)
      )
      .catch((error) => console.error("Error fetching notifications", error));
  }, [baseURL, user, refreshNotif]);

  useEffect(() => {
    setToggleValue(profile.is_available);
  }, [baseURL, user, profile]);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const setAvailabilityToFalse = async () => {
    await axios
      .put(
        `${baseURL}/api/profiles/${profile?.id}/`,
        {
          is_available: !toggleValue,
        },
        {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        }
      )
      .catch((error) => console.error("Error fetching profiles", error));

    setToggleValue(!toggleValue);
  };

  const markAsRead = async (id) => {
    await axios
      .put(
        `${baseURL}/api/notifications/${id}/`,
        {
          read_status: true,
        },
        {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        }
      )
      .catch((error) => console.error("Error fetching profiles", error));
    setRefreshNotif(!refreshNotif);
  };

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
      {user && (
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
      )}

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
        {user && profile?.role > 0 && <NavListMenu profile={profile} />}
      </Typography>
    </ul>
  );
  const navListMob = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 border-y-2 pt-2 pb-4">
      <Typography
        as="li"
        variant="large"
        color="blue-gray"
        className="flex items-center gap-x-3 p-1 font-bold"
      >
        <MegaphoneIcon className="h-6 w-6 cursor-pointer" />
        <Link to="report-incident" className="flex items-center">
          Report Incident
        </Link>
      </Typography>
      {user && (
        <Typography
          as="li"
          variant="large"
          color="blue-gray"
          className="flex items-center gap-x-3 p-1 font-bold"
        >
          <LightBulbIcon className="h-6 w-6 cursor-pointer" />
          <Link to="/my-incident" className="flex items-center">
            My Incident
          </Link>
        </Typography>
      )}

      <Typography
        as="li"
        variant="large"
        color="blue-gray"
        className="flex items-center gap-x-3 p-1 font-bold"
      >
        <DevicePhoneMobileIcon className="h-6 w-6 cursor-pointer" />
        <Link to="/contact-us" className="flex items-center">
          Contact Us
        </Link>
      </Typography>
      {user && profile?.role && (
        <Typography
          variant="large"
          color="blue-gray"
          className="flex items-center gap-x-3 p-1 font-bold"
        >
          <DeviceTabletIcon className="h-6 w-6 cursor-pointer" />
          {user && profile?.role && <NavListMenu profile={profile} />}
        </Typography>
      )}
    </ul>
  );

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4 mt-2">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography className="mr-4 cursor-pointer py-1.5 font-medium">
          <Link
            to="/"
            style={{
              fontWeight: "bold",
              backgroundColor: "black",
              color: "white",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            UOM Safe
          </Link>
        </Typography>
        {user && profile?.role > 0 && (
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="flex items-center gap-x-2 p-1 font-medium"
          >
            <div className="hidden lg:block">
              <ToggleButton
                inactiveLabel={<XMarkIcon />}
                activeLabel={<CheckCircleIcon />}
                value={toggleValue}
                onToggle={setAvailabilityToFalse}
              />
            </div>
          </Typography>
        )}

        <div className="hidden lg:block">{navList}</div>
        <div className="hidden lg:block">
          {user && (
            <>
              <div className="relative">
                <Button
                  className="p-1 m-0 bg-transparent text-inherit border-none shadow-none relative"
                  onClick={togglePopup}
                >
                  <div className="relative inline-block">
                    <BellAlertIcon className="h-6 w-6 cursor-pointer" />
                    {/* Notification Badge */}
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full text-xs font-bold text-white bg-red-600 transform translate-x-1/4 -translate-y-1/4">
                      {notifications.length}
                    </span>
                  </div>
                </Button>

                {/* Notification Popup */}
                {isPopupOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
                    <ul className="p-2 space-y-2">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <li
                            key={notification.id}
                            className="flex justify-between items-start p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <div>
                              {/* Notification message and link */}
                              {notification.link_path ? (
                                <a
                                  href={notification.link_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  {notification.message}
                                </a>
                              ) : (
                                <p className="text-sm text-gray-700">
                                  {notification.message}
                                </p>
                              )}

                              {/* Timestamp */}
                              <span className="text-xs text-gray-400 block">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleTimeString()}
                              </span>
                            </div>

                            {/* Mark as Read Button */}
                            <Button
                              onClick={() => markAsRead(notification.id)}
                              className="ml-2 text-[10px] text-white p-2"
                            >
                              Mark as Read
                            </Button>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500">
                          No notifications
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-x-1">
          {user ? (
            <>
              <span
                variant="text"
                size="sm"
                className="me-8 hidden lg:inline-block"
              >
                Welcome, {user?.first_name}
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
            <>
              <XMarkIcon className="h-6 w-6" />
            </>
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <MobileNav open={openNav}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between  border-y-2 pt-2 pb-4 mt-3">
            <span
              variant="text"
              size="sm"
              className="text-black flex items-center justify-start"
            >
              <UserIcon className="h-6 w-6 cursor-pointer text-black" />
              <span className="ml-2 font-bold">{user?.first_name}</span>
            </span>
          </div>
          <div className="flex items-center justify-between flex-col">
            <div className="flex items-center justify-between w-full">
              <Button
                onClick={togglePopup}
                className="p-1 m-0 bg-transparent text-inherit border-none shadow-none relative flex justify-between w-full"
              >
                <span
                  variant="text"
                  size="sm"
                  className="text-black flex items-center justify-start"
                >
                  <BellAlertIcon className="h-6 w-6 cursor-pointer text-black" />
                  <span className="ml-2 font-bold">Notification</span>
                </span>

                <div className="p-1 bg-blue-gray-200 rounded-md">
                  <span className="text-black m-1">{notifications.length}</span>
                </div>
              </Button>
            </div>
            <div>
              {isPopupOpen && (
                <ul className="p-2 space-y-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="flex justify-between items-start p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <div>
                          {/* Notification message and link */}
                          {notification.link_path ? (
                            <a
                              href={notification.link_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {notification.message}
                            </a>
                          ) : (
                            <p className="text-sm text-gray-700">
                              {notification.message}
                            </p>
                          )}

                          {/* Timestamp */}
                          <span className="text-xs text-gray-400 block">
                            {new Date(
                              notification.timestamp
                            ).toLocaleTimeString()}
                          </span>
                        </div>

                        {/* Mark as Read Button */}
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          className="ml-2 text-[10px] text-white p-2"
                        >
                          Mark as Read
                        </Button>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">No notifications</li>
                  )}
                </ul>
              )}
            </div>
          </div>
          {navListMob}
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
