export const verify_role = async (req, res, next) => {
  try {
    // Check if user is owner
    if(req.user.role !== "owner") {
      return res.status(401).json({ 
        status: "Failed", 
        message: "Only owner can access route, sorry :)"
      })
    }

    next();

  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
}
