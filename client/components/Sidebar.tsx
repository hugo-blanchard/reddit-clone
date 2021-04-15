import dayjs from "dayjs";
import Link from "next/link";

import { Sub } from "../utils/types";
import { useAuthState } from "../context/auth";

interface SidebarProps {
  sub: Sub;
  noSubmit?: Boolean;
}

const Sidebar = ({ sub, noSubmit }: SidebarProps) => {
  const { authenticated } = useAuthState();

  return (
    <div className="w-full md:ml-6 md:w-80">
      <div className="bg-green-500 rounded">
        <p className="p-4 font-semibold">About Community</p>
        <div className="p-4 bg-gray-50">
          <p>{sub.description}</p>
          <div className="flex my-4 font-semibold">
            <p className="flex-1">
              9.99k
              <br />
              members
            </p>
            <p className="flex-1">
              999
              <br />
              online
            </p>
          </div>
          <p className="pt-4 border-t border-gray-300">
            <i className="mr-2 fas fa-birthday-cake" />
            Created {dayjs(sub.createdAt).format("D MMM YYYY")}
          </p>
          {authenticated && !noSubmit && (
            <Link href={`/r/${sub.name}/submit`}>
              <a className="w-full py-2 mt-4 button full">Create Post</a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
