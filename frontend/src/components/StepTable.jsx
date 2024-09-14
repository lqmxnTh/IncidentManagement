import React, { useState } from "react";
import { Reorder } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import makeRequest from "../hooks/utils";
import { useParams } from "react-router-dom";
import {
  SquaresPlusIcon,
  UserGroupIcon,
  Bars4Icon,
  SunIcon,
  GlobeAmericasIcon,
  PhoneIcon,
  NewspaperIcon,
  RectangleGroupIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

function StepTable({ steps }) {
  const { id } = useParams();
  const [reorderedSteps, setReorderedSteps] = useState(steps);
  const [emailLoading, setEmailLoading] = useState(false);

  function SaveStepsOrder(arr) {
    try {
      arr.forEach((element, index) => {
        let formatData = {
          step: index + 1,
        };
        makeRequest("PUT", `/api/update-steps/${element.id}/`, formatData);
        console.log("Done For", element.name);
      });
    } catch {
    } finally {
      setEmailLoading(false);
    }
  }

  const handleReorder = (newOrder) => {
    setReorderedSteps(newOrder);
    setTimeout(() => {
      SaveStepsOrder(newOrder);
    }, 5000);
    setEmailLoading(true);
  };

  return (
    <>
      {emailLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <div className="mt-4 text-white">Loading...</div>
          </div>
        </div>
      )}
      <Reorder.Group axis="y" values={reorderedSteps} onReorder={handleReorder}>
        <TableContainer component={Paper}>
          <Table aria-label="steps table">
            <TableHead>
              <TableRow>
                <TableCell>Step</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Attendees</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reorderedSteps.map((step, index) => (
                <Reorder.Item value={step} key={step.id} id={step.id} as={"tr"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{step.name}</TableCell>
                  <TableCell>{step.attendees?.user_name}</TableCell>
                  <TableCell>{step.category?.name || "No Category"}</TableCell>
                  <TableCell align="center">
                    <Button>
                      <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-1 ">
                        {React.createElement(PencilSquareIcon, {
                          strokeWidth: 2,
                          className: "h-6 text-gray-900 w-6",
                        })}
                      </div>
                    </Button>
                  </TableCell>
                </Reorder.Item>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Reorder.Group>
    </>
  );
}

export default StepTable;
