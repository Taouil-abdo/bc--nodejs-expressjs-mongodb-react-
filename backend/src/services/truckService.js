import Truck from "../models/truck.js";
import Maintenance from "../models/maintenance.js";

/**
 * Business rule:
 * Maintenance needed every 10,000 km
 */

const needsMaintenance = (currentKm, lastMaintenanceKm) => {
  return currentKm - lastMaintenanceKm >= 10000;
};

export const create = async (data) => {
  // Check unique immatriculation
  const existingTruck = await Truck.findOne({
    immatriculation: data.immatriculation,
  });

  if (existingTruck) {
    throw new Error("Truck already exists");
  }

  return await Truck.create({
    ...data,
    lastMaintenanceKm: data.kilometrageActuel || 0,
  });
};

export const getTrucks = async () => {
  return await Truck.find().populate("tires");
};

export const getOne = async (id) => {
  return await Truck.findById(id).populate("tires");
};

export const update = async (id, data) => {
  const truck = await Truck.findById(id);
  if (!truck) return null;

  // Availability rules
  if (truck.status === "maintenance" && data.status === "in_use") {
    throw new Error("Truck under maintenance cannot be used");
  }

  if (truck.status === "in_use" && data.status === "maintenance") {
    throw new Error("Truck in use cannot go to maintenance");
  }

  Object.assign(truck, data);

  //Automatic maintenance scheduling
  if (
    data.kilometrageActuel &&
    needsMaintenance(truck.kilometrageActuel, truck.lastMaintenanceKm)
  ) {
    truck.status = "maintenance";

    await Maintenance.create({
      truck: truck._id,
      maintenanceType: "oil-change",
      scheduledDate: new Date(),
      status: "scheduled",
    });

    truck.lastMaintenanceKm = truck.kilometrageActuel;
  }

  return await truck.save();
};

export const deleteTruck = async (id) => {
  const truck = await Truck.findById(id);
  if (!truck) return null;

  if (truck.status === "in_use") {
    throw new Error("Cannot delete truck in use");
  }

  return await Truck.findByIdAndDelete(id);
};
