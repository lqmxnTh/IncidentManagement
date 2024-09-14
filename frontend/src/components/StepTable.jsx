import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
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
} from "@mui/material";

function StepTable({ steps }) {
  const [reorderedSteps, setReorderedSteps] = useState(steps);
  return (
    <>
      <Reorder.Group
        axis="y"
        values={reorderedSteps}
        onReorder={(newOrder) => setReorderedSteps(newOrder)}
      >
        <TableContainer component={Paper}>
          <Table aria-label="steps table">
            <TableHead>
              <TableRow>
                <TableCell>Step</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Attendees</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reorderedSteps.map((step, index) => (
                <Reorder.Item
                  value={step}
                  key={step.id}
                  id={step.id}
                  as={"tr"}
                >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{step.name}</TableCell>
                    <TableCell>
                      {step.attendees.length > 0
                        ? step.attendees
                            .map((attendee) => attendee.user_name)
                            .join(", ")
                        : "No Attendees"}
                    </TableCell>
                    <TableCell>{step.category?.name || "No Category"}</TableCell>

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
