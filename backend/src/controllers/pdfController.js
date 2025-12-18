import Trip from "../models/trip.js";

import { generateTripPDF } from "../utils/generateTripPDF.js";

export const downloadTripPDF = async (req, res) => {
  try {
    console.log('PDF Request - User:', req.user.id, 'Role:', req.user.role, 'Trip ID:', req.params.id);
    
    // Admin can download any trip, driver only their own
    const query = req.user.role === 'admin' 
      ? { _id: req.params.id }
      : { _id: req.params.id, driver: req.user.id || req.user._id };

    console.log('PDF Query:', JSON.stringify(query));

    const trip = await Trip.findOne(query)
      .populate("truck", "immatriculation marque modele")
      .populate("trailer", "immatriculation")
      .populate("driver", "fullname email");

    if (!trip) {
      console.log('PDF Error: Trip not found');
      return res.status(404).json({ message: "Trip not found or access denied" });
    }

    console.log('PDF Generation: Trip found, generating PDF...');
    generateTripPDF(trip, res);
  } catch (error) {
    console.error('Download PDF error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  }
};
