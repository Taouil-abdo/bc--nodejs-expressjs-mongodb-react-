import express from "express";

import { getAssignedTrips, updateTripStatus, updateTripData,
} from "../controllers/DriverController.js";

import {downloadTripPDF} from '../controllers/pdfController.js'

import {authenticateToken , authorizeRole} from "../middlewares/auth.js";
import { updateStatusSchema, updateTripDataSchema, validate} from "../middlewares/validation.js";

const router = express.Router();

  // Get assigned trips
  router.get( "/my-trips", authenticateToken, authorizeRole(["driver"]),getAssignedTrips);
  
  router.patch( "/:id/status", authenticateToken, authorizeRole(["driver"]), validate(updateStatusSchema),
    updateTripStatus
  );
  // Update trip data (km, fuel, notes)
  router.patch( "/:id/data", authenticateToken, authorizeRole(["driver"]), validate(updateTripDataSchema),
    updateTripData
  );
  router.get("/:id/pdf",authenticateToken,authorizeRole(["driver", "admin"]),downloadTripPDF);

export default router;

