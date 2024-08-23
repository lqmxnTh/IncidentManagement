import React from "react";
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  SquaresPlusIcon,
  UserGroupIcon,
  Bars4Icon,
  SunIcon,
  GlobeAmericasIcon,
  PhoneIcon,
  NewspaperIcon,
  RectangleGroupIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import {
    ChevronDownIcon
  } from "@heroicons/react/24/outline";
const navListMenuItems = [
  {
    title: "Dashboard",
    description: "A single Place for all Information",
    icon: SquaresPlusIcon,
    to:"/dashboard"
  },
  {
    title: "Manage Incidents",
    description: "Manage All Incidents Here",
    icon: SquaresPlusIcon,
    to:"/incident"
  },
  {
    title: "Manage Teams",
    description: "Meet and learn about our dedication",
    icon: UserGroupIcon,
    to:"/team"
  },
  {
    title: "Manage Locations",
    description: "Find the perfect solution for your needs.",
    icon: Bars4Icon,
    to:"/locations"
  },
  {
    title: "Manage Users",
    description: "Learn how we can help you achieve your goals.",
    icon: SunIcon,
    to:"/profiles"
  },
  {
    title: "Bar Chart",
    description: "Reach out to us for assistance or inquiries",
    icon: GlobeAmericasIcon,
    to:"/bar"
  },
  {
    title: "Pie Chart",
    description: "Find the perfect solution for your needs.",
    icon: PhoneIcon,
    to:"/pie"
  },
  {
    title: "Line Chart",
    description: "Read insightful articles, tips, and expert opinions.",
    icon: NewspaperIcon,
    to:"/line"
  },
  {
    title: "Geography Chart",
    description: "Find the perfect solution for your needs.",
    icon: RectangleGroupIcon,
    to:"/geography"
  },
];

function NavListMenu() {
  const renderItems = navListMenuItems.map(({ icon, title, description, to }, key) => (
    <a href={to} key={key}>
      <MenuItem className="flex items-center gap-3 rounded-lg">
        <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2 ">
          {React.createElement(icon, {
            strokeWidth: 2,
            className: "h-6 text-gray-900 w-6",
          })}
        </div>
        <div>
          <Typography
            variant="h6"
            color="blue-gray"
            className="flex items-center text-sm font-bold"
          >
            {title}
          </Typography>
          <Typography
            variant="paragraph"
            className="text-xs !font-medium text-blue-gray-500"
          >
            {description}
          </Typography>
        </div>
      </MenuItem>
    </a>
  ));

  return (
    <Menu>
      <MenuHandler>
        <div className="cursor-pointer flex items-center">
          <span className="mr-2">Dashboard</span>
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </MenuHandler>
      <MenuList className="p-1">
        {renderItems}
      </MenuList>
    </Menu>
  );
}

export default NavListMenu;
