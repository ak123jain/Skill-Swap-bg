import { asynchandler } from "../utils/asynchandler.js";
import { Session } from "../models/session.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import dayjs from "dayjs"; // npm i dayjs
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { User } from "../models/user.model.js";
import minMax from "dayjs/plugin/minMax.js";

dayjs.extend(minMax); // ✅ Add this line

dayjs.extend(customParseFormat);

// export const booksession = asynchandler(async (req, res) => {

//     console.log("req body" , req.body);
//     console.log("req params" , req.params.id);
    
//   const { topic } = req.body;
//   const  userADoc = req.user;
//   const   userB  = req.params.id;

//     console.log("userA" ,  userADoc);

//     console.log("userB idd" , userB);

//     const  userBDoc = await User.findById(userB).select("-password -refreshToken");

//     console.log("userB" , userBDoc);

//   if (!userADoc || !userBDoc) {
//     throw new ApiError(404, "One or both users not found");
//   }

//   const sessionDay = dayjs(date).format("dddd"); // E.g., "Monday"

//   console.log("sessionDay" , sessionDay);
  

//   const aAvail = userADoc.availability.find(a => a.day === sessionDay);
//   const bAvail = userBDoc.availability.find(a => a.day === sessionDay);

//   console.log("aAvail" , aAvail);
//   console.log("bAvail" , bAvail);


//   if (!aAvail || !bAvail) {
//     throw new ApiError(400, "No common availability on that day");
//   }

//   // Convert time strings to dayjs objects
//   const aStart = dayjs(`${date} ${aAvail.startTime}`, "YYYY-MM-DD HH:mm");
//   const aEnd = dayjs(`${date} ${aAvail.endTime}`, "YYYY-MM-DD HH:mm");
//   const bStart = dayjs(`${date} ${bAvail.startTime}`, "YYYY-MM-DD HH:mm");
//   const bEnd = dayjs(`${date} ${bAvail.endTime}`, "YYYY-MM-DD HH:mm");

//   // Find overlapping window
//   const startTime = dayjs.max(aStart, bStart);
//   const endTime = dayjs.min(aEnd, bEnd);

//   if (startTime.isSameOrAfter(endTime)) {
//     throw new ApiError(400, "No overlapping availability found");
//   }

//   const session = await Session.create({
//     userA,
//     userB,
//     topic,
//     date,
//     startTime: startTime.format("HH:mm"),
//     endTime: endTime.format("HH:mm")
//   });

//   return res.status(200).json(
//     new ApiResponse(200, { session }, "Session created successfully")
//   );
// });



// get all sessions for current useer





export const booksession = asynchandler(async (req, res) => {
    const { topic } = req.body;
    const userADoc = req.user;
    const userB = req.params.id;
  
    const userBDoc = await User.findById(userB).select("-password -refreshToken");
  
    if (!userADoc || !userBDoc) {
      throw new ApiError(404, "One or both users not found");
    }
  
    let matchedSlot = null;
  
    for (const a of userADoc.availability) {
      const b = userBDoc.availability.find(b => b.day === a.day);
      if (!b) continue;
  
      const aStart = dayjs(`2025-01-01 ${a.startTime}`, "YYYY-MM-DD HH:mm");
      const aEnd = dayjs(`2025-01-01 ${a.endTime}`, "YYYY-MM-DD HH:mm");
      const bStart = dayjs(`2025-01-01 ${b.startTime}`, "YYYY-MM-DD HH:mm");
      const bEnd = dayjs(`2025-01-01 ${b.endTime}`, "YYYY-MM-DD HH:mm");
  
      const startTime = dayjs.max(aStart, bStart);
      const endTime = dayjs.min(aEnd, bEnd);
  
      if (startTime.isBefore(endTime)) {
        matchedSlot = {
          day: a.day,
          startTime: startTime.format("HH:mm"),
          endTime: endTime.format("HH:mm"),
        };
        break; // ✅ Found a match, stop looping
      }
    }
  
    if (!matchedSlot) {
      throw new ApiError(400, "No common availability found to book session");
    }
  
    const session = await Session.create({
      userA: userADoc._id,
      userB,
      topic,
      day: matchedSlot.day,
      startTime: matchedSlot.startTime,
      endTime: matchedSlot.endTime
    });
  
    return res.status(200).json(
      new ApiResponse(200, { session }, "Session created successfully")
    );
  });
  



export const getAllSessions  = asynchandler(async (req , res) =>{

    const user1 = req.user._id;
    const user2 = req.params

    const getsession = await Session.find({
        $or : [{userA : user1 , userB : user2} ]
    }).populate('userA userB', 'fullname username email');


    if (!getsession) {
        throw new ApiError(404, "Session not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200, 
            {getsession},
            "Session found successfully"
        )
    )
})
