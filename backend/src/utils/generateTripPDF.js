import PDFDocument from 'pdfkit';

export const generateTripPDF = (trip, res) => {
  try {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=ordre-mission-${trip._id}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text("ORDRE DE MISSION", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(`Mission ID: ${trip._id}`, { align: "center" });
    doc.moveDown(2);

    // Driver Information
    doc.fontSize(14).font('Helvetica-Bold').text("CHAUFFEUR");
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Nom: ${trip.driver?.fullname || 'N/A'}`);
    doc.text(`Email: ${trip.driver?.email || 'N/A'}`);
    doc.moveDown();

    // Vehicle Information
    doc.fontSize(14).font('Helvetica-Bold').text("VEHICULE");
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Camion: ${trip.truck?.immatriculation || 'N/A'}`);
    doc.text(`Marque: ${trip.truck?.marque || 'N/A'} ${trip.truck?.modele || ''}`);
    if (trip.trailer) {
      doc.text(`Remorque: ${trip.trailer?.immatriculation || 'N/A'}`);
    }
    doc.moveDown();

    // Trip Details
    doc.fontSize(14).font('Helvetica-Bold').text("DETAILS DU TRAJET");
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Depart: ${trip.startLocation}`);
    doc.text(`Destination: ${trip.endLocation}`);
    doc.text(`Date de depart: ${new Date(trip.startDate).toLocaleDateString('fr-FR')}`);
    if (trip.endDate) {
      doc.text(`Date d'arrivee: ${new Date(trip.endDate).toLocaleDateString('fr-FR')}`);
    }
    doc.text(`Statut: ${trip.status.toUpperCase().replace('_', ' ')}`);
    doc.moveDown();

    // Kilometrage
    if (trip.startKm || trip.endKm) {
      doc.fontSize(14).font('Helvetica-Bold').text("KILOMETRAGE");
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      if (trip.startKm) doc.text(`Kilometrage depart: ${trip.startKm} km`);
      if (trip.endKm) doc.text(`Kilometrage arrivee: ${trip.endKm} km`);
      if (trip.startKm && trip.endKm) {
        doc.text(`Distance parcourue: ${trip.endKm - trip.startKm} km`);
      }
      doc.moveDown();
    }

    // Fuel
    if (trip.fuelUsed) {
      doc.fontSize(14).font('Helvetica-Bold').text("CARBURANT");
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Carburant utilise: ${trip.fuelUsed} litres`);
      if (trip.fuelCost) {
        doc.text(`Cout: ${trip.fuelCost} MAD`);
      }
      doc.moveDown();
    }

    // Notes
    if (trip.notes) {
      doc.fontSize(14).font('Helvetica-Bold').text("REMARQUES");
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(trip.notes, { width: 500 });
      doc.moveDown();
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).font('Helvetica-Oblique');
    doc.text(`Document genere le ${new Date().toLocaleDateString('fr-FR')} a ${new Date().toLocaleTimeString('fr-FR')}`, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    }
  }
};
