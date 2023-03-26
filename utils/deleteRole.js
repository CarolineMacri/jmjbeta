

exports.deleteRole = async (userId, year, deletedRole) => {
    
    const User = require("../models/userModel");

    var user = await User.findById(userId)
    var allYearRoles = user.yearRoles
    var updatedYearRoles = allYearRoles.get(year)

    updatedYearRoles = updatedYearRoles.filter((role) => { return role != deletedRole })
  
    // there were other roles for this year
    if (updatedYearRoles.length > 0) {
        allYearRoles.set(year, updatedYearRoles)
    }
    // deletedRole was the only role, so delete the entry for that year
    else {
        allYearRoles.delete(year)
    }
    user.yearRoles = allYearRoles
    await user.save()
}