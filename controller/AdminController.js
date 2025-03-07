import AdminService from "../services/AdminService.js";

// DASHBOARD PAGE
export const getCountAllUser = async (req, res) => {
  try {
    const lists = await AdminService.getCountAllUsers();
    return res.status(200).json(lists);
  } catch (error) {
    logger.error("Failed to fetch lists.");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCountAllWorkspaceType = async (req, res) => {
  try {
    const lists = await AdminService.getCountAllWorkspaceType();
    return res.status(200).json(lists);
  } catch (error) {
    logger.error(`Failed to fetch workspace counts: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCountAllWorkspaceByMonth = async (req, res) => {
  try {
    const lists = await AdminService.getCountAllWorkspaceByMonth();
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace counts: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCountAllWorkspaceByYear = async (req, res) => {
  try {
    const lists = await AdminService.getCountAllWorkspaceByYear();
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace counts: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// WORKSPACE LIST PAGE

export const getAllWorkspaces = async (req, res) => {
  try {
    const lists = await AdminService.getAllWorkspaces();
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteWorkSpaceByID = async (req, res) => {
  try {
    const lists = await AdminService.deleteWorkSpaceByID(req.params.id);
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMultipleWorkspaces = async (req, res) => {
  try {
    const { ids } = req.body;
    const lists = await AdminService.deleteMultipleWorkspaces(ids);
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// USERS PAGE

export const getAllUsers = async (req, res) => {
  try {
    const lists = await AdminService.getAllUsers();
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMultipleUsers = async (req, res) => {
  try {
    const { ids } = req.body;

    const lists = await AdminService.deleteMultipleUsers(ids);
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editBlockStatus = async (req, res) => {
  try {
    const lists = await AdminService.editBlockStatus(
      req.body.id,
      req.body.blockStatus
    );
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// PREMIUM PAGE

export const getAllPremiumPlan = async (req, res) => {
  try {
    const lists = await AdminService.getAllPremiumPlan();
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePremiumPlanById = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from request parameters
    console.log(id);
    
    if (!id) {
      return res.status(400).json({ error: "Missing premium plan ID" });
    }

    await AdminService.deletePremiumPlanById(id);
    return res
      .status(200)
      .json({ message: "Premium plan deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete premium plan: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMultiplePremiumPlans = async (req, res) => {
  try {
    const { ids } = req.body;
    console.log("Received IDs:", req.body); // Debugging
    
    // Validate the received IDs
    if (!Array.isArray(ids) || ids.length === 0 || !ids.every(id => Number.isInteger(id))) {
      return res
        .status(400)
        .json({ error: "Invalid or empty premium plan IDs. Ensure all IDs are integers." });
    }

    await AdminService.deleteMultiplePremiumPlans(ids);
    return res
      .status(200)
      .json({ message: "Premium plans deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete premium plans: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const editPlan = async (req, res) => {
  try {
    const lists = await AdminService.editPlan(
      req.body.id,
      req.body.description,
      req.body.price
    );
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const createPlan = async (req, res) => {
  try {
    console.log(req.body);
    
    const plans = await AdminService.createPlan(
      req.body.planName,
      req.body.price,
      req.body.duration,
      req.body.description,
    );
    return res.status(200).json(plans);
  } catch (error) {
    console.error(`Failed to fetch Plan ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
